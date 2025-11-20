"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  SlidersHorizontal,
  Search as SearchIcon,
  Grid3x3,
  List,
  ChevronRight,
  Home,
  FolderPlus,
} from "lucide-react";
import NoteListRow from "@/components/notes/NoteListRow";
import NoteGridItem from "@/components/notes/NoteGridItem";
import type {
  NoteOrFolder,
  NoteSortOption,
  NoteViewMode,
  BreadcrumbItem,
} from "@/types/note";
import { Button } from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import DropdownMenu from "@/components/ui/Dropdown";
import useFetchNotes from "@/hooks/notes/use-fetch-notes";
import useDeleteNote from "@/hooks/notes/use-delete-note";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function NotesPage() {
  const router = useRouter();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<NoteSortOption>("lastEdited");
  const [viewMode, setViewMode] = useState<NoteViewMode>("grid");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showItemMenu, setShowItemMenu] = useState<string | null>(null);

  // Fetch notes from backend
  const { notes, isLoading, isError, refetch } = useFetchNotes({
    folderId: currentFolderId || undefined,
    search: searchTerm || undefined,
  });
  const { deleteNote, isDeleting } = useDeleteNote();

  // Convert backend notes to NoteOrFolder format and apply sorting
  const currentItems = useMemo(() => {
    const converted: NoteOrFolder[] = notes.map((note) => ({
      id: note.id,
      name: note.title,
      type: "note" as const,
      parentId: note.folderId || null,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      content: note.content,
      isPinned: false,
    }));

    // Sort function
    const sortItems = (a: NoteOrFolder, b: NoteOrFolder) => {
      switch (sortBy) {
        case "dateCreated":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "lastEdited":
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case "title":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    };

    return converted.sort(sortItems);
  }, [notes, sortBy]);

  // Handle folder navigation
  const handleItemClick = (id: string) => {
    const item = currentItems.find((i) => i.id === id);
    if (item?.type === "folder") {
      setCurrentFolderId(id);
      setBreadcrumbs((prev) => [...prev, { id, name: item.name }]);
    } else {
      router.push(`/notes/${id}`);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Home
      setCurrentFolderId(null);
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setCurrentFolderId(newBreadcrumbs[index].id);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  // Handlers
  const handleCreateNote = () => {
    router.push("/notes/create");
  };

  const handleCreateFolder = () => {
    console.log("Create new folder in:", currentFolderId);
    // TODO: Show create folder modal
  };

  const handleItemMenu = (id: string) => {
    setShowItemMenu(showItemMenu === id ? null : id);
  };

  const handleEdit = (id: string) => {
    router.push(`/notes/${id}/edit`);
    setShowItemMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
    setShowItemMenu(null);
  };

  const handleDownload = (id: string) => {
    const item = currentItems.find((i) => i.id === id);
    if (item && item.type === "note") {
      const blob = new Blob([`${item.name}\n\n${item.content}`], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setShowItemMenu(null);
  };

  // Sort options
  const sortOptions = [
    {
      title: "Last Edited",
      action: () => {
        setSortBy("lastEdited");
        setShowSortMenu(false);
      },
    },
    {
      title: "Date Created",
      action: () => {
        setSortBy("dateCreated");
        setShowSortMenu(false);
      },
    },
    {
      title: "Title",
      action: () => {
        setSortBy("title");
        setShowSortMenu(false);
      },
    },
    {
      title: "Type",
      action: () => {
        setSortBy("type");
        setShowSortMenu(false);
      },
    },
  ];

  const getSortLabel = () => {
    switch (sortBy) {
      case "dateCreated":
        return "Date Created";
      case "lastEdited":
        return "Last Edited";
      case "title":
        return "Title";
      case "type":
        return "Type";
      default:
        return "Sort";
    }
  };

  // Item menu options
  const getItemMenuOptions = (id: string) => {
    const item = currentItems.find((i) => i.id === id);
    const options = [
      {
        title: item?.type === "folder" ? "Open" : "Edit",
        action: () => handleEdit(id),
      },
    ];

    if (item?.type === "note") {
      options.push({
        title: "Download",
        action: () => handleDownload(id),
      });
    }

    options.push({
      title: "Delete",
      action: () => handleDelete(id),
    });

    return options;
  };

  return (
    <div className="space-y-6 sm:px-6 px-4 sm:py-6 py-4">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-raleway font-bold text-heading">
            My Notes
          </h1>
          <p className="text-para-muted mt-2">
            Organize your thoughts with folders and notes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCreateFolder}
            className="flex items-center gap-2"
          >
            <FolderPlus className="w-5 h-5" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
          <Button
            onClick={handleCreateNote}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Note</span>
          </Button>
        </div>
      </motion.div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm"
        >
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className="flex items-center gap-1 text-para hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id}>
              <ChevronRight className="w-4 h-4 text-para-muted" />
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`text-para hover:text-primary transition-colors ${
                  index === breadcrumbs.length - 1
                    ? "font-semibold text-heading"
                    : ""
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </motion.div>
      )}

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex-1 max-w-md">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search notes and folders..."
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-light-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-main-background text-para hover:bg-gray-50"
              }`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-main-background text-para hover:bg-gray-50"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 min-w-[160px] justify-center"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm">Sort: {getSortLabel()}</span>
            </Button>

            {showSortMenu && (
              <div className="absolute right-0 top-full z-10">
                <DropdownMenu
                  options={sortOptions}
                  onClose={() => setShowSortMenu(false)}
                  align="right"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Items Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-sm text-para-muted"
      >
        <span>
          {currentItems.length} item{currentItems.length !== 1 ? "s" : ""}
        </span>
        {searchTerm && <span>• Searching for &quot;{searchTerm}&quot;</span>}
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-20"
        >
          <LoadingSpinner size="lg" />
        </motion.div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <SearchIcon className="w-10 h-10 text-destructive" />
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">
            Failed to load notes
          </h3>
          <p className="text-para-muted text-center max-w-md mb-6">
            There was an error loading your notes. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </motion.div>
      ) : currentItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <SearchIcon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">
            {searchTerm ? "No items found" : "Empty folder"}
          </h3>
          <p className="text-para-muted text-center max-w-md mb-6">
            {searchTerm
              ? `No items match your search for "${searchTerm}".`
              : "Start organizing by creating folders and notes."}
          </p>
          {!searchTerm && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCreateFolder}
                className="flex items-center gap-2"
              >
                <FolderPlus className="w-5 h-5" />
                Create Folder
              </Button>
              <Button
                onClick={handleCreateNote}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Note
              </Button>
            </div>
          )}
        </motion.div>
      ) : viewMode === "list" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border border-light-border rounded-lg overflow-hidden bg-main-background"
        >
          <table className="w-full ">
            <thead className=" border-b border-light-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
                  Modified
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="">
              {currentItems.map((item) => (
                <NoteListRow
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  onMenuClick={handleItemMenu}
                />
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {currentItems.map((item) => (
            <NoteGridItem
              key={item.id}
              item={item}
              onClick={handleItemClick}
              onMenuClick={handleItemMenu}
            />
          ))}
        </motion.div>
      )}

      {/* Item Menu Dropdown */}
      {showItemMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowItemMenu(null)}
        >
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <DropdownMenu
              options={getItemMenuOptions(showItemMenu)}
              onClose={() => setShowItemMenu(null)}
              align="right"
            />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotesHeader from "@/components/notes/NotesHeader";
import NotesBreadcrumbs from "@/components/notes/NotesBreadcrumbs";
import NotesToolbar from "@/components/notes/NotesToolbar";
import NotesEmptyState from "@/components/notes/NotesEmptyState";
import NotesListSkeleton from "@/components/notes/NotesListSkeleton";
import NotesGridSkeleton from "@/components/notes/NotesGridSkeleton";
import CreateFolderModal from "@/components/notes/CreateFolderModal";
import DeleteConfirmation from "@/components/notes/DeleteConfirmation";
import ErrorState from "@/components/notes/ErrorState";
import NotesGridView from "@/components/notes/NotesGridView";
import NotesListView from "@/components/notes/NotesListView";
import type { NoteOrFolder, NoteViewMode, Note } from "@/types/note";
import useFetchNotes from "@/hooks/notes/use-fetch-notes";
import { useBreadcrumbNavigation } from "@/hooks/use-breadcrumb-navigation";
import { useDownloadPdf } from "@/hooks/use-download-pdf";

export default function NotesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams?.get("folderId");

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<NoteViewMode>("grid");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NoteOrFolder | null>(null);

  // Data fetching
  const { notes, folders, isLoading, isError, refetch } = useFetchNotes({
    folderId: folderId || undefined,
    search: searchTerm || undefined,
  });

  // Breadcrumb navigation (with built-in localStorage)
  const {
    breadcrumbs,
    handleBreadcrumbClick,
    handleFolderNavigation,
    handleBackNavigation,
  } = useBreadcrumbNavigation({
    router,
    currentId: folderId || null,
    storageKey: "notesBreadcrumbPath",
    basePath: "/notes",
  });

  // Combine items for display (folders first, then notes) - just add type property
  const items: NoteOrFolder[] = [
    ...folders.map((folder) => ({
      ...folder,
      type: "folder" as const,
    })),
    ...notes.map((note) => ({
      ...note,
      type: "note" as const,
      name: note.title, // Map title to name for consistency
    })),
  ];

  // Handlers
  const handleCreateNote = () => {
    router.push("/notes/create");
  };

  const handleCreateFolder = () => {
    setShowCreateFolderModal(true);
  };

  const handleItemClick = (id: string) => {
    const item = items.find((i) => i.id === id);

    if (item?.type === "folder") {
      handleFolderNavigation(id, item.name);
    } else {
      router.push(`/notes/${id}`);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/notes/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setItemToDelete(item);
    }
  };

  const { downloadPdf } = useDownloadPdf();

  // Item menu options
  const getItemMenuOptions = (id: string) => {
    const item = items.find((i) => i.id === id);
    const options = [
      {
        title: item?.type === "folder" ? "Open" : "Edit",
        action: () => handleEdit(id),
      },
    ];

    if (item?.type === "note") {
      options.push({
        title: "Download",
        action: () => {
          const noteItem = item as Note;
          downloadPdf({
            title: noteItem.title,
            content: noteItem.content,
          });
        },
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
      <NotesHeader
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
      />

      {/* Breadcrumbs */}
      <NotesBreadcrumbs
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />

      {/* Toolbar */}
      <NotesToolbar
        onSearch={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Back Button / Items Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2"
      >
        {folderId && (
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-para hover:bg-light-border/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <span className="text-sm text-para-muted">
          {items.length} item{items.length !== 1 ? "s" : ""}
          {searchTerm && (
            <span className="ml-2">
              • Searching for &quot;{searchTerm}&quot;
            </span>
          )}
        </span>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        viewMode === "list" ? (
          <NotesListSkeleton />
        ) : (
          <NotesGridSkeleton />
        )
      ) : isError ? (
        <ErrorState
          title="Failed to load notes"
          message="There was an error loading your notes. Please try again."
          onRetry={refetch}
        />
      ) : items.length === 0 ? (
        <NotesEmptyState
          searchTerm={searchTerm}
          onCreateNote={handleCreateNote}
          onCreateFolder={handleCreateFolder}
        />
      ) : viewMode === "list" ? (
        <NotesListView
          items={items}
          onItemClick={handleItemClick}
          getItemMenuOptions={getItemMenuOptions}
        />
      ) : (
        <NotesGridView
          items={items}
          onItemClick={handleItemClick}
          getItemMenuOptions={getItemMenuOptions}
        />
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        folderId={folderId}
        searchQuery={searchTerm}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        item={itemToDelete}
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        folderId={folderId || "root"}
        searchQuery={searchTerm}
      />
    </div>
  );
}

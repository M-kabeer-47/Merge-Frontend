"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import NotesHeader from "@/components/notes/NotesHeader";
import NotesBreadcrumbs from "@/components/notes/NotesBreadcrumbs";
import NotesToolbar from "@/components/notes/NotesToolbar";
import CreateFolderModal from "@/components/notes/CreateFolderModal";
import DeleteConfirmation from "@/components/notes/DeleteConfirmation";
import { NotesProvider } from "@/contexts/NotesContext";
import type { NoteOrFolder, NoteViewMode } from "@/types/note";
import useFetchNotes from "@/hooks/notes/use-fetch-notes";

interface NotesPageClientProps {
  children: React.ReactNode;
  folderId: string | null;
}

export default function NotesPageClient({
  children,
  folderId,
}: NotesPageClientProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<NoteViewMode>("grid");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NoteOrFolder | null>(null);

  // Get breadcrumb data from hook
  const { breadcrumb } = useFetchNotes({
    folderId: folderId || undefined,
  });

  // Build breadcrumbs from API data
  const breadcrumbs = useMemo(
    () => [
      {
        id: "root",
        name: "Notes",
        path: "/notes",
      },
      ...breadcrumb.map((item: { id: string; name: string }) => ({
        id: item.id,
        name: item.name,
        path: `/notes?folderId=${item.id}`,
      })),
    ],
    [breadcrumb]
  );

  // Navigate to breadcrumb by index
  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      router.push("/notes");
    } else if (index >= 0 && index < breadcrumbs.length) {
      router.push(breadcrumbs[index].path);
    }
  };

  // Navigate back
  const handleBackNavigation = () => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      router.push(previousBreadcrumb.path);
    }
  };

  // Action handlers
  const handleCreateNote = () => {
    router.push(`/notes/create?folderId=${folderId || ""}`);
  };

  const handleCreateFolder = () => {
    setShowCreateFolderModal(true);
  };

  const handleDeleteItem = (item: NoteOrFolder) => {
    setItemToDelete(item);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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
        searchTerm={searchTerm}
        onSearch={handleSearch}
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
      </motion.div>

      {/* Content with Provider */}
      <NotesProvider
        folderId={folderId}
        search={searchTerm}
        viewMode={viewMode}
        onDeleteItem={handleDeleteItem}
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        setViewMode={setViewMode}
        setSearch={handleSearch}
      >
        {children}
      </NotesProvider>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        folderId={folderId}
        onSuccess={() => setSearchTerm("")}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        item={itemToDelete}
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        folderId={folderId}
        searchQuery={searchTerm}
      />
    </div>
  );
}

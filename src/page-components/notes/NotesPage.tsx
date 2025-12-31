"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
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
}

export default function NotesPageClient({ children }: NotesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams?.get("folderId") || null;

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
  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      if (index === -1) {
        router.push("/notes");
      } else if (index >= 0 && index < breadcrumbs.length) {
        router.push(breadcrumbs[index].path);
      }
    },
    [router, breadcrumbs]
  );

  // Navigate back
  const handleBackNavigation = useCallback(() => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      router.push(previousBreadcrumb.path);
    }
  }, [router, breadcrumbs]);

  // Action handlers
  const handleCreateNote = useCallback(() => {
    router.push(`/notes/create?folderId=${folderId || ""}`);
  }, [router, folderId]);

  const handleCreateFolder = useCallback(() => {
    setShowCreateFolderModal(true);
  }, []);

  const handleDeleteItem = useCallback((item: NoteOrFolder) => {
    setItemToDelete(item);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

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

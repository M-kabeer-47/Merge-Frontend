import React from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { NoteOrFolder } from "@/types/note";
import useDeleteNote from "@/hooks/notes/use-delete-note";
import useDeleteFolder from "@/hooks/notes/use-delete-folder";

interface DeleteConfirmationProps {
  item: NoteOrFolder | null;
  isOpen: boolean;
  onClose: () => void;
  folderId: string | null;
  searchQuery: string;
}

/**
 * Delete confirmation component that wraps ConfirmDialog
 * Handles delete confirmation for both notes and folders
 */
export default function DeleteConfirmation({
  item,
  isOpen,
  onClose,
  folderId,
  searchQuery,
}: DeleteConfirmationProps) {
  const { deleteNote, isDeleting: isDeletingNote } = useDeleteNote();
  const { deleteFolder, isDeleting: isDeletingFolder } = useDeleteFolder();

  const isDeleting = isDeletingNote || isDeletingFolder;

  if (!item) return null;

  const handleConfirm = async () => {
    if (item.type === "folder") {
      await deleteFolder({
        folderId: item.id,
        parentFolderId: folderId,
        searchQuery: searchQuery,
      });
    } else {
      await deleteNote({
        noteId: item.id,
        folderId: folderId,
        searchQuery: searchQuery,
      });
    }
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`Delete ${item.type === "folder" ? "Folder" : "Note"}`}
      itemName={"name" in item ? item.name : item.title}
      message="Are you sure you want to delete"
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={isDeleting}
      variant="danger"
    />
  );
}

import React from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { NoteOrFolder } from "@/types/note";

interface DeleteConfirmationProps {
    item: NoteOrFolder | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: (item: NoteOrFolder) => Promise<void>;
    isDeleting: boolean;
}

/**
 * Delete confirmation component that wraps ConfirmDialog
 * Handles delete confirmation for both notes and folders
 */
export default function DeleteConfirmation({
    item,
    isOpen,
    onClose,
    onConfirmDelete,
    isDeleting,
}: DeleteConfirmationProps) {
    if (!item) return null;

    const handleConfirm = async () => {
        await onConfirmDelete(item);
    };

    return (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirm}
            title={`Delete ${item.type === "folder" ? "Folder" : "Note"}`}
            itemName={item.name}
            message="Are you sure you want to delete"
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
            variant="danger"
        />
    );
}

"use client";

import React from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type {
  RoomContentItem,
  RoomContentFile,
  ContentSortBy,
  ContentSortOrder,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";
import useDeleteFile from "@/hooks/rooms/use-delete-file";
import useDeleteContentFolder from "@/hooks/rooms/use-delete-content-folder";

interface DeleteConfirmationProps {
  item: RoomContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  folderId?: string | null;
  searchQuery?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

/**
 * Delete confirmation component for room content
 * Handles delete confirmation for both files and folders
 */
export default function DeleteConfirmation({
  item,
  isOpen,
  onClose,
  roomId,
  folderId,
  searchQuery = "",
  sortBy,
  sortOrder,
}: DeleteConfirmationProps) {
  const { deleteFile, isDeleting: isDeletingFile } = useDeleteFile({
    roomId,
    folderId,
    searchQuery,
    sortBy,
    sortOrder,
  });

  const { deleteFolder, isDeleting: isDeletingFolder } = useDeleteContentFolder(
    {
      roomId,
      parentFolderId: folderId,
      searchQuery,
      sortBy,
      sortOrder,
    }
  );

  const isDeleting = isDeletingFile || isDeletingFolder;

  if (!item) return null;

  const isFolder = isRoomContentFolder(item);

  // Get the display name based on item type
  const getItemName = (): string => {
    if (isFolder) {
      return item.name;
    }
    return (item as RoomContentFile).originalName;
  };

  const handleConfirm = async () => {
    if (isFolder) {
      await deleteFolder(item.id);
    } else {
      await deleteFile(item.id);
    }
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`Delete ${isFolder ? "Folder" : "File"}`}
      itemName={getItemName()}
      message="Are you sure you want to delete"
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={isDeleting}
      variant="danger"
    />
  );
}

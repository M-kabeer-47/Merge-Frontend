"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Trash2, FolderOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import useBulkDelete from "@/hooks/rooms/use-bulk-delete";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

interface BulkActionBarProps {
  selectedCount: number;
  selectedIds: Set<string>;
  contentItems: Array<{ id: string; type: "folder" | "file" }>;
  onClearSelection: () => void;
  // Bulk delete props
  roomId: string;
  folderId?: string | null;
  onResetFilters?: () => void;
  // Other bulk actions
  onTag?: () => void;
  onMove?: () => void;
  onDownload?: () => void;
}

export default function BulkActionBar({
  selectedCount,
  selectedIds,
  contentItems,
  onClearSelection,
  roomId,
  folderId,
  onResetFilters,
  onTag,
  onMove,
  onDownload,
}: BulkActionBarProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Bulk delete hook
  const { bulkDelete, isDeleting } = useBulkDelete({
    roomId,
    folderId,
    onSuccess: onResetFilters,
  });

  // Handle bulk delete
  const handleBulkDelete = async () => {
    // Separate selected items into files and folders
    const fileIds: string[] = [];
    const folderIds: string[] = [];

    selectedIds.forEach((id) => {
      const item = contentItems.find((i) => i.id === id);
      if (item) {
        if (item.type === "folder") {
          folderIds.push(id);
        } else {
          fileIds.push(id);
        }
      }
    });

    await bulkDelete({ fileIds, folderIds });
    onClearSelection();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-light-border bg-secondary/5 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center justify-between gap-4">
              {/* Selection Count */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearSelection}
                  className="text-para hover:text-primary transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-heading">
                  {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                </span>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                {onTag && (
                  <Button
                    variant="outline"
                    className="h-9 px-3 flex items-center gap-2"
                    onClick={onTag}
                    aria-label="Add tags to selected items"
                  >
                    <Tag className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Tag</span>
                  </Button>
                )}
                {onMove && (
                  <Button
                    variant="outline"
                    className="h-9 px-3 flex items-center gap-2"
                    onClick={onMove}
                    aria-label="Move selected items"
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Move</span>
                  </Button>
                )}
                {onDownload && (
                  <Button
                    variant="outline"
                    className="h-9 px-3 flex items-center gap-2"
                    onClick={onDownload}
                    aria-label="Download selected items"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">Download</span>
                  </Button>
                )}
                {/* Delete button - always available */}
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  aria-label="Delete selected items"
                  className="w-[120px]"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Delete</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Items"
        message="Are you sure you want to delete"
        itemName={`${selectedCount} selected item${
          selectedCount > 1 ? "s" : ""
        }`}
        confirmText="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}

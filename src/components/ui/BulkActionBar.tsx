"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Download, Trash2, FolderOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onTag?: () => void;
  onMove?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onTag,
  onMove,
  onDownload,
  onDelete,
}: BulkActionBarProps) {
  return (
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
              {onDelete && (
                <Button
                  variant="outline"
                  className="h-9 px-3 flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/30"
                  onClick={onDelete}
                  aria-label="Delete selected items"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Delete</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

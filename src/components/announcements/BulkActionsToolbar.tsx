"use client";

import React from "react";
import { X, Trash2, Pin, PinOff, CheckCircle, Download } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onMarkRead?: () => void;
  onExport?: () => void;
}

export default function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onDelete,
  onPin,
  onUnpin,
  onMarkRead,
  onExport,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className="bg-secondary text-white shadow-lg sticky top-0 z-30"
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Selection Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClearSelection}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label="Clear selection"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-[14px] font-semibold">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {onMarkRead && (
            <button
              onClick={onMarkRead}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-all"
              aria-label="Mark as read"
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Mark Read</span>
            </button>
          )}

          {onPin && (
            <button
              onClick={onPin}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-all"
              aria-label="Pin selected"
            >
              <Pin className="h-4 w-4" />
              <span className="hidden sm:inline">Pin</span>
            </button>
          )}

          {onUnpin && (
            <button
              onClick={onUnpin}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-all"
              aria-label="Unpin selected"
            >
              <PinOff className="h-4 w-4" />
              <span className="hidden sm:inline">Unpin</span>
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[13px] font-medium transition-all"
              aria-label="Export selected"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-destructive hover:bg-destructive/90 rounded-lg text-[13px] font-medium transition-all"
              aria-label="Delete selected"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

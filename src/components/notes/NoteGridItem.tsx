"use client";

import React from "react";
import {
  Folder,
  FileText,
  MoreVertical,
  Pin,
} from "lucide-react";
import type { NoteOrFolder, NoteItem, FolderItem } from "@/types/note";

interface NoteGridItemProps {
  item: NoteOrFolder;
  onClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

export default function NoteGridItem({
  item,
  onClick,
  onMenuClick,
}: NoteGridItemProps) {
  const isFolder = item.type === "folder";
  const noteItem = item as NoteItem;
  const folderItem = item as FolderItem;

  // Get color classes
  const getColorClasses = () => {
    if (isFolder) {
      return {
        bg: "bg-secondary/5",
        border: "border-secondary/20",
        text: "text-secondary",
        hover: "hover:border-secondary/40",
      };
    }
    // Use consistent secondary color for all notes
    return {
      bg: "bg-secondary/5",
      border: "border-secondary/20",
      text: "text-secondary",
      hover: "hover:border-secondary/40",
    };
  };

  const colors = getColorClasses();

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get preview
  const getPreview = () => {
    if (isFolder) return `${folderItem.itemCount} items`;
    const lines = noteItem.content.split("\n").filter((line) => line.trim());
    return lines.slice(0, 2).join(" ").substring(0, 100) + "...";
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-lg border ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-200 hover:shadow-sm p-4`}
      onClick={() => onClick?.(item.id)}
    >
      {/* Pinned indicator */}
      {item.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin className="w-3.5 h-3.5 text-accent" fill="currentColor" />
        </div>
      )}

      {/* Icon */}
      <div className="mb-3">
        {isFolder ? (
          <Folder className="w-12 h-12 text-secondary" fill="currentColor" />
        ) : (
          <FileText className="w-12 h-12 text-secondary" />
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3 className={`text-base font-semibold ${colors.text} font-raleway line-clamp-1 mb-1 pr-6`}>
          {item.name}
        </h3>
        <p className="text-sm text-para-muted line-clamp-2">
          {getPreview()}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-para-muted">
        <span>{formatDate(item.updatedAt)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(item.id);
          }}
          className="p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


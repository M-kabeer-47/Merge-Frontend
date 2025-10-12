"use client";

import React from "react";
import {
  Folder,
  FileText,
  MoreVertical,
  Pin,
} from "lucide-react";
import type { NoteOrFolder, NoteItem, FolderItem } from "@/types/note";

interface NoteListRowProps {
  item: NoteOrFolder;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

export default function NoteListRow({
  item,
  onClick,
  onMenuClick,
}: NoteListRowProps) {
  const isFolder = item.type === "folder";
  const noteItem = item as NoteItem;
  const folderItem = item as FolderItem;

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get preview for notes
  const getPreview = () => {
    if (isFolder) return `${folderItem.itemCount} items`;
    const lines = noteItem.content.split("\n").filter((line) => line.trim());
    return lines[0]?.substring(0, 100) || "Empty note";
  };

  return (
    <tr
      className="border-b border-light-border cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(item.id)}
    >
      {/* Icon and Name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          {isFolder ? (
            <Folder
              className="w-10 h-10 text-secondary flex-shrink-0"
              fill="currentColor"
            />
          ) : (
            <FileText className="w-10 h-10 text-secondary flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold text-heading truncate">
                {item.name}
              </p>
              
            </div>
            <p className="text-[13px] text-para-muted truncate">
              {getPreview()}
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="w-[120px] px-4 py-3.5">
        <span className="text-[14px] text-para capitalize">{item.type}</span>
      </td>

      {/* Last Modified */}
      <td className="w-[180px] px-4 py-3.5">
        <span className="text-[14px] text-para">
          {formatDate(item.updatedAt)}
        </span>
      </td>

      {/* Menu */}
      <td className="w-[50px] px-4 py-3.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(item.id);
          }}
          className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-para-muted" />
        </button>
      </td>
    </tr>
  );
}
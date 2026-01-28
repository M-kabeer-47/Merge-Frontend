"use client";

import React, { useState, useRef } from "react";
import { Folder, FileText, MoreVertical } from "lucide-react";
import type { NoteOrFolder, NoteItem, FolderItem } from "@/types/note";
import DropdownMenu from "@/components/ui/Dropdown";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface NoteListRowProps {
  item: NoteOrFolder;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  menuOptions?: Array<{ title: string; action: () => void }>;
}

export default function NoteListRow({
  item,
  onClick,
  menuOptions,
}: NoteListRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isFolder = item.type === "folder";
  const noteItem = item as NoteItem;
  const folderItem = item as FolderItem;

  useOnClickOutside(menuRef, () => setShowMenu(false), showMenu);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get preview for notes

  return (
    <tr
      className="border-b border-light-border hover:bg-background cursor-pointer transition-colors"
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
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-para-muted" />
          </button>
          {showMenu && menuOptions && (
            <div className="absolute right-0 top-full mt-1 z-20">
              <DropdownMenu
                options={menuOptions}
                onClose={() => setShowMenu(false)}
                align="right"
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

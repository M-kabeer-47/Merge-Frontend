"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Folder,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  File,
  FileCode,
  FileSpreadsheet,
  Presentation,
  MoreVertical,
  Pin,
} from "lucide-react";
import type { BaseDisplayItem, MenuOption } from "@/types/display-item";
import DropdownMenu from "@/components/ui/Dropdown";

interface SharedListRowProps {
  item: BaseDisplayItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  menuOptions?: MenuOption[];
  showOwner?: boolean;
}

function ItemIcon({ item }: { item: BaseDisplayItem }) {
  const iconClass = `h-8 w-8 sm:h-10 sm:w-10 ${
    item.iconColor || "text-secondary"
  }`;

  switch (item.iconType) {
    case "folder":
      return <Folder className={iconClass} fill="currentColor" />;
    case "note":
    case "pdf":
    case "document":
      return <FileText className={iconClass} />;
    case "presentation":
      return <Presentation className={iconClass} />;
    case "spreadsheet":
      return <FileSpreadsheet className={iconClass} />;
    case "image":
      return <FileImage className={iconClass} />;
    case "video":
      return <FileVideo className={iconClass} />;
    case "audio":
      return <FileAudio className={iconClass} />;
    case "archive":
      return <FileArchive className={iconClass} />;
    case "code":
      return <FileCode className={iconClass} />;
    default:
      return <File className={iconClass} />;
  }
}

export default function SharedListRow({
  item,
  isSelected = false,
  onSelect,
  onClick,
  menuOptions,
  showOwner = true,
}: SharedListRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const modifiedAt = item.updatedAt;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <tr
      className={`
        border-b border-light-border cursor-pointer hover:bg-background transition-colors
        ${isSelected ? "bg-gray-50" : ""}
      `}
      onClick={() => onClick?.(item.id)}
    >
      {/* Checkbox */}
      {onSelect && (
        <td className="w-12 px-3 py-3">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.id);
            }}
            className="flex items-center justify-center"
          >
            <div
              className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-secondary border-secondary"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
        </td>
      )}

      {/* Name with Icon */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <ItemIcon item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className="text-sm sm:text-[15px] font-semibold text-heading truncate"
                title={item.name}
              >
                {item.name}
              </p>
              {item.isPinned && (
                <Pin
                  className="w-3.5 h-3.5 text-accent flex-shrink-0"
                  fill="currentColor"
                />
              )}
            </div>
            {item.metadata && (
              <p className="text-xs sm:text-[13px] text-para-muted">
                {item.metadata}
                {/* Show date on mobile */}
                <span className="sm:hidden">
                  {" • "}
                  {modifiedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Owner - hidden on mobile */}
      {showOwner && (
        <td className="hidden sm:table-cell px-3 py-3 w-[180px]">
          <div className="text-sm text-para truncate">{item.owner || "-"}</div>
        </td>
      )}

      {/* Last Modified - hidden on mobile */}
      <td className="hidden sm:table-cell px-3 py-3 w-[200px]">
        <div className="text-sm text-para whitespace-nowrap">
          {modifiedAt.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}{" "}
          |{" "}
          {modifiedAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </td>

      {/* Menu */}
      <td className="w-12 px-3 py-3">
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5 text-para-muted" />
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

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

interface SharedGridCardProps {
  item: BaseDisplayItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  menuOptions?: MenuOption[];
}

function ItemIcon({ item }: { item: BaseDisplayItem }) {
  const iconClass = `w-12 h-12 ${item.iconColor || "text-secondary"}`;

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

// Format date for display
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function SharedGridCard({
  item,
  isSelected = false,
  onSelect,
  onClick,
  menuOptions,
}: SharedGridCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div
      className={`
        relative group cursor-pointer rounded-lg border transition-all duration-200 hover:shadow-sm p-4
        ${
          isSelected
            ? "border-secondary bg-secondary/5"
            : "border-secondary/20 hover:border-secondary/40"
        }
      `}
      onClick={() => onClick?.(item.id)}
    >
      {/* Pinned indicator */}
      {item.isPinned && (
        <div className="absolute top-3 right-10">
          <Pin className="w-3.5 h-3.5 text-accent" fill="currentColor" />
        </div>
      )}

      {/* Selection checkbox */}
      {onSelect && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div
            className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all cursor-pointer ${
              isSelected
                ? "bg-secondary border-secondary"
                : "border-gray-300 hover:border-gray-400 bg-white"
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
      )}

      {/* Menu button */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-para-muted" />
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

      {/* Icon */}
      <div className="mb-3 mt-2">
        <ItemIcon item={item} />
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3
          className="text-base font-bold text-heading font-raleway line-clamp-1 mb-1"
          title={item.name}
        >
          {item.name}
        </h3>
        {item.metadata && (
          <p className="text-xs text-para-muted">{item.metadata}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-para-muted">
        {item.owner ? (
          <span className="truncate max-w-[60%]" title={item.owner}>
            {item.owner}
          </span>
        ) : (
          <span />
        )}
        <span>{formatDate(item.updatedAt)}</span>
      </div>
    </div>
  );
}

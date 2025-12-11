"use client";

import React from "react";
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
} from "lucide-react";
import type { ContentItem, FileItem, FolderItem } from "@/types/content";
import {
  getFileIconType,
  getFileIconColor,
  formatFileSize,
} from "@/utils/file-helpers";

interface ContentGridItemProps {
  item: ContentItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

function ItemIcon({ item }: { item: ContentItem }) {
  if (item.type === "folder") {
    return (
      <Folder
        className="h-8 w-8 sm:h-10 sm:w-10 text-secondary"
        fill="currentColor"
      />
    );
  }

  const fileItem = item as FileItem;
  const iconType = getFileIconType(fileItem.fileType);
  const iconColor = getFileIconColor(fileItem.fileType);
  const iconClass = `h-8 w-8 sm:h-10 sm:w-10 ${iconColor}`;

  switch (iconType) {
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

export default function ContentGridItem({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onMenuClick,
}: ContentGridItemProps) {
  const isFolder = item.type === "folder";
  const fileItem = item as FileItem;
  const folderItem = item as FolderItem;

  const metadataText = isFolder
    ? `${folderItem.itemCount} items`
    : formatFileSize(fileItem.size);

  return (
    <div
      className={`
        grid gap-2 sm:gap-4 px-3 py-3 sm:py-4 border-b border-light-border 
        cursor-pointer hover:bg-background transition-colors
        grid-cols-[40px_1fr_40px] sm:grid-cols-[50px_1fr_180px_200px_50px]
        ${isSelected ? "bg-gray-50" : ""}
      `}
      onClick={() => onClick?.(item.id)}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(item.id);
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

      {/* Name with Icon and Metadata */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <ItemIcon item={item} />
        <div className="min-w-0 flex-1">
          <p
            className="text-sm sm:text-[15px] font-semibold text-heading truncate leading-tight"
            title={item.name}
          >
            {item.name}
          </p>
          <p className="text-xs sm:text-[13px] text-para-muted leading-tight">
            {metadataText}
            {/* Show date on mobile since columns are hidden */}
            <span className="sm:hidden">
              {" • "}
              {item.modifiedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Created By - hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <div className="text-sm text-para truncate">{item.owner.name}</div>
      </div>

      {/* Last Modified - hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <div className="text-sm text-para whitespace-nowrap">
          {item.modifiedAt.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}{" "}
          |{" "}
          {item.modifiedAt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* Three Dots Menu */}
      <div className="flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(item.id);
          }}
          className="w-8 h-8 rounded hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5 text-para-muted" />
        </button>
      </div>
    </div>
  );
}

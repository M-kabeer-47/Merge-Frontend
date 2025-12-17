"use client";

import React from "react";
import Image from "next/image";
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
import type {
  RoomContentItem,
  RoomContentFile,
  RoomContentFolder,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";
import {
  getIconTypeFromMimeType,
  getIconColorFromMimeType,
  formatFileSize,
} from "@/utils/file-helpers";

interface ContentGridCardProps {
  item: RoomContentItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

function ItemIcon({ item }: { item: RoomContentItem }) {
  if (isRoomContentFolder(item)) {
    return <Folder className="w-12 h-12 text-secondary" fill="currentColor" />;
  }

  const fileItem = item as RoomContentFile;
  const iconType = getIconTypeFromMimeType(fileItem.mimeType);
  const iconColor = getIconColorFromMimeType(fileItem.mimeType);
  const iconClass = `w-12 h-12 ${iconColor}`;

  // Show actual thumbnail for images
  if (iconType === "image" && fileItem.filePath) {
    return (
      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={fileItem.filePath}
          alt={fileItem.originalName}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
    );
  }

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

// Helper to get display name
function getItemName(item: RoomContentItem): string {
  if (isRoomContentFolder(item)) {
    return item.name;
  }
  return (item as RoomContentFile).originalName;
}

// Helper to get owner name
function getOwnerName(item: RoomContentItem): string {
  if (isRoomContentFolder(item)) {
    const folder = item as RoomContentFolder;
    if (folder.owner) {
      return `${folder.owner.firstName} ${folder.owner.lastName}`;
    }
    return "Unknown";
  }
  const file = item as RoomContentFile;
  return `${file.uploader.firstName} ${file.uploader.lastName}`;
}

// Helper to get metadata text
function getMetadataText(item: RoomContentItem): string {
  if (isRoomContentFolder(item)) {
    return `${item.totalItems} items`;
  }
  return formatFileSize((item as RoomContentFile).size);
}

// Format date
function formatDate(date: Date): string {
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
}

export default function ContentGridCard({
  item,
  isSelected = false,
  onSelect,
  onClick,
  onMenuClick,
}: ContentGridCardProps) {
  const itemName = getItemName(item);
  const ownerName = getOwnerName(item);
  const metadataText = getMetadataText(item);
  const modifiedAt = new Date(item.updatedAt);

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
      {/* Selection checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(item.id);
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

      {/* Menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.(item.id);
        }}
        className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical className="w-4 h-4 text-para-muted" />
      </button>

      {/* Icon */}
      <div className="mb-3 mt-2">
        <ItemIcon item={item} />
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3
          className="text-base font-bold text-heading font-raleway line-clamp-1 mb-1"
          title={itemName}
        >
          {itemName}
        </h3>
        <p className="text-xs text-para-muted">{metadataText}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-para-muted">
        <span className="truncate max-w-[60%]" title={ownerName}>
          {ownerName}
        </span>
        <span>{formatDate(modifiedAt)}</span>
      </div>
    </div>
  );
}

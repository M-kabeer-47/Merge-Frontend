// Adapter functions to convert domain types to BaseDisplayItem

import type { BaseDisplayItem } from "@/types/display-item";
import type { NoteOrFolder, Note, Folder } from "@/types/note";
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

// Check if item is a Note
function isNote(item: NoteOrFolder): item is Note & { type: "note" } {
  return "title" in item && item.type === "note";
}

// Check if item is a Folder (in notes context)
function isNoteFolder(item: NoteOrFolder): item is Folder & { type: "folder" } {
  return "name" in item && !("title" in item);
}

/**
 * Convert NoteOrFolder to BaseDisplayItem
 */
export function noteToDisplayItem(item: NoteOrFolder): BaseDisplayItem {
  if (isNote(item)) {
    return {
      id: item.id,
      name: item.title,
      isFolder: false,
      updatedAt: new Date(item.updatedAt),
      iconType: "note",
      iconColor: "text-secondary",
    };
  }

  // It's a folder
  const folder = item as Folder;
  return {
    id: folder.id,
    name: folder.name,
    isFolder: true,
    updatedAt: new Date(folder.updatedAt),
    metadata:
      folder.itemCount !== undefined ? `${folder.itemCount} items` : `0 items`,
    iconType: "folder",
    iconColor: "text-secondary",
  };
}

/**
 * Convert RoomContentItem to BaseDisplayItem
 */
export function contentToDisplayItem(item: RoomContentItem): BaseDisplayItem {
  console.log("Item: " + JSON.stringify(item));
  let isRoomContentFolderResult = isRoomContentFolder(item);
  console.log("isRoomContentFolder: " + isRoomContentFolderResult);
  if (isRoomContentFolder(item)) {
    const folder = item as RoomContentFolder;
    return {
      id: folder.id,
      name: folder.name,
      isFolder: true,
      updatedAt: new Date(folder.updatedAt),
      metadata: `${folder.totalItems || 0} items`,
      owner: folder.owner
        ? `${folder.owner.firstName} ${folder.owner.lastName}`
        : undefined,
      iconType: "folder",
      iconColor: "text-secondary",
    };
  }

  // It's a file
  const file = item as RoomContentFile;
  const iconType = getIconTypeFromMimeType(file.mimeType);
  const iconColor = getIconColorFromMimeType(file.mimeType);

  return {
    id: file.id,
    name: file.originalName,
    isFolder: false,
    updatedAt: new Date(file.updatedAt),
    metadata: formatFileSize(file.size),
    owner: `${file.uploader.firstName} ${file.uploader.lastName}`,
    iconType: iconType as BaseDisplayItem["iconType"],
    iconColor,
  };
}

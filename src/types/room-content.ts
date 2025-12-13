// Types for room course content

export interface RoomContentFolder {
  id: string;
  name: string;
  type: string;
  parentFolder: string;
  subfolderCount: number;
  fileCount: number;
  totalItems: number;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoomContentFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  type: string;
  uploader: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface RoomInfo {
  id: string;
  title: string;
  userRole: "admin" | "member";
}

export interface RoomContentResponse {
  folders: RoomContentFolder[];
  files: RoomContentFile[];
  total: {
    folders: number;
    files: number;
    combined: number;
  };
  pagination: {
    totalPages: number;
    currentPage: number;
    sortBy: string;
    sortOrder: string;
  };
  breadcrumb: BreadcrumbItem[];
  currentFolder: BreadcrumbItem | null;
  roomInfo: RoomInfo;
}

export type ContentSortBy = "name" | "createdAt" | "updatedAt" | null;
export type ContentSortOrder = "ASC" | "DESC" | null;

// Union type for content items
export type RoomContentItem = RoomContentFolder | RoomContentFile;

// Type guard to check if item is a folder
export function isRoomContentFolder(
  item: RoomContentItem
): item is RoomContentFolder {
  return "totalItems" in item;
}

// Type guard to check if item is a file
export function isRoomContentFile(
  item: RoomContentItem
): item is RoomContentFile {
  return "mimeType" in item;
}

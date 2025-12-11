// Types for room course content

export interface RoomContentFolder {
  id: string;
  name: string;
  subfolderCount: number;
  fileCount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomContentFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
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

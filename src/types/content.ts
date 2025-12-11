export type FileType =
  | "pdf"
  | "docx"
  | "pptx"
  | "xlsx"
  | "png"
  | "jpg"
  | "jpeg"
  | "gif"
  | "mp4"
  | "mp3"
  | "zip"
  | "md"
  | "txt"
  | "other";

export type ContentItemType = "file" | "folder";

export type ViewMode = "grid" | "list";

export type SortOption = "name" | "date" | "size" | "type" | "owner" | null;

export type FilterType = "all" | "files" | "folders" | "images";

export interface ContentOwner {
  id: string;
  name: string;
  avatar?: string;
}

export interface BaseContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  owner: ContentOwner;
  createdAt: Date;
  modifiedAt: Date;
  tags?: string[];
  description?: string;
}

export interface FileItem extends BaseContentItem {
  type: "file";
  fileType: FileType;
  size: number;
  downloadUrl?: string;
  previewUrl?: string;
  versionHistory?: FileVersion[];
}

export interface FolderItem extends BaseContentItem {
  type: "folder";
  itemCount: number;
  subfolders?: number;
  files?: number;
}

export interface FileVersion {
  id: string;
  version: number;
  modifiedAt: Date;
  modifiedBy: ContentOwner;
  size: number;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  size: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export type ContentItem = FileItem | FolderItem;

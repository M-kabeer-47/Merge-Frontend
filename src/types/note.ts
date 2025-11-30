// Note Types for Personal Notes with Folder Support

export type NoteSortOption = "dateCreated" | "lastEdited" | "title" | "type";
export type NoteViewMode = "grid" | "list";
export type NoteItemType = "note" | "folder";

export interface BaseNoteItem {
  id: string;
  name: string;
  type: NoteItemType;
  parentId: string | null; // null means root level
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
}

export interface NoteItem extends BaseNoteItem {
  type: "note";
  content: string;
  color?: "primary" | "secondary" | "accent";
  tags?: string[];
}

export interface FolderItem extends BaseNoteItem {
  type: "folder";
  itemCount: number; // Total items inside (notes + folders)
}

export type NoteOrFolder = NoteItem | FolderItem;

export interface BreadcrumbItem {
  id: string;
  name: string;
}

// API Response Types for Backend Integration
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

export interface CreateNoteData {
  title: string;
  content: string;
  folderId?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  folderId?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  type: "notes" | "content";
  parentFolderId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
}

export interface NotesResponse {
  notes: Note[];
  folders: Folder[];
  total: number;
}

export interface NoteFilters {
  folderId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

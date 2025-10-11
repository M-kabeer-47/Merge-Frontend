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

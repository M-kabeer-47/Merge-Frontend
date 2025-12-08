// Note Types for Personal Notes with Folder Support

export type NoteSortOption = "dateCreated" | "lastEdited" | "title" | "type";
export type NoteViewMode = "grid" | "list";
export type NoteItemType = "note" | "folder";



export interface Note {
  id: string;
  title: string;
  type: "note";
  folderId: string | null | undefined;
  content: string;
  createdAt: Date;
  updatedAt: Date;

}

export interface Folder {
  id: string;
  name: string
  type: "notes" | "room" | "folder";
  parentFolderId: string | null;
  roomId: string | null;
  ownerId: string;
  itemCount?: number; // Total items inside (notes + folders)
  createdAt: Date;
  updatedAt: Date;
}

export type NoteOrFolder = Note | Folder;

export interface BreadcrumbItem {
  id: string;
  name: string;
}

// API Response Types for Backend Integration


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



export interface NotesResponse {
  notes: Note[];
  folders: Folder[];
  total: number;
}



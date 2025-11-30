export interface CreateNoteType {
    title: string;
    content: string;
    folderId?: string;
}

export interface UpdateNoteType {
    title?: string;
    content?: string;
    folderId?: string | null;
}

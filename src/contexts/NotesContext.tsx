"use client";

import { createContext, useContext } from "react";
import type { NoteOrFolder, NoteViewMode } from "@/types/note";

interface NotesContextType {
  // Filters
  folderId: string | null;
  search: string;
  viewMode: NoteViewMode;
  // Actions
  onDeleteItem: (item: NoteOrFolder) => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  setViewMode: (mode: NoteViewMode) => void;
  setSearch: (search: string) => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

interface NotesProviderProps {
  folderId: string | null;
  search: string;
  viewMode: NoteViewMode;
  onDeleteItem: (item: NoteOrFolder) => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  setViewMode: (mode: NoteViewMode) => void;
  setSearch: (search: string) => void;
  children: React.ReactNode;
}

export function NotesProvider({
  folderId,
  search,
  viewMode,
  onDeleteItem,
  onCreateNote,
  onCreateFolder,
  setViewMode,
  setSearch,
  children,
}: NotesProviderProps) {
  return (
    <NotesContext.Provider
      value={{
        folderId,
        search,
        viewMode,
        onDeleteItem,
        onCreateNote,
        onCreateFolder,
        setViewMode,
        setSearch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesFilters() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotesFilters must be used within NotesProvider");
  }
  return {
    folderId: context.folderId,
    search: context.search,
    viewMode: context.viewMode,
  };
}

export function useNotesActions() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotesActions must be used within NotesProvider");
  }
  return {
    onDeleteItem: context.onDeleteItem,
    onCreateNote: context.onCreateNote,
    onCreateFolder: context.onCreateFolder,
    setViewMode: context.setViewMode,
    setSearch: context.setSearch,
  };
}

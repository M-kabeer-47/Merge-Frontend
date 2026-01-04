"use client";

import { createContext, useContext } from "react";
import type { RoomContentItem } from "@/types/room-content";
import type { ViewMode, SortOption, FilterType } from "@/types/content";

interface ContentContextType {
  // Identifiers
  roomId: string;
  folderId: string | null;
  // Filters
  viewMode: ViewMode;
  searchTerm: string;
  activeFilter: FilterType;
  sortBy: SortOption;
  // Selection
  selectedItems: Set<string>;
  contentItemsForBulkAction: { id: string; type: "folder" | "file" }[];
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSearchTerm: (term: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedItems: (items: Set<string>) => void;
  onDeleteItem: (item: RoomContentItem) => void;
  onRenameItem: (item: RoomContentItem) => void;
  onUpload: () => void;
  onResetFilters: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

interface ContentProviderProps {
  roomId: string;
  folderId: string | null;
  viewMode: ViewMode;
  searchTerm: string;
  activeFilter: FilterType;
  sortBy: SortOption;
  selectedItems: Set<string>;
  contentItemsForBulkAction: { id: string; type: "folder" | "file" }[];
  setViewMode: (mode: ViewMode) => void;
  setSearchTerm: (term: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  setSortBy: (sort: SortOption) => void;
  setSelectedItems: (items: Set<string>) => void;
  onDeleteItem: (item: RoomContentItem) => void;
  onRenameItem: (item: RoomContentItem) => void;
  onUpload: () => void;
  onResetFilters: () => void;
  children: React.ReactNode;
}

export function ContentProvider({
  roomId,
  folderId,
  viewMode,
  searchTerm,
  activeFilter,
  sortBy,
  selectedItems,
  contentItemsForBulkAction,
  setViewMode,
  setSearchTerm,
  setActiveFilter,
  setSortBy,
  setSelectedItems,
  onDeleteItem,
  onRenameItem,
  onUpload,
  onResetFilters,
  children,
}: ContentProviderProps) {
  return (
    <ContentContext.Provider
      value={{
        roomId,
        folderId,
        viewMode,
        searchTerm,
        activeFilter,
        sortBy,
        selectedItems,
        contentItemsForBulkAction,
        setViewMode,
        setSearchTerm,
        setActiveFilter,
        setSortBy,
        setSelectedItems,
        onDeleteItem,
        onRenameItem,
        onUpload,
        onResetFilters,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentFilters() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentFilters must be used within ContentProvider");
  }
  return {
    roomId: context.roomId,
    folderId: context.folderId,
    viewMode: context.viewMode,
    searchTerm: context.searchTerm,
    activeFilter: context.activeFilter,
    sortBy: context.sortBy,
    selectedItems: context.selectedItems,
    contentItemsForBulkAction: context.contentItemsForBulkAction,
  };
}

export function useContentActions() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentActions must be used within ContentProvider");
  }
  return {
    setViewMode: context.setViewMode,
    setSearchTerm: context.setSearchTerm,
    setActiveFilter: context.setActiveFilter,
    setSortBy: context.setSortBy,
    setSelectedItems: context.setSelectedItems,
    onDeleteItem: context.onDeleteItem,
    onRenameItem: context.onRenameItem,
    onUpload: context.onUpload,
    onResetFilters: context.onResetFilters,
  };
}

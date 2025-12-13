"use client";

import React, { useState, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ContentToolbar from "@/components/content/ContentToolbar";
import ContentListRow from "@/components/content/ContentListRow";
import ContentListHeader from "@/components/content/ContentListHeader";
import ContentGridItem from "@/components/content/ContentGridItem";
import ContentGridHeader from "@/components/content/ContentGridHeader";
import UploadDropzone from "@/components/content/UploadDropzone";
import UploadProgressTray from "@/components/content/UploadProgressTray";
import {
  EmptyFolderState,
  NoSearchResults,
} from "@/components/content/EmptyStates";
import ContentSkeleton from "@/components/content/ContentSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import useFetchRoomContent from "@/hooks/rooms/use-fetch-room-content";
import useUploadFile from "@/hooks/rooms/use-upload-file";
import type { ViewMode, SortOption, FilterType } from "@/types/content";
import type {
  ContentSortBy,
  ContentSortOrder,
  RoomContentItem,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";

export default function ContentTab() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = params?.id as string;
  const folderId = searchParams?.get("folderId") || null;

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // File input ref for upload button
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  // Map UI sort options to API sort params
  const apiSortBy: ContentSortBy =
    sortBy === "name" ? "name" : sortBy === "date" ? "updatedAt" : null;
  const apiSortOrder: ContentSortOrder = "DESC";

  // Fetch room content from API
  const { folders, files, breadcrumb, roomInfo, isLoading, isError, refetch } =
    useFetchRoomContent({
      roomId,
      folderId,
      search: searchTerm,
      sortBy: apiSortBy,
      sortOrder: apiSortBy ? apiSortOrder : null,
    });

  // File upload hook with real progress tracking
  const { uploads, uploadFiles, removeUpload, clearAll } = useUploadFile({
    roomId,
    folderId,
    searchQuery: searchTerm,
    sortBy: apiSortBy,
    sortOrder: apiSortBy ? apiSortOrder : null,
  });

  // Build breadcrumbs - prepend root, use API breadcrumb as-is
  const toolbarBreadcrumbs = [
    {
      id: "root",
      name: roomInfo?.title || "Content",
      path: `/rooms/${roomId}/content`,
    },
    ...breadcrumb.map((item) => ({
      id: item.id,
      name: item.name,
      path: `/rooms/${roomId}/content?folderId=${item.id}`,
    })),
  ];

  // Navigate to folder
  const handleFolderClick = (folderId: string) => {
    router.push(`/rooms/${roomId}/content?folderId=${folderId}`);
  };

  // Combined items for display (folders first, then files) - NO TRANSFORMATION
  const contentItems: RoomContentItem[] = useMemo(() => {
    return [...folders, ...files];
  }, [folders, files]);

  // Filter content client-side by type
  const filteredContent = useMemo(() => {
    if (activeFilter === "all") return contentItems;
    if (activeFilter === "folders")
      return contentItems.filter((item) => isRoomContentFolder(item));

    return contentItems.filter((item) => {
      if (isRoomContentFolder(item)) return false;
      switch (activeFilter) {
        case "images":
          return item.mimeType.startsWith("image/");
        case "files":
          return true;
        default:
          return true;
      }
    });
  }, [contentItems, activeFilter]);

  // Handlers
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredContent.map((item) => item.id)));
    }
  };

  const handleItemClick = (id: string) => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return;

    if (isRoomContentFolder(item)) {
      handleFolderClick(id);
    } else {
      console.log("Open file:", id);
      // TODO: Open file preview
    }
  };

  // Handle files dropped - use real upload hook
  const handleFilesDropped = (droppedFiles: FileList) => {
    uploadFiles(droppedFiles);
  };

  return (
    <UploadDropzone onFilesDropped={handleFilesDropped}>
      {/* Hidden file input for upload button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
        aria-hidden="true"
      />

      {/* Toolbar - always visible */}
      <ContentToolbar
        breadcrumbs={toolbarBreadcrumbs}
        currentFolderId={folderId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        sortOrder={apiSortOrder}
        onSortChange={setSortBy}
        selectedCount={selectedItems.size}
        onClearSelection={() => setSelectedItems(new Set())}
        onUpload={handleUploadClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <ContentSkeleton viewMode={viewMode} />
        ) : isError ? (
          <ErrorState
            title="Failed to load content"
            message="We couldn't load the folder content. Please try again."
            onRetry={refetch}
          />
        ) : filteredContent.length === 0 ? (
          searchTerm ? (
            <NoSearchResults
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : (
            <EmptyFolderState />
          )
        ) : viewMode === "list" ? (
          // List View - Table
          <table className="w-full border-collapse">
            <ContentListHeader
              sortBy={sortBy}
              onSortChange={setSortBy}
              allSelected={
                selectedItems.size === filteredContent.length &&
                filteredContent.length > 0
              }
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {filteredContent.map((item) => (
                <ContentListRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={handleSelectItem}
                  onClick={handleItemClick}
                  onMenuClick={(id: string) => console.log("Menu:", id)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          // Grid View - CSS Grid rows (not cards)
          <div>
            <ContentGridHeader
              sortBy={sortBy}
              onSortChange={setSortBy}
              allSelected={
                selectedItems.size === filteredContent.length &&
                filteredContent.length > 0
              }
              onSelectAll={handleSelectAll}
            />
            {filteredContent.map((item) => (
              <ContentGridItem
                key={item.id}
                item={item}
                isSelected={selectedItems.has(item.id)}
                onSelect={handleSelectItem}
                onClick={handleItemClick}
                onMenuClick={(id: string) => console.log("Menu:", id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Progress Tray */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <UploadProgressTray
            uploads={uploads}
            onCancel={removeUpload}
            onDismiss={removeUpload}
            onDismissAll={clearAll}
          />
        )}
      </AnimatePresence>
    </UploadDropzone>
  );
}

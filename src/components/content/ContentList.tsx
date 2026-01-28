"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useContentFilters,
  useContentActions,
} from "@/contexts/ContentContext";
import useFetchRoomContent from "@/hooks/rooms/use-fetch-room-content";
import { contentToDisplayItem } from "@/utils/display-adapters";
import { downloadFile } from "@/utils/download-file";
import SharedGridView from "@/components/shared/SharedGridView";
import SharedListView from "@/components/shared/SharedListView";
import ContentToolbar from "./ContentToolbar";
import ContentSkeleton from "./ContentSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import { EmptyFolderState, NoSearchResults } from "./EmptyStates";
import type {
  RoomContentItem,
  RoomContentFile,
  ContentSortBy,
  ContentSortOrder,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";
import type { MenuOption } from "@/types/display-item";
import { useRoom } from "@/providers/RoomProvider";
import CreateFolderModal from "../notes/CreateFolderModal";

export default function ContentList() {
  const router = useRouter();
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const {
    roomId,
    folderId,
    viewMode,
    searchTerm,
    activeFilter,
    sortBy,
    selectedItems,
  } = useContentFilters();
  const {
    onDeleteItem,
    onRenameItem,
    onUpload,
    onResetFilters,
    setSearchTerm,
    setActiveFilter,
    setViewMode,
    setSortBy,
    setSelectedItems,
  } = useContentActions();

  // Role check
  const { userRole } = useRoom();
  const canEdit = userRole === "instructor" || userRole === "moderator";

  // Map UI sort options to API sort params
  const apiSortBy: ContentSortBy =
    sortBy?.field === "date" ? "updatedAt" : null;
  const derivedSortOrder: ContentSortOrder =
    (sortBy?.order.toUpperCase() as ContentSortOrder) ?? null;

  // Single fetch for all content data
  const {
    folders,
    files,
    breadcrumb,
    roomInfo,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useFetchRoomContent({
    roomId,
    folderId,
    search: searchTerm,
    sortBy: apiSortBy,
    sortOrder: derivedSortOrder,
  });

  // Combined items for display (folders first, then files)
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

  // Build breadcrumbs from fetched data
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

  // Simplified content items for BulkActionBar
  const bulkActionItems = useMemo(() => {
    return contentItems.map((item) => ({
      id: item.id,
      type: isRoomContentFolder(item) ? ("folder" as const) : ("file" as const),
    }));
  }, [contentItems]);

  // Navigate to folder
  const handleFolderClick = (targetFolderId: string) => {
    router.push(`/rooms/${roomId}/content?folderId=${targetFolderId}`);
  };

  // Handle item click
  const handleItemClick = (id: string) => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return;

    if (isRoomContentFolder(item)) {
      handleFolderClick(id);
    } else {
      const file = item as RoomContentFile;

      if (file.mimeType.startsWith("image/")) {
        downloadFile(file.filePath, file.originalName);
      } else if (file.mimeType === "application/pdf") {
        const encodedUrl = encodeURIComponent(file.filePath);
        router.push(`/view-document/${encodedUrl}`);
      } else {
        downloadFile(file.filePath, file.originalName);
      }
    }
  };

  // Menu options for each item
  const getMenuOptions = (id: string): MenuOption[] => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return [];

    if (isRoomContentFolder(item)) {
      const options: MenuOption[] = [
        { title: "Open", action: () => handleFolderClick(id) },
      ];
      if (canEdit) {
        options.push(
          { title: "Rename", action: () => onRenameItem(item) },
          { title: "Delete", action: () => onDeleteItem(item) },
        );
      }
      return options;
    }

    const file = item as RoomContentFile;
    const options: MenuOption[] = [
      {
        title: "Download",
        action: () => downloadFile(file.filePath, file.originalName),
      },
    ];
    if (canEdit) {
      options.push(
        { title: "Rename", action: () => onRenameItem(item) },
        { title: "Delete", action: () => onDeleteItem(item) },
      );
    }
    return options;
  };

  return (
    <>
      {/* Toolbar */}
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
        onSortChange={setSortBy}
        selectedCount={selectedItems.size}
        selectedIds={selectedItems}
        contentItems={bulkActionItems}
        onClearSelection={() => setSelectedItems(new Set())}
        onUpload={onUpload}
        onCreateFolder={() => setIsCreateFolderModalOpen(true)}
        onResetFilters={onResetFilters}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading || isFetching ? (
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
            <EmptyFolderState
              onUpload={canEdit ? onUpload : undefined}
              onCreateFolder={
                canEdit ? () => setIsCreateFolderModalOpen(true) : undefined
              }
            />
          )
        ) : viewMode === "list" ? (
          <SharedListView
            items={filteredContent.map(contentToDisplayItem)}
            onItemClick={handleItemClick}
            getMenuOptions={getMenuOptions}
            showOwner={true}
          />
        ) : (
          <SharedGridView
            items={filteredContent.map(contentToDisplayItem)}
            onItemClick={handleItemClick}
            getMenuOptions={getMenuOptions}
          />
        )}
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        folderId={folderId}
        folderType="room"
        roomId={roomId}
        onSuccess={onResetFilters}
      />
    </>
  );
}

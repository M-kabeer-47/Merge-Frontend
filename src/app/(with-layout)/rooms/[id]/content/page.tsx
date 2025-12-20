"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ContentToolbar from "@/components/content/ContentToolbar";
import SharedGridView from "@/components/shared/SharedGridView";
import SharedListView from "@/components/shared/SharedListView";
import UploadDropzone from "@/components/content/UploadDropzone";
import UploadProgressTray from "@/components/content/UploadProgressTray";
import {
  EmptyFolderState,
  NoSearchResults,
} from "@/components/content/EmptyStates";
import ContentSkeleton from "@/components/content/ContentSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import DeleteConfirmation from "@/components/content/DeleteConfirmation";
import ImageViewerModal from "@/components/content/ImageViewerModal";
import NameInputModal from "@/components/ui/NameInputModal";
import useFetchRoomContent from "@/hooks/rooms/use-fetch-room-content";
import useUploadFile from "@/hooks/rooms/use-upload-file";
import useRenameFile from "@/hooks/rooms/use-rename-file";
import useRenameFolder from "@/hooks/rooms/use-rename-folder";
import { contentToDisplayItem } from "@/utils/display-adapters";
import { downloadFile } from "@/utils/download-file";
import type { ViewMode, SortOption, FilterType } from "@/types/content";
import type {
  ContentSortBy,
  ContentSortOrder,
  RoomContentItem,
  RoomContentFile,
  RoomContentFolder,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";
import type { MenuOption } from "@/types/display-item";
import { toast } from "sonner";

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

  // Clear selection when folder changes
  useEffect(() => {
    setSelectedItems(new Set());
  }, [folderId]);

  // Delete confirmation state
  const [deleteItem, setDeleteItem] = useState<RoomContentItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Image viewer state
  const [viewingImage, setViewingImage] = useState<RoomContentFile | null>(
    null
  );

  // Rename state
  const [renameItem, setRenameItem] = useState<RoomContentItem | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  // File input ref for upload button
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 3) {
      toast.error("You can only upload up to 3 files at a time.");
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  // Map UI sort options to API sort params
  // sortBy is now an object with field and order
  const apiSortBy: ContentSortBy =
    sortBy?.field === "date" ? "updatedAt" : null;
  const derivedSortOrder: ContentSortOrder =
    (sortBy?.order.toUpperCase() as ContentSortOrder) ?? null;

  // Fetch room content from API
  const { folders, files, breadcrumb, roomInfo, isLoading, isError, refetch } =
    useFetchRoomContent({
      roomId,
      folderId,
      search: searchTerm,
      sortBy: apiSortBy,
      sortOrder: derivedSortOrder,
    });

  
  const resetFilters = () => {
    setSearchTerm("");
    setSortBy(null);
  };

  // File upload hook with real progress tracking
  const { uploads, uploadFiles, removeUpload, clearAll } = useUploadFile({
    roomId,
    folderId,
    onSuccess: resetFilters,
  });

  // Handle opening delete confirmation
  const handleDeleteClick = (item: RoomContentItem) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  // Handle closing delete confirmation
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setDeleteItem(null);
  };

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

  // Simplified content items for BulkActionBar
  const contentItemsForBulkAction = useMemo(() => {
    return contentItems.map((item) => ({
      id: item.id,
      type: isRoomContentFolder(item) ? ("folder" as const) : ("file" as const),
    }));
  }, [contentItems]);

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
      const file = item as RoomContentFile;

      if (file.mimeType.startsWith("image/")) {
        // Open image viewer for images
        setViewingImage(file);
      } else if (file.mimeType === "application/pdf") {
        // Open PDF viewer
        const encodedUrl = encodeURIComponent(file.filePath);
        const encodedName = encodeURIComponent(file.originalName);
        router.push(
          `/rooms/${roomId}/view-document?url=${encodedUrl}&name=${encodedName}`
        );
      } else {
        // For other files, download
        downloadFile(file.filePath, file.originalName);
      }
    }
  };

  // Rename hooks
  const { renameFile, isRenaming: isRenamingFile } = useRenameFile({
    roomId,
    folderId,
  });
  const { renameFolder, isRenaming: isRenamingFolder } = useRenameFolder({
    roomId,
    parentFolderId: folderId,
  });

  // Handle rename click
  const handleRenameClick = (item: RoomContentItem) => {
    setRenameItem(item);
    setIsRenameOpen(true);
  };

  // Handle rename submit
  const handleRenameSubmit = async (newName: string) => {
    if (!renameItem) return;

    if (isRoomContentFolder(renameItem)) {
      await renameFolder({
        folderId: renameItem.id,
        newName,
        parentFolderId: folderId,
      });
    } else {
      await renameFile({
        fileId: renameItem.id,
        newName,
      });
    }
  };

  // Menu options for each item
  const getMenuOptions = (id: string): MenuOption[] => {
    const item = contentItems.find((i) => i.id === id);
    if (!item) return [];

    if (isRoomContentFolder(item)) {
      return [
        { title: "Open", action: () => handleFolderClick(id) },
        { title: "Rename", action: () => handleRenameClick(item) },
        { title: "Delete", action: () => handleDeleteClick(item) },
      ];
    }

    const file = item as RoomContentFile;
    return [
      {
        title: "Download",
        action: () => downloadFile(file.filePath, file.originalName),
      },
      { title: "Rename", action: () => handleRenameClick(item) },
      { title: "Delete", action: () => handleDeleteClick(item) },
    ];
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
        onSortChange={setSortBy}
        selectedCount={selectedItems.size}
        selectedIds={selectedItems}
        contentItems={contentItemsForBulkAction}
        onClearSelection={() => setSelectedItems(new Set())}
        onUpload={handleUploadClick}
        onResetFilters={resetFilters}
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
          // List View - Using shared component
          <SharedListView
            items={filteredContent.map(contentToDisplayItem)}
            selectedIds={selectedItems}
            onItemClick={handleItemClick}
            onSelect={handleSelectItem}
            onSelectAll={handleSelectAll}
            getMenuOptions={getMenuOptions}
            showOwner={true}
          />
        ) : (
          // Grid View - Using shared component
          <SharedGridView
            items={filteredContent.map(contentToDisplayItem)}
            selectedIds={selectedItems}
            onItemClick={handleItemClick}
            onSelect={handleSelectItem}
            getMenuOptions={getMenuOptions}
          />
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        item={deleteItem}
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        roomId={roomId}
        folderId={folderId}
        searchQuery={searchTerm}
        sortBy={apiSortBy}
        sortOrder={derivedSortOrder}
      />

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
        imageSrc={viewingImage?.filePath || ""}
        imageName={viewingImage?.originalName || ""}
        onDownload={() => {
          if (viewingImage) {
            downloadFile(viewingImage.filePath, viewingImage.originalName);
          }
        }}
      />

      {/* Rename Modal */}
      <NameInputModal
        isOpen={isRenameOpen}
        onClose={() => {
          setIsRenameOpen(false);
          setRenameItem(null);
        }}
        onSubmit={handleRenameSubmit}
        title={
          renameItem
            ? isRoomContentFolder(renameItem)
              ? "Rename Folder"
              : "Rename File"
            : "Rename"
        }
        label={
          renameItem
            ? isRoomContentFolder(renameItem)
              ? "Folder Name"
              : "File Name"
            : "Name"
        }
        placeholder="Enter new name..."
        initialValue={
          renameItem
            ? isRoomContentFolder(renameItem)
              ? renameItem.name
              : (renameItem as RoomContentFile).originalName
            : ""
        }
        submitText="Rename"
        isLoading={isRenamingFile || isRenamingFolder}
      />
    </UploadDropzone>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import UploadDropzone from "@/components/content/UploadDropzone";
import UploadProgressTray from "@/components/content/UploadProgressTray";
import DeleteConfirmation from "@/components/content/DeleteConfirmation";
import ImageViewerModal from "@/components/content/ImageViewerModal";
import NameInputModal from "@/components/ui/NameInputModal";
import { ContentProvider } from "@/contexts/ContentContext";
import useUploadFile from "@/hooks/rooms/use-upload-file";
import useRenameFile from "@/hooks/rooms/use-rename-file";
import useRenameFolder from "@/hooks/rooms/use-rename-folder";
import { downloadFile } from "@/utils/download-file";
import type { ViewMode, SortOption, FilterType } from "@/types/content";
import type {
  ContentSortBy,
  ContentSortOrder,
  RoomContentItem,
  RoomContentFile,
} from "@/types/room-content";
import { isRoomContentFolder } from "@/types/room-content";
import { toast } from "sonner";

interface ContentPageClientProps {
  roomId: string;
  folderId: string | null;
  children: React.ReactNode;
}

export default function ContentPageClient({
  roomId,
  folderId,
  children,
}: ContentPageClientProps) {
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

  // Map UI sort options to API sort params
  const apiSortBy: ContentSortBy =
    sortBy?.field === "date" ? "updatedAt" : null;
  const derivedSortOrder: ContentSortOrder =
    (sortBy?.order.toUpperCase() as ContentSortOrder) ?? null;

  const resetFilters = () => {
    setSearchTerm("");
    setSortBy(null);
  };

  // File upload hook
  const { uploads, uploadFiles, removeUpload, clearAll } = useUploadFile({
    roomId,
    folderId,
    onSuccess: resetFilters,
  });

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
      e.target.value = "";
    }
  };

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

  // Handle rename click
  const handleRenameClick = (item: RoomContentItem) => {
    setRenameItem(item);
    setIsRenameOpen(true);
  };

  // Handle files dropped
  const handleFilesDropped = (droppedFiles: FileList) => {
    uploadFiles(droppedFiles);
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

      {/* Main Content Area with Provider - includes toolbar */}
      <ContentProvider
        roomId={roomId}
        folderId={folderId}
        viewMode={viewMode}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        sortBy={sortBy}
        selectedItems={selectedItems}
        contentItemsForBulkAction={[]}
        setViewMode={setViewMode}
        setSearchTerm={setSearchTerm}
        setActiveFilter={setActiveFilter}
        setSortBy={setSortBy}
        setSelectedItems={setSelectedItems}
        onDeleteItem={handleDeleteClick}
        onRenameItem={handleRenameClick}
        onUpload={handleUploadClick}
        onResetFilters={resetFilters}
      >
        {children}
      </ContentProvider>

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

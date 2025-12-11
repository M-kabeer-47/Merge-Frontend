"use client";

import React, { useState, useMemo } from "react";
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
import type {
  ViewMode,
  SortOption,
  FilterType,
  UploadProgress,
  FileType,
} from "@/types/content";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

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
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

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

  // Combined items for display (folders first, then files)
  const contentItems = useMemo(() => {
    const folderItems = folders.map((f) => ({
      id: f.id,
      name: f.name,
      type: "folder" as const,
      itemCount: f.totalItems,
      createdAt: new Date(f.createdAt),
      modifiedAt: new Date(f.updatedAt),
      owner: { id: "owner", name: "Owner", avatar: "" },
    }));

    const fileItems = files.map((f) => ({
      id: f.id,
      name: f.name,
      type: "file" as const,
      fileType: (f.mimeType.split("/").pop() || "other") as FileType,
      size: f.size,
      createdAt: new Date(f.createdAt),
      modifiedAt: new Date(f.updatedAt),
      owner: { id: "owner", name: "Owner", avatar: "" },
    }));

    return [...folderItems, ...fileItems];
  }, [folders, files]);

  // Filter content client-side by type
  const filteredContent = useMemo(() => {
    if (activeFilter === "all") return contentItems;
    if (activeFilter === "folders")
      return contentItems.filter((i) => i.type === "folder");

    return contentItems.filter((item) => {
      if (item.type === "folder") return false;
      const fileItem = item as any;
      switch (activeFilter) {
        case "docs":
          return ["docx", "txt", "md", "doc"].includes(fileItem.fileType);
        case "slides":
          return ["pptx", "ppt"].includes(fileItem.fileType);
        case "pdfs":
          return fileItem.fileType === "pdf";
        case "images":
          return ["png", "jpg", "jpeg", "gif", "webp"].includes(
            fileItem.fileType
          );
        case "videos":
          return ["mp4", "mov", "avi"].includes(fileItem.fileType);
        case "audio":
          return ["mp3", "wav"].includes(fileItem.fileType);
        case "archives":
          return ["zip", "rar"].includes(fileItem.fileType);
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

  const handleItemClick = (id: string, type: "folder" | "file") => {
    if (type === "folder") {
      handleFolderClick(id);
    } else {
      console.log("Open file:", id);
      // TODO: Open file preview
    }
  };

  // Handle files dropped - UploadDropzone manages isDragging internally
  const handleFilesDropped = (files: FileList) => {
    // Simulate upload progress for demo
    Array.from(files).forEach((file, index) => {
      const uploadId = `upload-${Date.now()}-${index}`;
      const newUpload: UploadProgress = {
        id: uploadId,
        fileName: file.name,
        progress: 0,
        size: file.size,
        status: "uploading",
      };

      setUploads((prev) => [...prev, newUpload]);

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploads((prev) =>
            prev.map((u) =>
              u.id === uploadId
                ? { ...u, progress: 100, status: "completed" }
                : u
            )
          );
        } else {
          setUploads((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress } : u))
          );
        }
      }, 500);
    });
  };

  return (
    <UploadDropzone onFilesDropped={handleFilesDropped}>
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
        onClearSelection={() => setSelectedItems(new Set())}
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
                  onClick={() => handleItemClick(item.id, item.type)}
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
                onClick={() => handleItemClick(item.id, item.type)}
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
            onCancel={(id: string) =>
              setUploads((prev) => prev.filter((u) => u.id !== id))
            }
            onDismiss={(id: string) =>
              setUploads((prev) => prev.filter((u) => u.id !== id))
            }
            onDismissAll={() => setUploads([])}
          />
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
    </UploadDropzone>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence } from "motion/react";
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
import {
  sampleContentItems,
  sampleBreadcrumbs,
} from "@/lib/constants/content-mock-data";
import type {
  ContentItem,
  ViewMode,
  SortOption,
  FilterType,
  UploadProgress,
} from "@/types/content";

export default function ContentTab() {
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    position: { x: number; y: number };
    itemId: string | null;
  }>({ show: false, position: { x: 0, y: 0 }, itemId: null });

  // Filter and sort content
  const filteredAndSortedContent = useMemo(() => {
    let items = [...sampleContentItems];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Apply type filter
    if (activeFilter !== "all") {
      items = items.filter((item) => {
       
        const fileItem = item as any;

        switch (activeFilter) {
          case "docs":
            return ["docx", "txt", "md"].includes(fileItem.fileType);
          case "slides":
            return fileItem.fileType === "pptx";
          case "pdfs":
            return fileItem.fileType === "pdf";
          case "images":
            return ["png", "jpg", "jpeg", "gif"].includes(fileItem.fileType);
          case "videos":
            return fileItem.fileType === "mp4";
          case "audio":
            return fileItem.fileType === "mp3";
          case "archives":
            return fileItem.fileType === "zip";
          case "folders":
              return fileItem.type === "folder";
          default:
            return true;
        }
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        case "size":
          if (a.type === "folder" && b.type === "folder") {
            return (b as any).itemCount - (a as any).itemCount;
          }
          if (a.type === "folder") return -1;
          if (b.type === "folder") return 1;
          return (b as any).size - (a as any).size;
        case "type":
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type === "folder" ? -1 : 1;
        case "owner":
          return a.owner.name.localeCompare(b.owner.name);
        default:
          return 0;
      }
    });

    return items;
  }, [searchTerm, activeFilter, sortBy]);

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
    if (selectedItems.size === filteredAndSortedContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(filteredAndSortedContent.map((item) => item.id))
      );
    }
  };

  const handleItemClick = (id: string) => {
    console.log("Item clicked:", id);
    // In real app, this could navigate into folder or open file preview
  };

  const handleToggleInclude = (id: string) => {
    console.log("Toggle include for item:", id);
    // In real app, this would update the item's "include in Gilroy" status
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only hide if leaving the entire window
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (files: FileList) => {
    setIsDragging(false);

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
              u.id === uploadId ? { ...u, progress: 100, status: "completed" } : u
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

  const handleShowContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Show context menu for:", itemId);
    // In real app, would show context menu
  };

  return (
    <div
      className="h-full flex flex-col bg-main-background"
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
    >
      {/* Toolbar */}
      <ContentToolbar
        breadcrumbs={sampleBreadcrumbs}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedCount={selectedItems.size}
        onUpload={() => console.log("Upload clicked")}
        onNewFolder={() => console.log("New folder clicked")}
        onBulkDownload={() => console.log("Bulk download")}
        onBulkMove={() => console.log("Bulk move")}
        onBulkDelete={() => console.log("Bulk delete")}
        onBulkTag={() => console.log("Bulk tag")}
        onClearSelection={() => setSelectedItems(new Set())}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedContent.length === 0 ? (
          searchTerm ? (
            <NoSearchResults
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : (
            <EmptyFolderState
              onUpload={() => console.log("Upload")}
              onCreateFolder={() => console.log("Create folder")}
            />
          )
        ) : viewMode === "list" ? (
          // List View - Table
          <table className="w-full border-collapse">
            <ContentListHeader
              sortBy={sortBy}
              onSortChange={setSortBy}
              allSelected={
                selectedItems.size === filteredAndSortedContent.length &&
                filteredAndSortedContent.length > 0
              }
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {filteredAndSortedContent.map((item) => (
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
                selectedItems.size === filteredAndSortedContent.length &&
                filteredAndSortedContent.length > 0
              }
              onSelectAll={handleSelectAll}
            />
            {filteredAndSortedContent.map((item) => (
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

      {/* Upload Dropzone Overlay */}
      <UploadDropzone isActive={isDragging} onDrop={handleDrop} />

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
    </div>
  );
}

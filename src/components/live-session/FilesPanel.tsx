/**
 * FilesPanel Component
 * 
 * Displays session files with search, sort, and preview capabilities.
 * Opens files in new tabs using window.open().
 */

"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  FileArchive,
  File,
  ExternalLink,
  Download,
  Trash2,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import type { SessionFile } from "@/types/live-session";

interface FilesPanelProps {
  files: SessionFile[];
  onDeleteFile?: (fileId: string) => void;
}

type SortOption = "name" | "date" | "size" | "type";

export default function FilesPanel({ files, onDeleteFile }: FilesPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type === "image") return ImageIcon;
    if (type === "video") return Video;
    if (type === "pdf") return FileText;
    if (type === "document") return FileArchive;
    return File;
  };

  // Get color based on file type
  const getFileColor = (type: string) => {
    if (type === "image") return "text-primary";
    if (type === "video") return "text-secondary";
    if (type === "pdf") return "text-destructive";
    if (type === "document") return "text-accent";
    return "text-para";
  };

  // Format file size
  const formatFileSize = (size: string): string => {
    return size; // Already formatted in the data
  };

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    // Filter by search query
    if (searchQuery) {
      result = result.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return b.uploadedAt.getTime() - a.uploadedAt.getTime();
        case "size":
          return a.size.localeCompare(b.size);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return result;
  }, [files, searchQuery, sortBy]);

  // Handle file preview (opens in new tab)
  const handlePreview = (file: SessionFile) => {
    window.open(file.url, "_blank", "noopener,noreferrer");
    console.log(`[Files] Opening file in new tab: ${file.name}`);
  };

  // Handle file download
  const handleDownload = (file: SessionFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`[Files] Downloading file: ${file.name}`);
  };

  // Handle file delete
  const handleDelete = (file: SessionFile) => {
    if (window.confirm(`Delete "${file.name}"? This cannot be undone.`)) {
      onDeleteFile?.(file.id);
      console.log(`[Files] Deleted file: ${file.name}`);
    }
  };

  const sortOptions = [
    { value: "date" as SortOption, label: "Date Added" },
    { value: "name" as SortOption, label: "Name" },
    { value: "size" as SortOption, label: "Size" },
    { value: "type" as SortOption, label: "Type" },
  ];

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-light-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-heading">Session Files</h2>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
              {files.length}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary/5 hover:bg-secondary/10 border border-light-border rounded-lg text-sm text-para transition-colors"
            >
              Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
              <ChevronDown className="w-4 h-4" />
            </button>

            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-main-background border border-light-border rounded-lg shadow-lg py-1 min-w-[160px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm transition-colors
                        ${
                          sortBy === option.value
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-para hover:bg-secondary/10"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/5 border border-light-border rounded-lg text-sm text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredAndSortedFiles.length > 0 ? (
          <div className="space-y-2">
            {filteredAndSortedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const fileColor = getFileColor(file.type);

              return (
                <div
                  key={file.id}
                  className="p-3 bg-secondary/5 hover:bg-secondary/10 border border-light-border rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {/* File Icon */}
                    <div className={`p-2 bg-white rounded-lg ${fileColor}`}>
                      <FileIcon className="w-5 h-5" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-heading truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-para-muted">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>
                          Uploaded{" "}
                          {formatDistanceToNow(file.uploadedAt, {
                            addSuffix: true,
                          })}
                        </span>
                        <span>•</span>
                        <span>by {file.uploadedBy}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-primary"
                        title="Preview in new tab"
                        aria-label="Preview file"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-secondary"
                        title="Download file"
                        aria-label="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-destructive"
                        title="Delete file"
                        aria-label="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail for images */}
                  {file.type === "image" && (
                    <div className="mt-3">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border border-light-border cursor-pointer"
                        onClick={() => handlePreview(file)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FolderOpen className="w-12 h-12 text-para-muted mb-3" />
            <p className="text-para font-medium">
              {searchQuery ? "No files found" : "No files in this session"}
            </p>
            <p className="text-sm text-para-muted mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Files uploaded during the session will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

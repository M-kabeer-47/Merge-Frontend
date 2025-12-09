"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Search,
  Upload,
  FolderPlus,
  Grid3x3,
  List,
  ChevronDown,
  X,
  Download,
  Trash2,
  FolderOpen,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { BreadcrumbItem, ViewMode, SortOption, FilterType } from "@/types/content";
import CreateFolderModal from "../notes/CreateFolderModal";
import React from "react";
import { useParams } from "next/navigation";

interface ContentToolbarProps {
  breadcrumbs: BreadcrumbItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCount: number;
  onUpload?: () => void;
  onNewFolder?: () => void;
  onBulkDownload?: () => void;
  onBulkMove?: () => void;
  onBulkDelete?: () => void;
  onBulkTag?: () => void;
  onClearSelection?: () => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "folders", label: "Folders" },
  { value: "docs", label: "Docs" },
  { value: "slides", label: "Slides" },
  { value: "pdfs", label: "PDFs" },
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "archives", label: "Archives" },
];

const sortOptions: { value: SortOption; label: string; description: string }[] = [
  { value: "name", label: "Name", description: "A to Z" },
  { value: "date", label: "Date Modified", description: "Newest first" },
  { value: "size", label: "Size", description: "Largest first" },
  { value: "type", label: "Type", description: "Grouped by type" },
];

export default function ContentToolbar({
  breadcrumbs,
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  selectedCount,
  onUpload,
  onNewFolder,
  onBulkDownload,
  onBulkMove,
  onBulkDelete,
  onBulkTag,
  onClearSelection,
}: ContentToolbarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const params = useParams();
  const roomId = params?.id as string;

  return (
    <div className="bg-main-background border-b border-light-border sticky top-0 z-10">
      {/* Main Toolbar */}
      <div className="px-6 py-3 space-y-3">
        {/* Top Row: Breadcrumb + Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm min-w-0 flex-1"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-para-muted flex-shrink-0" />
                )}
                <button
                  className={`hover:text-primary transition-colors truncate ${
                    index === breadcrumbs.length - 1
                      ? "text-heading font-semibold"
                      : "text-para"
                  }`}
                  aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size={"sm"}
              className=" w-[130px]   px-4 flex items-center gap-2"
              onClick={onNewFolder}
              aria-label="Create new folder"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Folder</span>
            </Button>
            <Button
              className="px-4 w-[130px] flex items-center gap-2 bg-primary/90 text-white hover:bg-primary/90"
              onClick={onUpload}
              aria-label="Upload files"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>

        {/* Middle Row: Search + Filters + View Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-para-muted pointer-events-none" />
            <Input
              type="text"
              placeholder="Search files and folders"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 w-full"
              aria-label="Search files and folders"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {filterOptions.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.value
                    ? "bg-secondary text-white"
                    : "bg-secondary/10 text-para hover:bg-secondary/20"
                }`}
                aria-pressed={activeFilter === filter.value}
                aria-label={`Filter by ${filter.label}`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="h-10 px-3 rounded-lg border border-light-border bg-main-background hover:border-secondary/30 transition-colors flex items-center gap-2 text-sm"
                aria-label="Sort options"
                aria-expanded={showSortDropdown}
                aria-haspopup="menu"
              >
                <span className="text-para">
                  {sortOptions.find((opt) => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="h-4 w-4 text-para-muted" />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    {/* Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-main-background border border-light-border rounded-lg shadow-lg py-2 z-20"
                      role="menu"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-secondary/10 transition-colors ${
                            sortBy === option.value ? "bg-secondary/5" : ""
                          }`}
                          role="menuitem"
                        >
                          <div className="font-medium text-sm text-heading">
                            {option.label}
                          </div>
                          <div className="text-xs text-para-muted mt-0.5">
                            {option.description}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary/10 rounded-lg">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                  viewMode === "grid"
                    ? "bg-secondary text-white"
                    : "text-para hover:text-primary"
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`h-8 w-8 rounded flex items-center justify-center transition-colors ${
                  viewMode === "list"
                    ? "bg-secondary text-white"
                    : "text-para hover:text-primary"
                }`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-light-border bg-secondary/5 overflow-hidden"
          >
            <div className="px-6 py-3 flex items-center justify-between gap-4">
              {/* Selection Count */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearSelection}
                  className="text-para hover:text-primary transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="text-sm font-semibold text-heading">
                  {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                </span>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 px-3 flex items-center gap-2"
                  onClick={onBulkTag}
                  aria-label="Add tags to selected items"
                >
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Tag</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-3 flex items-center gap-2"
                  onClick={onBulkMove}
                  aria-label="Move selected items"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Move</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-3 flex items-center gap-2"
                  onClick={onBulkDownload}
                  aria-label="Download selected items"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Download</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-3 flex items-center gap-2 text-destructive hover:bg-destructive/10 border-destructive/30"
                  onClick={onBulkDelete}
                  aria-label="Delete selected items"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Delete</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        searchQuery={searchTerm}
        folderType="room"
        roomId={roomId}
      />
    </div>
  );
}

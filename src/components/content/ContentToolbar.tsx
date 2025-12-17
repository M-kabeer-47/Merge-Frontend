"use client";

import { useState } from "react";
import { FolderPlus, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FilterChips from "@/components/ui/FilterChips";
import ViewModeToggle from "@/components/ui/ViewModeToggle";
import SortToggle from "@/components/ui/SortToggle";
import BulkActionBar from "@/components/ui/BulkActionBar";
import CreateFolderModal from "../notes/CreateFolderModal";
import type {
  BreadcrumbItem,
  ViewMode,
  SortOption,
  FilterType,
} from "@/types/content";
import { useParams, useRouter } from "next/navigation";
import { ContentSortBy, ContentSortOrder } from "@/types/room-content";

interface ContentToolbarProps {
  breadcrumbs: BreadcrumbItem[];
  currentFolderId?: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  sortOrder: ContentSortOrder;
  onSortChange: (sort: SortOption) => void;
  selectedCount: number;
  selectedIds: Set<string>;
  contentItems: Array<{ id: string; type: "folder" | "file" }>;
  onUpload?: () => void;
  onBulkDownload?: () => void;
  onBulkMove?: () => void;
  onBulkTag?: () => void;
  onClearSelection?: () => void;
  onResetFilters?: () => void;
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "folders", label: "Folders" },
  { value: "files", label: "Files" },
  { value: "images", label: "Images" },
];

export default function ContentToolbar({
  breadcrumbs,
  currentFolderId,
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedCount,
  selectedIds,
  contentItems,
  onUpload,
  onBulkDownload,
  onBulkMove,
  onBulkTag,
  onClearSelection,
  onResetFilters,
}: ContentToolbarProps) {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  // Map UI sort options to API sort params for the modal
  const apiSortBy: ContentSortBy = sortBy ? "updatedAt" : null;

  // Get the previous breadcrumb for back navigation
  const previousBreadcrumb =
    breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
  const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

  const handleBack = () => {
    if (previousBreadcrumb?.path) {
      router.push(previousBreadcrumb.path);
    }
  };

  return (
    <div className="bg-main-background border-b border-light-border sticky top-0 z-10">
      {/* Main Toolbar */}
      <div className="px-4 sm:px-6 py-3 space-y-3">
        {/* Top Row: Breadcrumb/Back + Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile: Back arrow + current folder name */}
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:hidden">
            {previousBreadcrumb && (
              <button
                onClick={handleBack}
                className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-para" />
              </button>
            )}
            <span className="text-heading font-semibold truncate">
              {currentBreadcrumb?.name || "Content"}
            </span>
          </div>

          {/* Desktop: Full breadcrumbs */}
          <div className="hidden sm:block flex-1 min-w-0">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Desktop: Right Actions */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="w-[130px] px-4 flex items-center gap-2"
              onClick={() => setIsCreateFolderModalOpen(true)}
              aria-label="Create new folder"
            >
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
            <Button
              className="px-4 w-[130px] flex items-center gap-2 bg-primary/90 text-white hover:bg-primary/90"
              onClick={onUpload}
              aria-label="Upload files"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>

          {/* Mobile: View toggle at right */}
          <div className="flex sm:hidden items-center flex-shrink-0">
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>

        {/* Middle Row: Search + Filters + View Controls */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full lg:max-w-md">
            <SearchBar
              defaultValue={searchTerm}
              onSearch={onSearchChange}
              placeholder="Search files and folders..."
            />
          </div>

          {/* Filter Chips + Sort (mobile) */}
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            <div className="flex-1 overflow-x-auto">
              <FilterChips
                options={filterOptions}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
              />
            </div>
            {/* Sort on mobile - same row as filters */}
            <div className="sm:hidden flex-shrink-0">
              <SortToggle value={sortBy} onChange={onSortChange} />
            </div>
          </div>

          {/* View Controls - desktop only */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <SortToggle value={sortBy} onChange={onSortChange} />
            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>

        {/* Mobile: Action buttons row - right aligned */}
        <div className="flex sm:hidden items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-[100px] flex items-center gap-2 "
            onClick={() => setIsCreateFolderModalOpen(true)}
            aria-label="Create new folder"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
          <Button
            size="sm"
            className="w-[100px] flex items-center gap-2 bg-primary/90 text-white hover:bg-primary/90"
            onClick={onUpload}
            aria-label="Upload files"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        selectedIds={selectedIds}
        contentItems={contentItems}
        onClearSelection={onClearSelection || (() => {})}
        roomId={roomId}
        folderId={currentFolderId}
        onResetFilters={onResetFilters}
        onTag={onBulkTag}
        onMove={onBulkMove}
        onDownload={onBulkDownload}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        folderId={currentFolderId}
        folderType="room"
        roomId={roomId}
        onSuccess={onResetFilters}
      />
    </div>
  );
}

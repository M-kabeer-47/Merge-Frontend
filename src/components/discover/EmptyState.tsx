"use client";

import { Search, Filter } from "lucide-react";

interface EmptyStateProps {
  type: "no-results" | "no-rooms";
  searchQuery?: string;
  onClearFilters?: () => void;
}

export default function EmptyState({
  type,
  searchQuery,
  onClearFilters,
}: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-para-muted" />
        </div>
        <h3 className="text-xl font-bold text-heading mb-2">No rooms found</h3>
        <p className="text-sm text-para-muted text-center max-w-md mb-6">
          {searchQuery
            ? `We couldn't find any rooms matching "${searchQuery}". Try different keywords or adjust your filters.`
            : "No rooms match your current filters. Try adjusting your search criteria."}
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-sm font-medium text-white"
          >
            <Filter className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-para-muted" />
      </div>
      <h3 className="text-xl font-bold text-heading mb-2">
        No public rooms available
      </h3>
      <p className="text-sm text-para-muted text-center max-w-md">
        There are currently no public rooms to discover. Check back later for new
        rooms.
      </p>
    </div>
  );
}

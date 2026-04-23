"use client";

import React from "react";
import { Search } from "lucide-react";

interface NoSearchResultsProps {
  searchTerm?: string;
  onClearFilters?: () => void;
}

export function NoSearchResults({
  searchTerm,
  onClearFilters,
}: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-10 w-10 text-para-muted" />
      </div>
      <h3 className="text-[18px] font-bold text-heading mb-2">
        No announcements found
      </h3>
      <p className="text-[14px] text-para-muted text-center max-w-md mb-6">
        {searchTerm
          ? `No announcements match "${searchTerm}". Try adjusting your search or filters.`
          : "No announcements match your current filters. Try adjusting your selection."}
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-background text-para border border-light-border text-[14px] font-semibold rounded-lg hover:bg-background transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
}

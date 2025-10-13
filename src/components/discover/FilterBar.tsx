"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TagChip from "./TagChip";
import type { SortOption } from "@/types/discover";

interface FilterBarProps {
  availableTags: string[];
  selectedTags: string[];
  sortBy: SortOption;
  onTagToggle: (tag: string) => void;
  onSortChange: (sort: SortOption) => void;
  onClearFilters: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "most-active", label: "Most Active" },
  { value: "most-members", label: "Most Members" },
];

export default function FilterBar({
  availableTags,
  selectedTags,
  sortBy,
  onTagToggle,
  onSortChange,
  onClearFilters,
}: FilterBarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleTagsCount = 8;
  const displayedTags = showAllTags
    ? availableTags
    : availableTags.slice(0, visibleTagsCount);

  const hasFilters = selectedTags.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort by";

  return (
    <div className="space-y-4">
      {/* Top Row: Sort and Clear */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-para-muted" />
          <span className="text-sm font-medium text-heading">Filters</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 h-10 rounded-lg border border-light-border bg-background hover:bg-secondary/5 transition-colors text-sm font-medium text-heading"
              aria-label="Sort options"
              aria-expanded={showSortDropdown}
              aria-haspopup="true"
            >
              <span>{currentSortLabel}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showSortDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSortDropdown && (
              <div
                className="absolute right-0 top-12 w-48 bg-background border border-light-border rounded-lg shadow-lg z-50 overflow-hidden"
                role="menu"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-secondary/10 transition-colors ${
                      sortBy === option.value
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-para"
                    }`}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 h-10 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Tags Row */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {displayedTags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={selectedTags.includes(tag)}
              onClick={() => onTagToggle(tag)}
              variant="filter"
            />
          ))}

          {availableTags.length > visibleTagsCount && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              aria-expanded={showAllTags}
            >
              {showAllTags
                ? "Show Less"
                : `+${availableTags.length - visibleTagsCount} more`}
            </button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasFilters && (
          <div className="flex items-center gap-2 text-xs text-para-muted">
            <span>Active filters:</span>
            <span className="font-medium text-primary">
              {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

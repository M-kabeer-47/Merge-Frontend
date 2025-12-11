"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types/content";

interface ContentGridHeaderProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  allSelected?: boolean;
  onSelectAll?: () => void;
}

export default function ContentGridHeader({
  sortBy,
  onSortChange,
  allSelected = false,
  onSelectAll,
}: ContentGridHeaderProps) {
  const SortButton = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: SortOption;
  }) => {
    const isActive = sortBy === sortKey;

    return (
      <button
        onClick={() => onSortChange(sortKey)}
        className="flex items-center gap-1 text-[11px] font-semibold text-para hover:text-heading transition-colors uppercase tracking-wider"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {isActive && (
          <ChevronDown
            className="h-3.5 w-3.5 text-secondary"
            strokeWidth={2.5}
          />
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-[40px_1fr_40px] sm:grid-cols-[50px_1fr_180px_200px_50px] gap-2 sm:gap-4 px-3 py-3 border-b border-light-border bg-secondary/5 sticky top-0 z-10">
      {/* Checkbox column */}
      <div
        onClick={onSelectAll}
        className="cursor-pointer flex items-center justify-center"
      >
        <div
          className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all ${
            allSelected
              ? "bg-secondary border-secondary"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {allSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              strokeWidth="2.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="flex items-center">
        <SortButton label="Name" sortKey="name" />
      </div>

      {/* Created By - hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <SortButton label="Created by" sortKey="owner" />
      </div>

      {/* Last Modified - hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <SortButton label="Last modified" sortKey="date" />
      </div>

      {/* Empty space for three dots */}
      <div className="w-8" />
    </div>
  );
}

"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/types/content";

interface ContentListHeaderProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  allSelected?: boolean;
  onSelectAll?: () => void;
}

export default function ContentListHeader({
  sortBy,
  onSortChange,
  allSelected = false,
  onSelectAll,
}: ContentListHeaderProps) {
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
    <thead className="sticky top-0 bg-secondary/5">
      <tr className="border-b border-light-border">
        {/* Checkbox column */}
        <th className="w-[50px] px-3 py-3 text-left">
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
        </th>

        {/* Name - always visible */}
        <th className="px-3 py-3 text-left">
          <SortButton label="Name" sortKey="name" />
        </th>

        {/* Created By - hidden on mobile */}
        <th className="hidden md:table-cell w-[180px] px-3 py-3 text-left">
          <SortButton label="Created by" sortKey="owner" />
        </th>

        {/* Last Modified - hidden on small screens */}
        <th className="hidden sm:table-cell w-[200px] px-3 py-3 text-left">
          <SortButton label="Last modified" sortKey="date" />
        </th>

        {/* Actions column */}
        <th className="w-[50px] px-3 py-3"></th>
      </tr>
    </thead>
  );
}

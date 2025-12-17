"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortOption } from "@/types/content";

interface SortToggleProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * A simple toggle button for sorting by Date Modified.
 * Cycles through: null (no sort) → date-desc (newest) → date-asc (oldest) → null
 */
export default function SortToggle({ value, onChange }: SortToggleProps) {
  const handleClick = () => {
    // Cycle through: null → date-desc → date-asc → null
    if (value === null) {
      onChange("date-desc");
    } else if (value === "date-desc") {
      onChange("date-asc");
    } else {
      onChange(null);
    }
  };

  // Determine display state
  const getLabel = () => {
    switch (value) {
      case "date-desc":
        return "Newest";
      case "date-asc":
        return "Oldest";
      default:
        return "Sort";
    }
  };

  const getIcon = () => {
    switch (value) {
      case "date-desc":
        return <ArrowDown className="h-4 w-4" />;
      case "date-asc":
        return <ArrowUp className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`h-10 px-3 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
        value
          ? "border-secondary/50 bg-secondary/5 text-secondary"
          : "border-light-border bg-main-background hover:border-secondary/30 text-para"
      }`}
      aria-label={`Sort by date modified: ${getLabel()}`}
    >
      {getIcon()}
      <span className="hidden sm:inline">{getLabel()}</span>
    </button>
  );
}

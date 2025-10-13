"use client";

import { TaskCategory } from "@/app/(with-layout)/calendar/page";
import { getCategoryIcon, getCategoryLabel } from "@/lib/utils/calendar-utils";

interface CategoryChipsProps {
  activeFilters: TaskCategory[];
  onToggle: (category: TaskCategory) => void;
}

const categories: TaskCategory[] = [
  "assignment",
  "quiz",
  "video-session",
  "personal",
];

export default function CategoryChips({
  activeFilters,
  onToggle,
}: CategoryChipsProps) {
  const isAllActive = activeFilters.length === 0;

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-para-muted">Filter by category:</span>
      
      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <button
          onClick={() => {
            if (!isAllActive) {
              // Clear all filters
              activeFilters.forEach((cat) => onToggle(cat));
            }
          }}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${
              isAllActive
                ? "bg-primary text-white"
                : "bg-background border border-light-border text-para hover:bg-secondary/10"
            }
          `}
          aria-pressed={isAllActive}
        >
          All
        </button>

        {/* Category buttons */}
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          const isActive = activeFilters.includes(category);

          return (
            <button
              key={category}
              onClick={() => onToggle(category)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-background border border-light-border text-para hover:bg-secondary/10"
                }
              `}
              aria-pressed={isActive}
            >
              <Icon className="w-3.5 h-3.5" />
              {getCategoryLabel(category)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
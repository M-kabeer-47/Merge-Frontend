"use client";

import { Grid3x3, List } from "lucide-react";
import type { ViewMode } from "@/types/content";
import { cn } from "@/lib/shadcn/utils";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
  className,
}: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 bg-secondary/10 rounded-lg",
        className
      )}
    >
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
  );
}

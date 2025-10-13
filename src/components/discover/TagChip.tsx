"use client";

import { X } from "lucide-react";

interface TagChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: "default" | "filter";
}

export default function TagChip({
  label,
  active = false,
  onClick,
  onRemove,
  variant = "default",
}: TagChipProps) {
  const isClickable = onClick || onRemove;

  if (variant === "filter") {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200  hover:bg-secondary/20 hover:text-primary ${active ? "bg-primary text-white shadow-sm" : "bg-secondary/10 text-para hover:bg-secondary/20 hover:text-primary"} ${
          isClickable ? "cursor-pointer" : "cursor-default"
        }`}
        aria-pressed={active}
        aria-label={`Filter by ${label}`}
      >
        <span>{label}</span>
      </button>
    );
  }

  return (
    <span
      className={`px-2 py-1 bg-secondary/15 text-primary  text-xs rounded-full font-medium ${
        onRemove ? "pr-1" : ""
      }`}
      role="status"
      aria-label={`Tag: ${label}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${label} tag`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

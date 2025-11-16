"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
  error?: string;
  maxTags?: number;
}

export default function TagSelector({
  selectedTags,
  onChange,
  availableTags,
  error,
  maxTags = 5,
}: TagSelectorProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 12;

  const displayedTags = showAll
    ? availableTags
    : availableTags.slice(0, initialDisplayCount);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      // Add tag if under limit
      if (selectedTags.length < maxTags) {
        onChange([...selectedTags, tag]);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Info Text */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-para-muted">
          Select up to {maxTags} tags to categorize your room
        </p>
        <span className="text-xs font-medium text-secondary">
          {selectedTags.length}/{maxTags} selected
        </span>
      </div>

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          const isDisabled = !isSelected && selectedTags.length >= maxTags;

          return (
            <motion.button
              key={tag}
              type="button"
              onClick={() => handleToggleTag(tag)}
              disabled={isDisabled}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  isSelected
                    ? "bg-primary text-white border-2 border-main-background"
                    : isDisabled
                    ? "bg-background text-para-muted border-2 border-light-border cursor-not-allowed opacity-50"
                    : `bg-background text-para border-2 border-light-border hover:border-secondary/30  hover:bg-secondary/10 ${
                        isDarkMode
                          ? "hover:text-secondary"
                          : "hover:text-primary"
                      }`
                }
              `}
            >
              {tag}
            </motion.button>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {availableTags.length > initialDisplayCount && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show {availableTags.length - initialDisplayCount} More Tags
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}

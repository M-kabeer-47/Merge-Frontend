"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowUp, ArrowDown, Check } from "lucide-react";
import type { SortOption, SortField } from "@/types/content";

interface SortOptionConfig {
  field: SortField;
  label: string;
  descLabel?: string;
  ascLabel?: string;
}

interface SortDropdownProps {
  options: SortOptionConfig[];
  value: SortOption;
  onChange: (value: SortOption) => void;
  placeholder?: string;
}

export default function SortDropdown({
  options,
  value,
  onChange,
  placeholder = "Sort by",
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Find the currently selected option
  const selectedOption = value
    ? options.find((opt) => opt.field === value.field)
    : null;

  // Get display text for current selection
  const getDisplayText = () => {
    if (!selectedOption || !value) return placeholder;
    const orderLabel =
      value.order === "desc"
        ? selectedOption.descLabel
        : selectedOption.ascLabel;
    return orderLabel || selectedOption.label;
  };

  // Handle option click - toggle order if same field, otherwise select with desc
  const handleOptionClick = (field: SortField) => {
    if (value?.field === field) {
      // Same field - toggle order
      const newOrder = value.order === "desc" ? "asc" : "desc";
      onChange({ field, order: newOrder });
    } else {
      // New field - default to desc (newest/largest first)
      onChange({ field, order: "desc" });
    }
    setIsOpen(false);
  };

  // Clear sort
  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm font-medium 
          
             border-light-border  text-para shadow-sm
  "
        aria-label="Sort options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{getDisplayText()}</span>
        {value &&
          (value.order === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          ))}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${value ? "text-primary" : "text-para-muted"}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-main-background border border-light-border rounded-xl shadow-xl py-2 z-20 overflow-hidden"
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-light-border">
              <span className="text-xs font-semibold text-para-muted uppercase tracking-wide">
                Sort by
              </span>
            </div>

            {/* Options */}
            <div className="py-1">
              {options.map((option) => {
                const isSelected = value?.field === option.field;
                const currentOrder = isSelected ? value.order : null;

                return (
                  <button
                    key={option.field}
                    onClick={() => handleOptionClick(option.field)}
                    className={`w-full px-4 py-3 text-left hover:bg-secondary/10 transition-colors flex items-center justify-between group ${
                      isSelected ? "bg-secondary/5" : ""
                    }`}
                    role="menuitem"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-heading"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-xs text-para-muted">
                        {isSelected
                          ? currentOrder === "desc"
                            ? option.descLabel || "Descending"
                            : option.ascLabel || "Ascending"
                          : option.descLabel || "Click to sort"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isSelected && (
                        <>
                          {currentOrder === "desc" ? (
                            <ArrowDown className="h-4 w-4 text-secondary" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-secondary" />
                          )}
                          <Check className="h-4 w-4 text-secondary" />
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear option */}
            {value && (
              <>
                <div className="border-t border-light-border" />
                <button
                  onClick={handleClear}
                  className="w-full px-4 py-2.5 text-left text-sm text-para-muted hover:text-heading hover:bg-secondary/10 transition-colors"
                  role="menuitem"
                >
                  Clear sort
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

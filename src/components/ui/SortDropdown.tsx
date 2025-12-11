"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface SortOption<T> {
  value: T;
  label: string;
  description?: string;
}

interface SortDropdownProps<T> {
  options: SortOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
}

export default function SortDropdown<T>({
  options,
  value,
  onChange,
  placeholder = "Sort by",
}: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3 rounded-lg border border-light-border bg-main-background hover:border-secondary/30 transition-colors flex items-center gap-2 text-sm"
        aria-label="Sort options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="text-para">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-para-muted" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-main-background border border-light-border rounded-lg shadow-lg py-2 z-20"
              role="menu"
            >
              {options.map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-secondary/10 transition-colors ${
                    value === option.value ? "bg-secondary/5" : ""
                  }`}
                  role="menuitem"
                >
                  <div className="font-medium text-sm text-heading">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-para-muted mt-0.5">
                      {option.description}
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

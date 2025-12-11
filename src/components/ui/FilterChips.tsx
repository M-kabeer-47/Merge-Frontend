"use client";

import { motion } from "motion/react";

interface FilterChipsProps<T extends string> {
  options: { value: T; label: string }[];
  activeFilter: T;
  onFilterChange: (value: T) => void;
}

export default function FilterChips<T extends string>({
  options,
  activeFilter,
  onFilterChange,
}: FilterChipsProps<T>) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeFilter === option.value
              ? "bg-secondary text-white"
              : "bg-secondary/10 text-para hover:bg-secondary/20"
          }`}
          aria-pressed={activeFilter === option.value}
          aria-label={`Filter by ${option.label}`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

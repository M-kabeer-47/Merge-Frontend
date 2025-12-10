"use client";
import React, { useState, useEffect, useCallback } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "./Input";

interface SearchBarProps {
  /** Debounced callback - called after user stops typing */
  onSearch: (value: string) => void;
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  /** Initial value */
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  debounceMs = 300,
  defaultValue = "",
  placeholder = "Search...",
  className = "",
}) => {
  const [value, setValue] = useState(defaultValue);

  // Debounced search - always debounces
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]); // Note: intentionally omitting onSearch to avoid re-triggering

  const handleClear = useCallback(() => {
    setValue("");
    onSearch(""); // Immediately clear
  }, [onSearch]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="block w-full px-10 py-2.5"
      />
      <IconSearch className="absolute left-3 h-5 w-5 text-para-muted" />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <IconX className="h-4 w-4 text-para-muted hover:text-heading" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

"use client";
import React from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search rooms...",
  className = "",
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-heading focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-normal-text-muted transition-all duration-200"
      />
      
      <IconSearch className="absolute left-3 h-5 w-5 text-normal-text-muted" />
      
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IconX className="h-4 w-4 text-normal-text-muted hover:text-heading" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

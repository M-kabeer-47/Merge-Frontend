import { motion } from "motion/react";
import { Grid3x3, List } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import type { NoteViewMode } from "@/types/note";
import { useEffect, useState } from "react";

interface NotesToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: NoteViewMode;
  setViewMode: (mode: NoteViewMode) => void;
}

export default function NotesToolbar({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
}: NotesToolbarProps) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const settingSearchTerm = setTimeout(() => {
      setSearchTerm(debouncedSearchTerm);
    }, 300); // 300ms debounce
    return () => clearTimeout(settingSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center justify-between gap-3"
    >
      <div className="flex-1 max-w-md">
        <SearchBar
          searchTerm={debouncedSearchTerm}
          setSearchTerm={setDebouncedSearchTerm}
          placeholder="Search notes and folders..."
        />
      </div>

      <div className="flex items-center gap-2">
        {/* View Mode Toggle */}
        <div className="flex items-center border border-light-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-main-background text-para hover:bg-background"
              }`}
            title="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list"
                ? "bg-primary text-white"
                : "bg-main-background text-para hover:bg-background"
              }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

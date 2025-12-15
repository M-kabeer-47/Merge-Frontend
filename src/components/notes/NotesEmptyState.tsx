import Image from "next/image";
import { motion } from "motion/react";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotesEmptyStateProps {
  searchTerm: string;
  onCreateNote: () => void;
  onCreateFolder: () => void;
}

export default function NotesEmptyState({
  searchTerm,
  onCreateNote,
  onCreateFolder,
}: NotesEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center justify-center py-20"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src={
            searchTerm
              ? "/illustrations/no-search-results.png"
              : "/illustrations/empty-notes.png"
          }
          alt={searchTerm ? "No search results" : "Empty notes"}
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>

      <h3 className="text-xl font-bold text-heading mb-2">
        {searchTerm ? "No items found" : "Empty folder"}
      </h3>
      <p className="text-para-muted text-center max-w-md mb-6">
        {searchTerm
          ? `No items match your search for "${searchTerm}".`
          : "Start organizing by creating folders and notes."}
      </p>
      {!searchTerm && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onCreateFolder}
            className="flex items-center gap-2"
          >
            <FolderPlus className="w-5 h-5" />
            Create Folder
          </Button>
          <Button onClick={onCreateNote} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Note
          </Button>
        </div>
      )}
    </motion.div>
  );
}

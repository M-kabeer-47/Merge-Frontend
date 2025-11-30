import { motion } from "motion/react";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NotesHeaderProps {
  onCreateNote: () => void;
  onCreateFolder: () => void;
}

export default function NotesHeader({ onCreateNote, onCreateFolder }: NotesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-raleway font-bold text-heading">
          My Notes
        </h1>
        <p className="text-para-muted mt-2">
          Organize your thoughts with folders and notes
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onCreateFolder}
          className="flex items-center gap-2"
        >
          <FolderPlus className="w-5 h-5" />
          <span className="hidden sm:inline">New Folder</span>
        </Button>
        <Button
          onClick={onCreateNote}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">New Note</span>
        </Button>
      </div>
    </motion.div>
  );
}

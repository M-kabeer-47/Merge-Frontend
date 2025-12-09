"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCreateFolder from "@/hooks/notes/use-create-folder";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
  searchQuery: string;
  folderType?: "notes" | "room";
  roomId?: string;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  folderId,
  searchQuery,
  folderType = "notes",
  roomId,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const { createFolder, isCreating } = useCreateFolder({ 
    searchQuery
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      await createFolder({
        name: folderName.trim(),
        type: folderType,
        parentFolderId: folderId,
        roomId: folderType === "room" ? roomId : undefined,
      });
      setFolderName("");
      onClose();
    }
  };

  const handleClose = () => {
    setFolderName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-main-background rounded-lg shadow-xl w-full max-w-md mx-4 border border-light-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border">
          <h2 className="text-xl font-bold text-heading font-raleway">
            Create New Folder
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-background transition-colors"
            disabled={isCreating}
          >
            <X className="w-5 h-5 text-para-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="folderName"
              className="block text-sm font-medium text-heading mb-2"
            >
              Folder Name
            </label>
            <Input
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name..."
              autoFocus
              disabled={isCreating}
              maxLength={100}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!folderName.trim() || isCreating}
            >
              {isCreating ? <LoadingSpinner size="sm" text="Creating..." /> : "Create Folder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import useCreateFolder from "@/hooks/notes/use-create-folder";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
  folderType?: "notes" | "room";
  roomId?: string;
  onSuccess?: () => void;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  folderId,
  folderType = "notes",
  roomId,
  onSuccess,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const { createFolder, isCreating } = useCreateFolder();

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
      onSuccess?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (isCreating) return;
    setFolderName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Folder"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit}>
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

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!folderName.trim() || isCreating}>
            {isCreating ? (
              <LoadingSpinner size="sm" text="Creating..." />
            ) : (
              "Create Folder"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

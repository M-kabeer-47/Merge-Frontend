"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { RoomMember } from "@/types/room-settings";

interface RemoveModeratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  moderator: RoomMember | null;
  onConfirm: () => Promise<void>;
}

export default function RemoveModeratorModal({
  isOpen,
  onClose,
  moderator,
  onConfirm,
}: RemoveModeratorModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirm = async () => {
    setIsRemoving(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsRemoving(false);
    }
  };

  if (!moderator) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Moderator"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-para">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-heading">{moderator.name}</span>{" "}
            as a moderator? They will lose all moderator privileges but remain
            as a member.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleConfirm}
            variant="destructive"
            className="flex-1"
            disabled={isRemoving}
            aria-label="Confirm remove moderator"
          >
            {isRemoving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Remove Moderator
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isRemoving}
            aria-label="Cancel removal"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

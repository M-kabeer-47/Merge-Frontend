"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import useDeleteRoom from "@/hooks/rooms/use-delete-room";
import LoadingSpinner from "../ui/LoadingSpinner";

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  roomTitle: string;
  filter: "all" | "created" | "joined";
  search: string;
}

export default function DeleteRoomModal({
  isOpen,
  onClose,
  roomId,
  roomTitle,
  filter,
  search,
}: DeleteRoomModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const { deleteRoom, isDeleting } = useDeleteRoom();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  const isConfirmEnabled = confirmText === roomTitle;

  const handleDelete = async () => {
    if (!roomId || !isConfirmEnabled) return;

    await deleteRoom({
      roomId,
      filter,
      search,
    });
    onClose();
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      onClose();
    }
  };

  if (!roomId) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 min-h-screen"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-main-background rounded-xl border border-light-border shadow-xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-heading">
                      Delete Room
                    </h2>
                    <p className="text-sm text-para-muted">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="p-1 rounded-lg hover:bg-light-border/50 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-para-muted" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-sm text-para">
                  You are about to delete{" "}
                  <span className="font-semibold text-heading">
                    "{roomTitle}"
                  </span>
                  . All content, files, and member access will be permanently
                  removed.
                </p>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-heading">
                    Type{" "}
                    <span className="font-semibold text-destructive">
                      "{roomTitle}"
                    </span>{" "}
                    to confirm
                  </label>
                  <Input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Enter room name"
                    disabled={isDeleting}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={!isConfirmEnabled || isDeleting}
                >
                  {isDeleting ? (
                    <LoadingSpinner text="Deleting..." size="sm" />
                  ) : (
                    "Delete Room"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

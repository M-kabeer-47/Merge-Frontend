"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import useDeleteRoom from "@/hooks/rooms/use-delete-room";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";

export default function DeleteRoomModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL
  const deleteId = searchParams.get("delete");
  const filter =
    (searchParams.get("filter") as "all" | "created" | "joined") || "all";
  const search = searchParams.get("search") || "";

  // Get rooms to find the title
  const { rooms } = useGetUserRooms({ filter, search });
  const roomToDelete = rooms.find((r) => r.id === deleteId);

  const isOpen = !!deleteId && !!roomToDelete;
  const roomTitle = roomToDelete?.title || "";

  const [confirmText, setConfirmText] = useState("");
  const { deleteRoom, isDeleting } = useDeleteRoom();

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  const isConfirmEnabled = confirmText === roomTitle;

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText("");
      // Remove delete param from URL while preserving others
      const params = new URLSearchParams(searchParams.toString());
      params.delete("delete");
      const queryString = params.toString();
      router.push(queryString ? `/rooms?${queryString}` : "/rooms");
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !isConfirmEnabled) return;

    await deleteRoom({
      roomId: deleteId,
      filter,
      search,
    });
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Room"
      description="This action cannot be undone"
      icon={
        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Warning Message */}
        <p className="text-sm text-para">
          You are about to delete{" "}
          <span className="font-semibold text-heading">{roomTitle}</span>. All
          content, files, and member access will be permanently removed.
        </p>

        {/* Confirmation Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-heading">
            Type{" "}
            <span className="font-semibold text-destructive">{roomTitle}</span>{" "}
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
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
    </Modal>
  );
}

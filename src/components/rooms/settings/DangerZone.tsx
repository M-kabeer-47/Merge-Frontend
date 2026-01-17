/**
 * DangerZone Component
 *
 * Handles destructive room actions: Archive (soft delete) and Delete (permanent).
 * Requires strict confirmation for both operations.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  AlertTriangle,
  Archive,
  Trash2,
  FileText,
  MessageSquare,
  Users,
  FolderOpen,
} from "lucide-react";

interface DangerZoneProps {
  roomTitle: string;
  roomId: string;
  onArchiveRoom: () => void;
  onDeleteRoom: () => void;
}

export default function DangerZone({
  roomTitle,
  roomId,
  onArchiveRoom,
  onDeleteRoom,
}: DangerZoneProps) {
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleArchive = () => {
    onArchiveRoom();
    // TODO: Integrate with backend API
    // Example: await archiveRoom(roomId);
    setShowArchiveConfirm(false);
  };

  const handleDelete = () => {
    if (deleteConfirmText === roomTitle) {
      onDeleteRoom();
      // TODO: Integrate with backend API and redirect
      // Example: await deleteRoom(roomId);
      // Example: router.push('/dashboard');
    }
  };

  return (
    <>
      <div className="bg-backround border-2 border-destructive/30 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-xl font-raleway font-bold text-heading">
              Danger Zone
            </h3>
            <p className="text-sm text-para-muted mt-1">
              Irreversible or destructive actions. Proceed with caution.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Archive Room */}
          <div className="p-4 bg-main-background border border-light-border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-heading text-sm flex items-center gap-2 mb-1">
                  <Archive className="w-4 h-4 text-accent" />
                  Archive Room
                </h4>
                <p className="text-xs text-para-muted">
                  Make the room read-only. Members can view content but cannot
                  post or interact. Can be unarchived later.
                </p>
              </div>
              <Button
                onClick={() => setShowArchiveConfirm(true)}
                size="sm"
                className="w-[120px]"
                aria-label="Archive room"
              >
                <Archive className="w-4 h-4" />
                Archive
              </Button>
            </div>
          </div>

          {/* Delete Room */}
          <div className="p-4 bg-main-background border border-light-border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-heading text-sm flex items-center gap-2 mb-1">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  Delete Room Permanently
                </h4>
                <p className="text-xs text-para-muted mb-3">
                  Permanently delete this room and all its content. This action
                  cannot be undone.
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-para-muted">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Assignments
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Chats
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-3 h-3" />
                    Files
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Member data
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                size="sm"
                className="w-[120px]"
                aria-label="Delete room permanently"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        title="Archive Room?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-para">
            Archiving this room will make it read-only. Members will still have
            access to view all content, but they won&apos;t be able to:
          </p>

          <ul className="space-y-1.5 text-sm text-para ml-4">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">•</span>
              <span>Post new messages or replies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">•</span>
              <span>Submit assignments or quizzes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">•</span>
              <span>Upload files or content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold mt-0.5">•</span>
              <span>Join live sessions</span>
            </li>
          </ul>

          <div className="p-3 bg-info/10 border border-info/30 rounded-lg">
            <p className="text-xs text-para">
              <span className="font-semibold">Good news:</span> You can
              unarchive the room at any time from room settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleArchive}
              variant="outline"
              className="flex-1"
              aria-label="Confirm archive room"
            >
              <Archive className="w-4 h-4" />
              Archive Room
            </Button>
            <Button
              onClick={() => setShowArchiveConfirm(false)}
              variant="outline"
              className="flex-1"
              aria-label="Cancel archiving"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmText("");
        }}
        title="Delete Room Permanently"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-heading mb-2">
                  This action is irreversible!
                </p>
                <p className="text-sm text-para">
                  Deleting this room will permanently remove:
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5 text-sm text-para ml-2">
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold mt-0.5">•</span>
              <span>All assignments, quizzes, and submissions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold mt-0.5">•</span>
              <span>All chat messages and conversations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold mt-0.5">•</span>
              <span>All uploaded files and resources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold mt-0.5">•</span>
              <span>All announcements and sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive font-bold mt-0.5">•</span>
              <span>Member enrollment and history</span>
            </li>
          </ul>

          <div>
            <label
              htmlFor="delete-confirm"
              className="block text-sm font-medium text-para mb-2"
            >
              Type the room name{" "}
              <span className="font-bold text-heading">{roomTitle}</span> to
              confirm:
            </label>
            <Input
              id="delete-confirm"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={roomTitle}
              autoComplete="off"
              aria-required="true"
              className={
                deleteConfirmText && deleteConfirmText !== roomTitle
                  ? "border-destructive"
                  : ""
              }
            />
            {deleteConfirmText && deleteConfirmText !== roomTitle && (
              <p className="text-xs text-destructive mt-1.5">
                Room name doesn&apos;t match. Please type exactly: {roomTitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleDelete}
              disabled={deleteConfirmText !== roomTitle}
              variant="destructive"
              className="flex-1"
              aria-label="Confirm delete room"
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </Button>
            <Button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText("");
              }}
              variant="outline"
              className="flex-1"
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

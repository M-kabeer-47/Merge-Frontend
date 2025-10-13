/**
 * ModeratorManager Component
 *
 * Displays current moderators with their permissions.
 * Allows adding, editing permissions, and removing moderators.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Check,
  X as CloseIcon,
  Megaphone,
  Users,
  FileText,
  GraduationCap,
  Video,
  FolderOpen,
} from "lucide-react";
import type { Moderator, ModeratorPermissions } from "@/types/room-settings";

interface ModeratorManagerProps {
  moderators: Moderator[];
  onAddModerator: (userId: string, permissions: ModeratorPermissions) => void;
  onUpdatePermissions: (
    moderatorId: string,
    permissions: ModeratorPermissions
  ) => void;
  onRemoveModerator: (moderatorId: string) => void;
}

const permissionLabels = [
  {
    key: "canPostAnnouncements" as keyof ModeratorPermissions,
    label: "Post announcements",
    icon: Megaphone,
  },
  {
    key: "canManageMembers" as keyof ModeratorPermissions,
    label: "Add/remove members",
    icon: Users,
  },
  {
    key: "canPostAssignments" as keyof ModeratorPermissions,
    label: "Post assignments & quizzes",
    icon: FileText,
  },
  {
    key: "canGradeAssignments" as keyof ModeratorPermissions,
    label: "Grade assignments & quizzes",
    icon: GraduationCap,
  },
  {
    key: "canStartSessions" as keyof ModeratorPermissions,
    label: "Start live sessions",
    icon: Video,
  },
  {
    key: "canManageFiles" as keyof ModeratorPermissions,
    label: "Add/remove files in content",
    icon: FolderOpen,
  },
];

export default function ModeratorManager({
  moderators,
  onAddModerator,
  onUpdatePermissions,
  onRemoveModerator,
}: ModeratorManagerProps) {
  const [editingModerator, setEditingModerator] = useState<Moderator | null>(
    null
  );
  const [editPermissions, setEditPermissions] =
    useState<ModeratorPermissions | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [moderatorToRemove, setModeratorToRemove] = useState<Moderator | null>(
    null
  );

  const handleEditClick = (moderator: Moderator) => {
    setEditingModerator(moderator);
    setEditPermissions({ ...moderator.permissions });
  };

  const handleSavePermissions = () => {
    if (editingModerator && editPermissions) {
      onUpdatePermissions(editingModerator.id, editPermissions);
      // TODO: Integrate with backend API
      // Example: await updateModeratorPermissions(editingModerator.id, editPermissions);
      setEditingModerator(null);
      setEditPermissions(null);
    }
  };

  const handleRemoveClick = (moderator: Moderator) => {
    setModeratorToRemove(moderator);
    setShowRemoveConfirm(true);
  };

  const confirmRemove = () => {
    if (moderatorToRemove) {
      onRemoveModerator(moderatorToRemove.id);
      // TODO: Integrate with backend API and add audit logging
      // Example: await removeModerator(moderatorToRemove.id);
      // Example: logAuditEvent('moderator_removed', { moderatorId: moderatorToRemove.id });
    }
    setShowRemoveConfirm(false);
    setModeratorToRemove(null);
  };

  const togglePermission = (key: keyof ModeratorPermissions) => {
    if (editPermissions) {
      setEditPermissions({
        ...editPermissions,
        [key]: !editPermissions[key],
      });
    }
  };

  const getPermissionSummary = (permissions: ModeratorPermissions): string => {
    const enabled = Object.values(permissions).filter(Boolean).length;
    const total = Object.keys(permissions).length;
    return `${enabled}/${total} permissions`;
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Moderators & Permissions
            </h3>
            <p className="text-sm text-para-muted mt-1">
              Manage moderators and their granular permissions
            </p>
          </div>
          <Button
            onClick={() => {
              /* TODO: Open add moderator modal */
            }}
            size="sm"
            className="w-[150px]"
            aria-label="Add new moderator"
          >
            <Plus className="w-4 h-4" />
            Add Moderator
          </Button>
        </div>

        {moderators.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-para-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-para-muted">
              No moderators assigned yet
            </p>
            <p className="text-xs text-para-muted mt-1">
              Add moderators to help manage this room
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {moderators.map((moderator) => (
              <div
                key={moderator.id}
                className="p-4 border border-light-border rounded-lg hover:border-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Moderator Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar profileImage={moderator.avatar} size="md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-heading text-sm">
                        {moderator.name}
                      </h4>
                      <p className="text-xs text-para-muted truncate">
                        {moderator.email}
                      </p>
                      <p className="text-xs text-secondary mt-1">
                        {getPermissionSummary(moderator.permissions)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleEditClick(moderator)}
                      variant="outline"
                      size="sm"
                      className="w-[100px]"
                      aria-label={`Edit permissions for ${moderator.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleRemoveClick(moderator)}
                      variant="destructive"
                      size="sm"
                      className="w-[100px]"
                      aria-label={`Remove ${moderator.name} as moderator`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </Button>
                  </div>
                </div>

                {/* Permission Pills */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-light-border">
                  {permissionLabels.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                        moderator.permissions[key]
                          ? "bg-secondary/10 text-primary"
                          : "bg-background text-para-muted line-through"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Permissions Modal */}
      {editingModerator && editPermissions && (
        <Modal
          isOpen={!!editingModerator}
          onClose={() => {
            setEditingModerator(null);
            setEditPermissions(null);
          }}
          title={`Edit Permissions: ${editingModerator.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-para-muted">
              Toggle individual permissions for this moderator. Changes are
              saved immediately.
            </p>

            <div className="space-y-2">
              {permissionLabels.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => togglePermission(key)}
                  className="w-full flex items-center justify-between p-3 border-2 border-light-border rounded-lg hover:border-secondary/30 transition-colors text-left"
                  role="checkbox"
                  aria-checked={editPermissions[key]}
                  aria-label={`Toggle ${label} permission`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        editPermissions[key]
                          ? "bg-secondary/10 text-primary"
                          : "bg-main-background text-para-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-para font-medium">
                      {label}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      editPermissions[key]
                        ? "bg-primary border-main-background"
                        : "border-light-border"
                    }`}
                  >
                    {editPermissions[key] && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={() => {
                  setEditingModerator(null);
                  setEditPermissions(null);
                }}
                variant="outline"
                className="flex-1"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePermissions}
                className="flex-1"
                aria-label="Save permission changes"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Remove Moderator Confirmation */}
      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setModeratorToRemove(null);
        }}
        title="Remove Moderator"
        maxWidth="md"
      >
        {moderatorToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-para">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-heading">
                {moderatorToRemove.name}
              </span>{" "}
              as a moderator? They will lose all moderator permissions.
            </p>

            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-para-muted">
                This action can be reversed by re-adding them as a moderator.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={confirmRemove}
                variant="destructive"
                className="flex-1"
                aria-label="Confirm remove moderator"
              >
                Remove Moderator
              </Button>
              <Button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setModeratorToRemove(null);
                }}
                variant="outline"
                className="flex-1"
                aria-label="Cancel removal"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

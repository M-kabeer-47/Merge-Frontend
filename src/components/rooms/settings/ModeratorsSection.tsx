/**
 * ModeratorsSection Component
 *
 * Main container that composes moderator management functionality.
 * Uses separate components for each responsibility.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Plus } from "lucide-react";
import type { RoomMember } from "@/types/room-settings";

import ModeratorCard from "./moderators/ModeratorCard";
import AddModeratorModal from "./moderators/AddModeratorModal";
import RemoveModeratorModal from "./moderators/RemoveModeratorModal";

interface ModeratorsSectionProps {
  moderators: RoomMember[];
  members: RoomMember[];
  isUpdating: boolean;
  onPromoteMember: (memberId: string) => Promise<void>;
  onDemoteModerator: (moderatorId: string) => Promise<void>;
}

export default function ModeratorsSection({
  moderators,
  members,
  isUpdating,
  onPromoteMember,
  onDemoteModerator,
}: ModeratorsSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState<RoomMember | null>(
    null
  );

  // Filter out moderators from the eligible members list
  const moderatorIds = new Set(moderators.map((m) => m.id));
  console.log("Moderators:", moderators);
  console.log("Members: ", members);
  const eligibleMembers = members.filter((m) => !moderatorIds.has(m.id));
  console.log(eligibleMembers);

  const handleRemoveClick = (moderator: RoomMember) => {
    setSelectedModerator(moderator);
    setShowRemoveModal(true);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedModerator) return;
    await onDemoteModerator(selectedModerator.id);
    setSelectedModerator(null);
  };

  const handleRemoveModalClose = () => {
    setShowRemoveModal(false);
    setSelectedModerator(null);
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-raleway font-bold text-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Moderators
            </h3>
            <p className="text-xs sm:text-sm text-para-muted mt-1">
              Moderators can help manage this room
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="w-[15%]"
            aria-label="Add new moderator"
            disabled={eligibleMembers.length === 0}
          >
            <Plus className="w-4 h-4" />
            Add Moderator
          </Button>
        </div>

        {/* Moderators List */}
        {moderators.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-para-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-para-muted">
              No moderators assigned yet
            </p>
            <p className="text-xs text-para-muted mt-1">
              Add moderators to help manage this room
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {moderators.map((moderator) => (
              <ModeratorCard
                key={moderator.id}
                moderator={moderator}
                onRemove={() => handleRemoveClick(moderator)}
                isDisabled={isUpdating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Moderator Modal */}
      <AddModeratorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        eligibleMembers={eligibleMembers}
        onPromote={onPromoteMember}
      />

      {/* Remove Moderator Modal */}
      <RemoveModeratorModal
        isOpen={showRemoveModal}
        onClose={handleRemoveModalClose}
        moderator={selectedModerator}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
}

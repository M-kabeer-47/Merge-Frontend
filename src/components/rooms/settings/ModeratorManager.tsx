"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import {
  Shield,
  Trash2,
  Users,
  Plus,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { RoomMember } from "@/server-api/room-members";
import type { User } from "@/types/user";

interface ModeratorManagerProps {
  moderators: User[]; // From room.moderators
  availableMembers: RoomMember[]; // From members API
  onAddModerator: (memberId: string) => Promise<void>;
  onRemoveModerator: (moderatorUserId: string) => Promise<void>;
  isUpdating?: boolean;
}

const MEMBERS_PER_PAGE = 5;

export default function ModeratorManager({
  moderators,
  availableMembers,
  onAddModerator,
  onRemoveModerator,
  isUpdating,
}: ModeratorManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [moderatorToRemove, setModeratorToRemove] = useState<User | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Search and pagination state for Add Moderator modal
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter members by search query
  const filteredMembers = useMemo(() => {
    if (!availableMembers) return [];
    if (!searchQuery.trim()) return availableMembers;
    const query = searchQuery.toLowerCase();
    return availableMembers.filter(
      (member) =>
        `${member.user.firstName} ${member.user.lastName}`
          .toLowerCase()
          .includes(query) || member.user.email.toLowerCase().includes(query),
    );
  }, [availableMembers, searchQuery]);

  // Paginate filtered members
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);

  // Reset pagination when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSelectedMemberId(null); // Clear selection on search
  };

  // Reset modal state when closing
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedMemberId(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRemoveClick = (moderator: User) => {
    setModeratorToRemove(moderator);
    setShowRemoveConfirm(true);
  };

  const confirmRemove = async () => {
    if (moderatorToRemove) {
      await onRemoveModerator(moderatorToRemove.id);
      // Only close modal after successful API call
      setShowRemoveConfirm(false);
      setModeratorToRemove(null);
    }
  };

  const handleAddModerator = async () => {
    if (selectedMemberId) {
      await onAddModerator(selectedMemberId);
      // Only close modal after successful API call
      handleCloseAddModal();
    }
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Moderators
            </h3>
            <p className="text-sm text-para-muted mt-1">
              Moderators help manage this room
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="w-[150px]"
            disabled={availableMembers.length === 0}
            aria-label="Add new moderator"
          >
            <Plus className="w-4 h-4" />
            Add Moderator
          </Button>
        </div>

        {moderators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-para-muted mx-auto mb-3 opacity-50" />
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
                <div className="flex items-center justify-between gap-4">
                  {/* Moderator Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar
                      profileImage={moderator.image || undefined}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-heading text-sm">
                        {moderator.firstName} {moderator.lastName}
                      </h4>
                      <p className="text-xs text-para-muted truncate">
                        {moderator.email}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    onClick={() => handleRemoveClick(moderator)}
                    variant="destructive"
                    size="sm"
                    className="w-[120px]"
                    disabled={isUpdating}
                    aria-label={`Remove ${moderator.firstName} as moderator`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Moderator Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title="Add Moderator"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Member Count */}
          <p className="text-xs text-para-muted">
            {filteredMembers.length} member
            {filteredMembers.length !== 1 ? "s" : ""} available
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Members List */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-para-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm text-para-muted">
                {searchQuery
                  ? "No members match your search"
                  : "No members available to add as moderators"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {paginatedMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-colors text-left flex items-center gap-3 ${
                      selectedMemberId === member.id
                        ? "border-primary bg-primary/5"
                        : "border-light-border hover:border-secondary/30"
                    }`}
                  >
                    <Avatar
                      profileImage={member.user.image || undefined}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                      <p className="text-xs text-para-muted truncate">
                        {member.user.email}
                      </p>
                    </div>
                    {selectedMemberId === member.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-para-muted">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-light-border">
            <Button
              onClick={handleCloseAddModal}
              variant="outline"
              className="flex-1"
              aria-label="Cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddModerator}
              className="flex-1"
              disabled={!selectedMemberId || isUpdating}
              aria-label="Confirm add moderator"
            >
              {isUpdating ? "Adding..." : "Add as Moderator"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Moderator Confirmation */}
      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setModeratorToRemove(null);
        }}
        title="Demote Moderator"
        maxWidth="md"
      >
        {moderatorToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-para">
              Are you sure you want to demote{" "}
              <span className="font-semibold text-heading">
                {moderatorToRemove.firstName} {moderatorToRemove.lastName}
              </span>{" "}
              to a regular member? They will lose all moderator permissions.
            </p>

            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-para-muted">
                This action can be reversed by promoting them again.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setModeratorToRemove(null);
                }}
                variant="outline"
                className="flex-1"
                aria-label="Cancel demotion"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRemove}
                variant="destructive"
                className="flex-1"
                disabled={isUpdating}
                aria-label="Confirm demote moderator"
              >
                {isUpdating ? "Demoting..." : "Demote to Member"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/**
 * MembersTable Component
 * 
 * Displays room members with search, pagination, and member management actions.
 * Supports mute, remove, and promote to moderator operations.
 */

"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  Search,
  MoreVertical,
  VolumeX,
  Trash2,
  ShieldPlus,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import type { RoomMember, ModeratorPermissions } from "@/types/room-settings";

interface MembersTableProps {
  members: RoomMember[];
  onMuteMember: (memberId: string, duration: number) => void;
  onRemoveMember: (memberId: string) => void;
  onPromoteToModerator: (memberId: string, permissions: ModeratorPermissions) => void;
}

const ITEMS_PER_PAGE = 10;

export default function MembersTable({
  members,
  onMuteMember,
  onRemoveMember,
  onPromoteToModerator,
}: MembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<RoomMember | null>(null);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [memberToMute, setMemberToMute] = useState<RoomMember | null>(null);

  // Filter and paginate members
  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const handleSelectMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === paginatedMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(paginatedMembers.map((m) => m.id)));
    }
  };

  const handleMuteClick = (member: RoomMember) => {
    setMemberToMute(member);
    setShowMuteModal(true);
    setActionMenuOpen(null);
  };

  const handleRemoveClick = (member: RoomMember) => {
    setMemberToRemove(member);
    setShowRemoveConfirm(true);
    setActionMenuOpen(null);
  };

  const confirmRemove = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.id);
      // TODO: Integrate with backend API
      // Example: await removeMember(memberToRemove.id);
    }
    setShowRemoveConfirm(false);
    setMemberToRemove(null);
  };

  const handleBulkRemove = () => {
    // TODO: Implement bulk remove with confirmation
    console.log("Bulk remove:", Array.from(selectedMembers));
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Members Management
            </h3>
            <p className="text-sm text-para-muted mt-1">
              {members.length} total members
            </p>
          </div>
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search members by name or email"
              className="pl-10"
              aria-label="Search members"
            />
          </div>
          {selectedMembers.size > 0 && (
            <Button
              onClick={handleBulkRemove}
              variant="destructive"
              size="sm"
              aria-label={`Remove ${selectedMembers.size} selected members`}
            >
              <Trash2 className="w-4 h-4" />
              Remove ({selectedMembers.size})
            </Button>
          )}
        </div>

        {/* Members Table */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-para-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-para-muted">
              {searchQuery ? "No members found matching your search" : "No members yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="border border-light-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/5 border-b border-light-border">
                  <tr>
                    <th className="p-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={
                          paginatedMembers.length > 0 &&
                          selectedMembers.size === paginatedMembers.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-light-border text-primary focus:ring-2 focus:ring-primary"
                        aria-label="Select all members"
                      />
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Member
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Role
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Status
                    </th>
                    <th className="p-3 text-right text-xs font-semibold text-para uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border">
                  {paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-secondary/5 transition-colors"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.has(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="w-4 h-4 rounded border-light-border text-primary focus:ring-2 focus:ring-primary"
                          aria-label={`Select ${member.name}`}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar profileImage={member.avatar} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-heading">
                              {member.name}
                            </p>
                            <p className="text-xs text-para-muted">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full capitalize">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-para">
                          {format(member.joinedAt, "MMM d, yyyy")}
                        </p>
                      </td>
                      <td className="p-3">
                        {member.isMuted ? (
                          <span className="flex items-center gap-1 text-xs text-destructive">
                            <VolumeX className="w-3 h-3" />
                            Muted
                          </span>
                        ) : (
                          <span className="text-xs text-success">Active</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2 relative">
                          <button
                            onClick={() =>
                              setActionMenuOpen(
                                actionMenuOpen === member.id ? null : member.id
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors"
                            aria-label={`Open actions menu for ${member.name}`}
                          >
                            <MoreVertical className="w-4 h-4 text-para" />
                          </button>

                          {/* Action Menu Dropdown */}
                          {actionMenuOpen === member.id && (
                            <div className="absolute right-0 top-full mt-1 z-10 bg-main-background border border-light-border rounded-lg shadow-lg py-1 min-w-[180px]">
                              <button
                                onClick={() => handleMuteClick(member)}
                                className="w-full px-4 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                              >
                                <VolumeX className="w-4 h-4" />
                                Mute Member
                              </button>
                              <button
                                onClick={() => {
                                  // TODO: Open promote to moderator modal
                                  setActionMenuOpen(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                              >
                                <ShieldPlus className="w-4 h-4" />
                                Promote to Moderator
                              </button>
                              <div className="h-px bg-light-border my-1" />
                              <button
                                onClick={() => handleRemoveClick(member)}
                                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove Member
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-para-muted">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredMembers.length)} of{" "}
                  {filteredMembers.length} members
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-para px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mute Member Modal */}
      {showMuteModal && memberToMute && (
        <Modal
          isOpen={showMuteModal}
          onClose={() => {
            setShowMuteModal(false);
            setMemberToMute(null);
          }}
          title={`Mute ${memberToMute.name}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-para">
              Muting will disable posting and live mic/chat for the selected duration.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "10 minutes", value: 10 },
                { label: "30 minutes", value: 30 },
                { label: "1 hour", value: 60 },
                { label: "6 hours", value: 360 },
                { label: "24 hours", value: 1440 },
                { label: "1 week", value: 10080 },
              ].map((option) => (
                <Button
                  key={option.value}
                  onClick={() => {
                    onMuteMember(memberToMute.id, option.value);
                    // TODO: Integrate with backend API
                    setShowMuteModal(false);
                    setMemberToMute(null);
                  }}
                  variant="outline"
                  className="h-auto py-3"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button
              onClick={() => {
                setShowMuteModal(false);
                setMemberToMute(null);
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {/* Remove Member Confirmation */}
      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setMemberToRemove(null);
        }}
        title="Remove Member"
        maxWidth="md"
      >
        {memberToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-para">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-heading">{memberToRemove.name}</span>{" "}
              from this room? They will lose access to all content and conversations.
            </p>

            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-xs text-para">
                This action can be reversed by re-inviting them to the room.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={confirmRemove}
                variant="destructive"
                className="flex-1"
                aria-label="Confirm remove member"
              >
                Remove Member
              </Button>
              <Button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setMemberToRemove(null);
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

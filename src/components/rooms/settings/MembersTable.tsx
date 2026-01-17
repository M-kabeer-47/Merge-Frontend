/**
 * MembersTable Component
 *
 * Displays room members with search, pagination, and remove member action.
 * Uses real API data from server-side fetch.
 */

"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  UserMinus,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import type { RoomMember } from "@/server-api/room-members";

interface MembersTableProps {
  members: RoomMember[];
  onRemoveMember: (memberId: string) => Promise<void>;
  isRemoving?: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function MembersTable({
  members,
  onRemoveMember,
  isRemoving,
}: MembersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<RoomMember | null>(null);

  // Filter and paginate members
  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        `${member.user.firstName} ${member.user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  const handleRemoveClick = (member: RoomMember) => {
    setMemberToRemove(member);
    setShowRemoveConfirm(true);
  };

  const confirmRemove = async () => {
    if (memberToRemove) {
      await onRemoveMember(memberToRemove.id);
      // Only close modal after successful API call
      setShowRemoveConfirm(false);
      setMemberToRemove(null);
    }
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Members
            </h3>
            <p className="text-sm text-para-muted mt-1">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
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
        </div>

        {/* Members Table */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-para-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm text-para-muted">
              {searchQuery
                ? "No members found matching your search"
                : "No members yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="border border-light-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/5 border-b border-light-border">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Member
                    </th>
                    <th className="p-3 text-left text-xs font-semibold text-para uppercase tracking-wider">
                      Joined
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
                        <div className="flex items-center gap-3">
                          <Avatar
                            profileImage={member.user.image || undefined}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium text-heading">
                              {member.user.firstName} {member.user.lastName}
                            </p>
                            <p className="text-xs text-para-muted">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-para">
                          {format(new Date(member.joinedAt), "MMM d, yyyy")}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end">
                          <Button
                            onClick={() => handleRemoveClick(member)}
                            variant="destructive"
                            size="sm"
                            disabled={isRemoving}
                            aria-label={`Remove ${member.user.firstName} from room`}
                          >
                            <UserMinus className="w-4 h-4" />
                            Remove
                          </Button>
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
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredMembers.length,
                  )}{" "}
                  of {filteredMembers.length} members
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
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
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

      {/* Remove Member Confirmation Modal */}
      <Modal
        isOpen={showRemoveConfirm}
        onClose={() => {
          if (!isRemoving) {
            setShowRemoveConfirm(false);
            setMemberToRemove(null);
          }
        }}
        title="Remove Member"
        icon={
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
        }
        maxWidth="md"
      >
        {memberToRemove && (
          <div className="space-y-4">
            <p className="text-sm text-para">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-heading">
                {memberToRemove.user.firstName} {memberToRemove.user.lastName}
              </span>{" "}
              from this room? They will lose access to all room content.
            </p>

            <div className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-para-muted">
                They can rejoin the room later if it's public or by invitation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setMemberToRemove(null);
                }}
                variant="outline"
                className="flex-1"
                disabled={isRemoving}
                aria-label="Cancel removal"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRemove}
                variant="destructive"
                className="flex-1"
                disabled={isRemoving}
                aria-label="Confirm remove member"
              >
                {isRemoving ? "Removing..." : "Remove Member"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

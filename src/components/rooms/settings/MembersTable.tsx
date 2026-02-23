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
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  UserMinus,
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
    if (!members) return [];
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
              {members?.length || 0} member{members?.length !== 1 ? "s" : ""}
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
                      Role
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
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            member.role === "moderator"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-para"
                          }`}
                        >
                          {member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)}
                        </span>
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

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        onClose={() => {
          if (!isRemoving) {
            setShowRemoveConfirm(false);
            setMemberToRemove(null);
          }
        }}
        onConfirm={confirmRemove}
        title="Remove Member"
        message="Are you sure you want to remove this member from the room? They will lose access to all room content."
        itemName={
          memberToRemove
            ? `${memberToRemove.user.firstName} ${memberToRemove.user.lastName}`
            : undefined
        }
        confirmText="Remove Member"
        isLoading={isRemoving}
        variant="danger"
      />
    </>
  );
}

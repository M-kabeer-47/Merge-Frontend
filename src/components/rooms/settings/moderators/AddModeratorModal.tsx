"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import { Search, Plus, Loader2 } from "lucide-react";
import type { RoomMember } from "@/types/room-settings";

interface AddModeratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleMembers: RoomMember[];
  onPromote: (memberId: string) => Promise<void>;
}

export default function AddModeratorModal({
  isOpen,
  onClose,
  eligibleMembers,
  onPromote,
}: AddModeratorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // Filter by search query
  const filteredMembers = eligibleMembers.filter((member) => {
    const fullName = member.name.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePromote = async (memberId: string) => {
    setPromotingId(memberId);
    try {
      await onPromote(memberId);
      handleClose();
    } finally {
      setPromotingId(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Moderator"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-para-muted">
          Select a member to promote to moderator. Moderators can help manage
          room content and members.
        </p>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-light-border rounded-lg text-sm text-para placeholder-para-muted focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Members List */}
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-para-muted">
                {searchQuery
                  ? "No members match your search"
                  : "All members are already moderators"}
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handlePromote(member.id)}
                disabled={promotingId !== null}
                className="w-full flex items-center justify-between p-3 border border-light-border rounded-lg hover:border-secondary/30 hover:bg-secondary/5 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Avatar profileImage={member.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-heading">
                      {member.name}
                    </p>
                    <p className="text-xs text-para-muted">{member.email}</p>
                  </div>
                </div>
                {promotingId === member.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Plus className="w-4 h-4 text-primary" />
                )}
              </button>
            ))
          )}
        </div>

        <Button onClick={handleClose} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

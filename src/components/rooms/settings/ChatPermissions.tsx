/**
 * ChatPermissions Component
 *
 * Controls who can post in the room's general chat.
 * Options: instructors-only, selected-members, everyone.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Modal from "@/components/ui/Modal";
import {
  MessageSquare,
  Shield,
  Users,
  CheckCircle2,
  X as CloseIcon,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { ChatPermissionLevel, RoomMember } from "@/types/room-settings";

interface ChatPermissionsProps {
  currentLevel: ChatPermissionLevel;
  selectedMemberIds: string[];
  allMembers: RoomMember[];
  onUpdatePermissions: (
    level: ChatPermissionLevel,
    memberIds?: string[]
  ) => void;
}

export default function ChatPermissions({
  currentLevel,
  selectedMemberIds,
  allMembers,
  onUpdatePermissions,
}: ChatPermissionsProps) {
  const [level, setLevel] = useState<ChatPermissionLevel>(currentLevel);
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMemberIds);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleLevelChange = (newLevel: ChatPermissionLevel) => {
    setLevel(newLevel);
    setHasChanges(true);

    if (newLevel === "selected-members" && selectedIds.length === 0) {
      setShowMemberSelector(true);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    const newSelected = selectedIds.includes(memberId)
      ? selectedIds.filter((id) => id !== memberId)
      : [...selectedIds, memberId];
    setSelectedIds(newSelected);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdatePermissions(
      level,
      level === "selected-members" ? selectedIds : undefined
    );
    // TODO: Integrate with backend API
    // Example: await updateChatPermissions(roomId, level, selectedIds);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setLevel(currentLevel);
    setSelectedIds(selectedMemberIds);
    setHasChanges(false);
  };

  const selectedMembers = allMembers.filter((m) => selectedIds.includes(m.id));
  const filteredMembers = allMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-main-background border border-light-border rounded-xl p-6">
        <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-primary" />
          Chat Permissions
        </h3>
        <p className="text-sm text-para-muted mb-6">
          Control who can post messages in the general chat
        </p>

        <div className="space-y-3">
          {/* Instructors Only */}
          <button
            onClick={() => handleLevelChange("instructors-only")}
            className={`w-full p-4 rounded-lg border-1 transition-all text-left ${
              level === "instructors-only"
                ? "border-secondary bg-secondary/5"
                : "border-light-border hover:border-secondary/30"
            }`}
            role="radio"
            aria-checked={level === "instructors-only"}
            aria-label="Allow only instructors and moderators to post"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  level === "instructors-only"
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-heading text-sm">
                  Instructor & Moderators Only
                </h5>
                <p className="text-xs text-para-muted mt-1">
                  Only instructors and moderators can post in the chat. Members
                  can only read messages.
                </p>
              </div>
            </div>
          </button>

          {/* Selected Members */}
          <button
            onClick={() => handleLevelChange("selected-members")}
            className={`w-full p-4 rounded-lg border-1 transition-all text-left ${
              level === "selected-members"
                ? "border-secondary bg-secondary/5"
                : "border-light-border hover:border-secondary/30"
            }`}
            role="radio"
            aria-checked={level === "selected-members"}
            aria-label="Allow selected members to post"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  level === "selected-members"
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-heading text-sm">
                  Instructor, Moderators & Selected Members
                </h5>
                <p className="text-xs text-para-muted mt-1">
                  Choose specific members who can post in addition to
                  instructors and moderators.
                </p>
              </div>
            </div>
          </button>

          {/* Show Selected Members */}
          {level === "selected-members" && selectedMembers.length > 0 && (
            <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-para">
                  {selectedMembers.length} selected member(s)
                </p>
                <Button
                  onClick={() => setShowMemberSelector(true)}
                  variant="outline"
                  size="sm"
                  className="w-[90px]"
                  aria-label="Edit selected members"
                >
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 border border-light-border rounded-full"
                  >
                    <Avatar profileImage={member.avatar} size="sm" />
                    <span className="text-xs text-primary">{member.name}</span>
                  </div>
                ))}
                {selectedMembers.length > 5 && (
                  <span className="text-xs text-para-muted px-2 py-1">
                    +{selectedMembers.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Select Members Button (if none selected) */}
          {level === "selected-members" && selectedMembers.length === 0 && (
            <div className="">
              <Button
                onClick={() => setShowMemberSelector(true)}
                variant="outline"
                size="sm"
                aria-label="Select members"
                className="w-[150px]"
              >
                <Users className="w-4 h-4" />
                Select Members
              </Button>
            </div>
          )}

          {/* Everyone */}
          <button
            onClick={() => handleLevelChange("everyone")}
            className={`w-full p-4 rounded-lg border-1 transition-all text-left ${
              level === "everyone"
                ? "border-secondary bg-secondary/5"
                : "border-light-border hover:border-secondary/30"
            }`}
            role="radio"
            aria-checked={level === "everyone"}
            aria-label="Allow all members to post"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  level === "everyone"
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-heading text-sm">Everyone</h5>
                <p className="text-xs text-para-muted mt-1">
                  All members can post and participate in the general chat.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-light-border">
            <Button
              onClick={handleCancel}
              variant="outline"
              aria-label="Cancel changes"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="w-28"
              aria-label="Save changes"
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Member Selector Modal */}
      <Modal
        isOpen={showMemberSelector}
        onClose={() => {
          setShowMemberSelector(false);
          setSearchQuery("");
        }}
        title="Select Members"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-para-muted">
            Choose which members can post in the general chat (in addition to
            instructors and moderators).
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-para-muted" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members"
              className="pl-10"
              aria-label="Search members"
            />
          </div>

          {/* Member List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => toggleMemberSelection(member.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedIds.includes(member.id)
                    ? "border-primary bg-secondary/5"
                    : "border-light-border hover:border-secondary/30"
                }`}
              >
                <Avatar profileImage={member.avatar} size="sm" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-heading">
                    {member.name}
                  </p>
                  <p className="text-xs text-para-muted">{member.email}</p>
                </div>
                {selectedIds.includes(member.id) && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-light-border">
            <p className="text-sm text-para-muted">
              {selectedIds.length} member(s) selected
            </p>
            <Button
              onClick={() => {
                setShowMemberSelector(false);
                setSearchQuery("");
              }}
              aria-label="Done selecting members"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

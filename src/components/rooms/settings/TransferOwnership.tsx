"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { UserCog, AlertTriangle, Search, ChevronRight } from "lucide-react";
import type { RoomMember } from "@/types/room-settings";

interface TransferOwnershipProps {
  currentOwnerId: string;
  currentOwnerName: string;
  members: RoomMember[];
  onTransferOwnership: (newOwnerId: string) => void;
}

export default function TransferOwnership({
  currentOwnerId,
  currentOwnerName,
  members,
  onTransferOwnership,
}: TransferOwnershipProps) {
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectMember = (member: RoomMember) => {
    setSelectedMember(member);
    setShowMemberSelector(false);
    setShowConfirmModal(true);
  };

  const handleConfirmTransfer = () => {
    if (confirmationText === "TRANSFER" && selectedMember) {
      onTransferOwnership(selectedMember.id);
      // TODO: Integrate with backend API and add audit logging
      // Example: await transferOwnership(roomId, selectedMember.id);
      // Example: logAuditEvent('ownership_transferred', { newOwnerId: selectedMember.id });

      setShowConfirmModal(false);
      setSelectedMember(null);
      setConfirmationText("");
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.id !== currentOwnerId &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div className="bg-main-background border border-accent/30 rounded-xl p-6">
        <h3 className="text-xl font-raleway font-bold text-heading flex items-center gap-2 mb-1">
          <UserCog className="w-5 h-5 text-accent" />
          Transfer Ownership
        </h3>
        <p className="text-sm text-para-muted mb-6">
          Transfer complete control of this room to another member
        </p>

        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-para font-medium mb-2">
                Important consequences:
              </p>
              <ul className="space-y-1.5 text-xs text-para-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <span>
                    You will lose instructor privileges and become a regular
                    member
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <span>
                    The new owner will have full control over all room settings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <span>
                    Only the new owner can transfer ownership again or delete
                    the room
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <span>
                    This action is irreversible without the new owner&apos;s
                    consent
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/5 border border-light-border rounded-lg mb-4">
          <div>
            <p className="text-xs text-para-muted mb-1">Current Owner</p>
            <p className="text-sm font-semibold text-heading">
              {currentOwnerName}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-para-muted" />
          <div>
            <p className="text-xs text-para-muted mb-1">New Owner</p>
            {selectedMember ? (
              <div className="flex items-center gap-2">
                <Avatar profileImage={selectedMember.avatar} size="sm" />
                <p className="text-sm font-semibold text-heading">
                  {selectedMember.name}
                </p>
              </div>
            ) : (
              <p className="text-sm text-para-muted">Not selected</p>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Button
            onClick={() => setShowMemberSelector(true)}
            className="w-[180px]"
            aria-label="Select new owner"
          >
            <UserCog className="w-4 h-4" />
            {selectedMember ? "Change Selection" : "Select New Owner"}
          </Button>
        </div>
      </div>

      {/* Member Selector Modal */}
      <Modal
        isOpen={showMemberSelector}
        onClose={() => {
          setShowMemberSelector(false);
          setSearchQuery("");
        }}
        title="Select New Owner"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-para-muted">
            Choose a member to transfer ownership to. They must be a current
            member of this room.
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
            {filteredMembers.length === 0 ? (
              <p className="text-center text-sm text-para-muted py-8">
                No members found
              </p>
            ) : (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="w-full p-3 rounded-lg border-2 border-light-border hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-3"
                >
                  <Avatar profileImage={member.avatar} size="md" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-heading">
                      {member.name}
                    </p>
                    <p className="text-xs text-para-muted">{member.email}</p>
                    <p className="text-xs text-secondary mt-0.5 capitalize">
                      {member.role}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-para-muted" />
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedMember(null);
          setConfirmationText("");
        }}
        title="Confirm Ownership Transfer"
        maxWidth="md"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-heading mb-2">
                    This is a critical action!
                  </p>
                  <p className="text-sm text-para">
                    You are about to transfer full ownership of this room to{" "}
                    <span className="font-semibold">{selectedMember.name}</span>
                    . You will lose all instructor privileges.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="transfer-confirm"
                className="block text-sm font-medium text-para mb-2"
              >
                Type <span className="font-bold text-heading">TRANSFER</span> to
                confirm:
              </label>
              <Input
                id="transfer-confirm"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type TRANSFER"
                autoComplete="off"
                aria-required="true"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleConfirmTransfer}
                disabled={confirmationText !== "TRANSFER"}
                variant="destructive"
                className="flex-1"
                aria-label="Confirm transfer ownership"
              >
                Transfer Ownership
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedMember(null);
                  setConfirmationText("");
                }}
                variant="outline"
                className="flex-1"
                aria-label="Cancel transfer"
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

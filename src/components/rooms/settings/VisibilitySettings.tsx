/**
 * VisibilitySettings Component
 * 
 * Controls room visibility (private/public) and join policy (auto/request).
 * Shows confirmation modal when changing visibility to public.
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Globe, Lock, UserPlus, UserCheck, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { RoomVisibility, JoinPolicy } from "@/types/room-settings";

interface VisibilitySettingsProps {
  currentVisibility: RoomVisibility;
  currentJoinPolicy: JoinPolicy;
  onVisibilityChange: (newVisibility: RoomVisibility) => void;
  onJoinPolicyChange: (newPolicy: JoinPolicy) => void;
}

export default function VisibilitySettings({
  currentVisibility,
  currentJoinPolicy,
  onVisibilityChange,
  onJoinPolicyChange,
}: VisibilitySettingsProps) {
  const [selectedVisibility, setSelectedVisibility] = useState(currentVisibility);
  const [selectedJoinPolicy, setSelectedJoinPolicy] = useState(currentJoinPolicy);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<RoomVisibility | null>(null);

  const handleVisibilityClick = (visibility: RoomVisibility) => {
    if (visibility === "public" && currentVisibility === "private") {
      // Show confirmation modal
      setPendingVisibility(visibility);
      setShowConfirmModal(true);
    } else {
      setSelectedVisibility(visibility);
      onVisibilityChange(visibility);
      // TODO: Integrate with backend API
      // Example: await updateRoomVisibility(roomId, visibility);
    }
  };

  const confirmVisibilityChange = () => {
    if (pendingVisibility) {
      setSelectedVisibility(pendingVisibility);
      onVisibilityChange(pendingVisibility);
      // TODO: Integrate with backend API
    }
    setShowConfirmModal(false);
    setPendingVisibility(null);
  };

  const handleJoinPolicyChange = (policy: JoinPolicy) => {
    setSelectedJoinPolicy(policy);
    onJoinPolicyChange(policy);
    // TODO: Integrate with backend API
    // Example: await updateJoinPolicy(roomId, policy);
  };

  return (
    <>
      <div className="bg-background border border-light-border rounded-xl p-6">
        <h3 className="text-xl font-raleway font-bold text-heading mb-1">
          Visibility & Join Policy
        </h3>
        <p className="text-sm text-para-muted mb-6">
          Control who can discover and join your room
        </p>

        {/* Visibility Options */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-para">Room Visibility</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Private Option */}
            <button
              onClick={() => handleVisibilityClick("private")}
              className={`p-4 rounded-lg border-1 transition-all text-left ${
                selectedVisibility === "private"
                  ? "border-secondary bg-secondary/5"
                  : "border-light-border hover:border-secondary/30"
              }`}
              role="radio"
              aria-checked={selectedVisibility === "private"}
              aria-label="Set room visibility to private"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedVisibility === "private" 
                    ? "bg-primary text-white" 
                    : "bg-secondary/10 text-secondary"
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-heading text-sm">Private</h5>
                  <p className="text-xs text-para-muted mt-1">
                    Only visible to members. Users must be invited.
                  </p>
                </div>
              </div>
            </button>

            {/* Public Option */}
            <button
              onClick={() => handleVisibilityClick("public")}
              className={`p-4 rounded-lg border-1 transition-all text-left ${
                selectedVisibility === "public"
                  ? "border-secondary bg-secondary/5"
                  : "border-light-border hover:border-secondary/30"
              }`}
              role="radio"
              aria-checked={selectedVisibility === "public"}
              aria-label="Set room visibility to public"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedVisibility === "public" 
                    ? "bg-primary text-white" 
                    : "bg-secondary/10 text-secondary"
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-heading text-sm">Public</h5>
                  <p className="text-xs text-para-muted mt-1">
                    Discoverable in search. Non-members can preview basic info.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Join Policy */}
        <div className="space-y-4 pt-6 border-t border-light-border">
          <h4 className="text-sm font-semibold text-para">Join Policy</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Request to Join */}
            <button
              onClick={() => handleJoinPolicyChange("request")}
              className={`p-4 rounded-lg border-1 transition-all text-left ${
                selectedJoinPolicy === "request"
                  ? "border-secondary bg-secondary/5"
                  : "border-light-border hover:border-secondary/30"
              }`}
              role="radio"
              aria-checked={selectedJoinPolicy === "request"}
              aria-label="Require approval for join requests"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedJoinPolicy === "request" 
                    ? "bg-primary text-white" 
                    : "bg-secondary/10 text-secondary"
                }`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-heading text-sm">Request to Join</h5>
                  <p className="text-xs text-para-muted mt-1">
                    Users must request access. Instructor/moderators approve.
                  </p>
                </div>
              </div>
            </button>

            {/* Auto Join */}
            <button
              onClick={() => handleJoinPolicyChange("auto")}
              className={`p-4 rounded-lg border-1 transition-all text-left ${
                selectedJoinPolicy === "auto"
                  ? "border-secondary bg-secondary/5"
                  : "border-light-border hover:border-secondary/30"
              }`}
              role="radio"
              aria-checked={selectedJoinPolicy === "auto"}
              aria-label="Allow automatic joining"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedJoinPolicy === "auto" 
                    ? "bg-primary text-white" 
                    : "bg-secondary/10 text-secondary"
                }`}>
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-heading text-sm">Auto-Join</h5>
                  <p className="text-xs text-para-muted mt-1">
                    Anyone can join immediately without approval.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Current State Summary */}
        <div className="mt-6 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
          <p className="text-sm text-para">
            <span className="font-semibold">Current configuration:</span> This room is{" "}
            <span className="font-semibold text-heading">
              {selectedVisibility === "public" ? "publicly discoverable" : "private"}
            </span>{" "}
            and uses{" "}
            <span className="font-semibold text-heading">
              {selectedJoinPolicy === "auto" ? "auto-join" : "request-to-join"}
            </span>{" "}
            policy.
          </p>
        </div>
      </div>

      {/* Confirmation Modal for Public Visibility */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingVisibility(null);
        }}
        title="Make Room Public?"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-para">
                Making this room public will have the following effects:
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-para ml-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Room will appear in public search and discovery feeds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Non-members can view room title, description, and tags</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>Members count and instructor info will be visible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>All content and conversations remain private to members</span>
            </li>
          </ul>

          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={confirmVisibilityChange}
              className="flex-1"
              aria-label="Confirm making room public"
            >
              Confirm & Make Public
            </Button>
            <Button
              onClick={() => {
                setShowConfirmModal(false);
                setPendingVisibility(null);
              }}
              variant="outline"
              className="flex-1"
              aria-label="Cancel visibility change"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

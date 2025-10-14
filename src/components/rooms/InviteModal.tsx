"use client";

import { useState } from "react";
import { X, Copy, Check, Users, Share2 } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  roomId,
  roomName,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate a 6-digit code (in production, this should come from backend)
  const inviteCode = "A7K9M2"; // Mock code - replace with actual API call

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      console.log("copyInviteCode", { code: inviteCode, roomId });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyLink = async () => {
    const inviteLink = `${window.location.origin}/rooms/join?code=${inviteCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      console.log("copyInviteLink", { link: inviteLink, roomId });
      // You can add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-background rounded-xl shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2
                  id="invite-modal-title"
                  className="text-xl font-semibold text-heading"
                >
                  Invite to Room
                </h2>
                <p className="text-sm text-para-muted">{roomName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-para" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Instructions */}

            {/* Invite Code Display */}
            <div>
              <label className="block text-sm font-medium text-heading mb-3">
                Room Invite Code
              </label>
              <div className="relative">
                <div className="bg-main-background border-2 border-primary/20 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-primary tracking-[0.5em] font-mono">
                    {inviteCode}
                  </div>
                  <p className="text-xs text-para-muted mt-2">
                    6-digit access code
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className={`
                    absolute top-3 right-3 px-2 py-1.5 rounded-lg text-xs font-medium
                    transition-all duration-200 flex items-center gap-2
                       bg-primary text-white hover:bg-primary/90
                  `}
                  aria-label={copied ? "Code copied" : "Copy code"}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-white" strokeWidth={2.5} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Options */}

            {/* Share Link Button */}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-light-border bg-secondary/5">
            <p className="text-xs text-para-muted text-center">
              Anyone with this code can request to join this room. Requests must
              be approved by the instructor.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

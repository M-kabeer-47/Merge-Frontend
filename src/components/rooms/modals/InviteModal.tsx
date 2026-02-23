"use client";

import { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import { useRoom } from "@/providers/RoomProvider";
import Modal from "@/components/ui/Modal";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

export default function InviteModal({
  isOpen,
  onClose,
  roomName,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const { room } = useRoom();

  const inviteCode = room?.roomCode || "";

  const handleCopyCode = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite to Room"
      description={roomName}
      icon={
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
      }
      maxWidth="md"
      footer={
        <div className="p-6 bg-secondary/5">
          <p className="text-xs text-para-muted text-center">
            Anyone with this code can request to join this room. Requests must
            be approved by the instructor.
          </p>
        </div>
      }
    >
      {/* Invite Code Display */}
      <div>
        <label className="block text-sm font-medium text-heading mb-3">
          Room Invite Code
        </label>
        <div className="relative">
          <div className="bg-main-background border-2 border-primary/20 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary tracking-[0.3em] font-mono">
              {inviteCode || "------"}
            </div>
            <p className="text-xs text-para-muted mt-2">
              Share this code with students
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            disabled={!inviteCode}
            className={`
              absolute top-3 right-3 px-2 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-200 flex items-center gap-2
              bg-primary text-white hover:bg-primary/90 disabled:opacity-50
            `}
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <>
                <Copy className="w-3 h-3 text-white" strokeWidth={2.5} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

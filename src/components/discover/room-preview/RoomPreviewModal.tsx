"use client";

import { UserPlus, Users, X } from "lucide-react";
import type { FeedRoom } from "@/types/discover";
import TagChip from "../TagChip";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import RoomDescriptionSection from "./RoomDescriptionSection";
import Avatar from "@/components/ui/Avatar";

interface RoomPreviewModalProps {
  room: FeedRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomCode: string) => void;
}

export default function RoomPreviewModal({
  room,
  isOpen,
  onClose,
  onJoin,
}: RoomPreviewModalProps) {
  if (!room) return null;

  const creatorName = `${room.admin.firstName} ${room.admin.lastName}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room.title}
      description={
        <div className="flex items-center gap-3 mt-1">
          <Avatar profileImage={room.admin.image} size="sm" />
          <div>
            <p className="text-sm font-semibold text-heading">
              {creatorName}
            </p>
            <p className="text-xs text-para-muted">Room Creator</p>
          </div>
        </div>
      }
      maxWidth="3xl"
      footer={
        <div className="flex items-center gap-3 p-6 bg-secondary/5">
          <Button variant="outline" className="w-1/2" onClick={onClose}>
            <X className="w-4 h-4" />
            <span>Close</span>
          </Button>
          <Button className="w-1/2" onClick={() => onJoin(room.roomCode)}>
            <UserPlus className="w-4 h-4" />
            <span>{room.autoJoin ? "Join Room" : "Request to join"}</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <RoomDescriptionSection description={room.description} />

        {/* Tags */}
        <section>
          <h3 className="text-sm font-semibold text-heading mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {room.tags.map((tag) => (
              <TagChip key={tag.id} label={tag.name} />
            ))}
          </div>
        </section>

        {/* Members */}
        <section>
          <h3 className="text-sm font-semibold text-heading mb-2">Members</h3>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-para-muted" />
            <span className="text-sm text-para">
              {room.memberCount} member{room.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        </section>
      </div>
    </Modal>
  );
}

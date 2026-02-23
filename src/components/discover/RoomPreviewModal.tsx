"use client";

import { UserPlus, X } from "lucide-react";
import Image from "next/image";
import type { PublicRoom } from "@/types/discover";
import TagChip from "./TagChip";
import { Button } from "../ui/Button";
import Modal from "@/components/ui/Modal";
import RoomDescriptionSection from "./room-preview/RoomDescriptionSection";
import RoomMembersSection from "./room-preview/RoomMembersSection";
import RoomFilesSection from "./room-preview/RoomFilesSection";
import RoomAssignmentsSection from "./room-preview/RoomAssignmentsSection";

interface RoomPreviewModalProps {
  room: PublicRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
  onOpenFull: (roomId: string) => void;
}

export default function RoomPreviewModal({
  room,
  isOpen,
  onClose,
  onJoin,
  onOpenFull,
}: RoomPreviewModalProps) {
  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room.title}
      description={
        <div className="flex items-center gap-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden flex-shrink-0">
            <Image
              src={room.creator.avatar}
              alt={room.creator.name}
              width={32}
              height={32}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-heading">
              {room.creator.name}
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
          <Button className="w-1/2" onClick={() => onJoin(room.id)}>
            <UserPlus className="w-4 h-4" />
            <span>Join Room</span>
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
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        </section>

        <RoomMembersSection
          membersCount={room.membersCount}
          membersPreview={room.membersPreview}
        />

        <RoomFilesSection files={room.files} />

        <RoomAssignmentsSection assignments={room.assignments} />
      </div>
    </Modal>
  );
}

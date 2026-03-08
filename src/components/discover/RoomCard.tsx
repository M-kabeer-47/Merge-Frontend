"use client";

import { Eye, UserPlus, Users } from "lucide-react";
import type { FeedRoom } from "@/types/discover";
import TagChip from "./TagChip";
import Avatar from "../ui/Avatar";
import { Button } from "../ui/Button";

interface RoomCardProps {
  room: FeedRoom;
  onJoin: (roomCode: string) => void;
  onPreview: (room: FeedRoom) => void;
}

export default function RoomCard({ room, onJoin, onPreview }: RoomCardProps) {
  const creatorName = `${room.admin.firstName} ${room.admin.lastName}`;

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin(room.roomCode);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(room);
  };

  return (
    <article
      className="bg-background border border-light-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onPreview(room)}
      role="Button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPreview(room);
        }
      }}
      aria-label={`Room: ${room.title} by ${creatorName}`}
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className="text-lg font-bold text-heading line-clamp-1 group-hover:text-primary transition-colors flex-1"
          title={room.title}
        >
          {room.title}
        </h3>
        {room.isRecommended && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
            Recommended
          </span>
        )}
      </div>

      {/* Creator */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar profileImage={room.admin.image} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-para-muted">Created by</p>
          <p
            className="text-sm font-semibold text-heading truncate"
            title={creatorName}
          >
            {creatorName}
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm text-para line-clamp-2 mb-4"
        title={room.description}
      >
        {room.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {room.tags.slice(0, 3).map((tag) => (
          <TagChip key={tag.id} label={tag.name} />
        ))}
        {room.tags.length > 3 && (
          <span className="text-xs text-para-muted self-center">
            +{room.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-light-border">
        {/* Members */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-para-muted" />
          <span className="text-sm text-para-muted">
            {room.memberCount} member{room.memberCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePreviewClick}
            aria-label={`Preview ${room.title}`}
          >
            <Eye className="w-4 h-4" />
            <span className="inline">Preview</span>
          </Button>
          <Button
            onClick={handleJoinClick}
            aria-label={`${room.autoJoin ? "Join" : "Request to join"} ${room.title}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{room.autoJoin ? "Join Room" : "Request to join"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

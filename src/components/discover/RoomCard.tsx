"use client";

import { Eye, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import type { PublicRoom } from "@/types/discover";
import TagChip from "./TagChip";
import MemberAvatars from "../rooms/MembersAvatar";
import Avatar from "../ui/Avatar";
import { Button } from "../ui/Button";

interface RoomCardProps {
  room: PublicRoom;
  onJoin: (roomId: string) => void;
  onPreview: (room: PublicRoom) => void;
}

export default function RoomCard({ room, onJoin, onPreview }: RoomCardProps) {
  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin(room.id);
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
      aria-label={`Room: ${room.title} by ${room.creator.name}`}
    >
      {/* Thumbnail */}
      {/* <div className="relative w-full h-40 bg-secondary/15 rounded-lg mb-4 overflow-hidden">
        <Image
          src={room.thumbnail}
          alt={`${room.title} thumbnail`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to gradient background
            e.currentTarget.style.display = "none";
          }}
        />
        {room.activeNow && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-success rounded-full flex items-center gap-1.5">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-medium text-white">Active</span>
          </div>
        )}
      </div> */}

      {/* Creator */}

      {/* Title */}
      <h3
        className="text-lg font-bold text-heading mb-2 line-clamp-1 group-hover:text-primary transition-colors"
        title={room.title}
      >
        {room.title}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <Avatar profileImage={room.creator.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-para-muted">Created by</p>
          <p
            className="text-sm font-semibold text-heading truncate"
            title={room.creator.name}
          >
            {room.creator.name}
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
          <TagChip key={tag} label={tag} />
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
          <MemberAvatars
            members={room.membersPreview.map((m) => ({
              id: m.id,
              name: m.name,
              image: m.avatar,
            }))}
            maxVisible={7}
            size="sm"
          />
          <span className="text-sm text-para-muted">
            {room.membersCount} member{room.membersCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Actions */}
      </div>
      <div className="flex gap-2 mt-3 justify-end">
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
          aria-label={`Request to join ${room.title}`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Request to join</span>
        </Button>
      </div>
    </article>
  );
}

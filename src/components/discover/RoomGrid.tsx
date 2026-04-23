"use client";

import type { FeedRoom } from "@/types/discover";
import RoomCard from "./RoomCard";
import LoaderSkeleton from "./LoaderSkeleton";

interface RoomGridProps {
  rooms: FeedRoom[];
  loading?: boolean;
  onJoin: (roomCode: string) => void;
  onPreview: (room: FeedRoom) => void;
}

export default function RoomGrid({
  rooms,
  loading = false,
  onJoin,
  onPreview,
}: RoomGridProps) {
  return (
    <div
      className="grid grid-cols-1 gap-6"
      role="list"
      aria-label="Public rooms grid"
    >
      {rooms.map((room) => (
        <div key={room.id} role="listitem">
          <RoomCard room={room} onJoin={onJoin} onPreview={onPreview} />
        </div>
      ))}

      {loading &&
        Array.from({ length: 3 }).map((_, index) => (
          <div key={`skeleton-${index}`} role="listitem" aria-busy="true">
            <LoaderSkeleton />
          </div>
        ))}
    </div>
  );
}

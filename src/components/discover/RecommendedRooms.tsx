"use client";

import { Star, TrendingUp } from "lucide-react";
import type { PublicRoom } from "@/types/discover";
import Image from "next/image";

interface RecommendedRoomsProps {
  rooms: PublicRoom[];
  onRoomClick: (room: PublicRoom) => void;
}

export default function RecommendedRooms({
  rooms,
  onRoomClick,
}: RecommendedRoomsProps) {
  if (rooms.length === 0) return null;

  return (
    <section className="mb-8" aria-labelledby="recommended-heading">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-primary fill-primary" />
        <h2 id="recommended-heading" className="text-xl font-bold text-heading">
          Recommended for You
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomClick(room)}
            className="flex-shrink-0 w-80 bg-background border border-light-border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
            aria-label={`Recommended room: ${room.title}`}
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="relative w-20 h-20 bg-secondary/5 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={room.thumbnail}
                  alt={room.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {room.activeNow && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-heading mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {room.title}
                </h3>
                <p className="text-xs text-para-muted mb-2 line-clamp-1">
                  {room.creator.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-para-muted">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {room.membersCount} members
                  </span>
                  {room.tags[0] && (
                    <span className="px-2 py-0.5 bg-secondary/10 text-primary rounded-full">
                      {room.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

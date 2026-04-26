"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import RoomCard from "@/components/rooms/RoomCard";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";

export default function MyRooms() {
  const { rooms, isLoading } = useGetUserRooms({ filter: "all" });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            My Rooms
          </h2>
        </div>
        <Link
          href="/rooms"
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-secondary/10 animate-pulse"
            />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-background border border-light-border rounded-xl p-8 text-center">
          <Users className="w-10 h-10 text-para-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-heading font-medium">No rooms yet</p>
          <p className="text-xs text-para-muted mt-1">
            Create or join a room to start collaborating with peers.
          </p>
          <Link
            href="/rooms"
            className="inline-block mt-3 text-primary hover:text-primary/80 text-sm font-semibold"
          >
            Browse rooms →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.slice(0, 3).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

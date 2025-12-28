"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RoomCard from "./RoomCard";
import RoomsSkeleton from "./RoomsSkeleton";
import type { RoomsResponse } from "@/server-api/rooms";
import { useRoomActions } from "@/contexts/RoomActionsContext";

// Client-side fetch function for React Query
async function fetchRoomsClient(
  filter: string,
  search: string
): Promise<RoomsResponse> {
  const { default: api } = await import("@/utils/api");
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await api.get(`/user/rooms?filter=${filter}${searchParam}`);
  return (
    response.data ?? {
      rooms: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
      filter: "all",
      counts: { created: 0, joined: 0, total: 0 },
    }
  );
}

interface RoomsListProps {
  filter: "all" | "created" | "joined";
  search: string;
  activeTab: "all" | "joined" | "my-rooms";
}

export default function RoomsList({ filter, search }: RoomsListProps) {
  const router = useRouter();
  const { onDeleteRoom } = useRoomActions();

  // Use React Query - data is hydrated from server on first render
  const { data, isLoading } = useQuery({
    queryKey: ["rooms", filter, search],
    queryFn: () => fetchRoomsClient(filter, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const rooms = data?.rooms ?? [];

  const handleViewRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  const handleEditRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}/settings`);
  };

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
  };

  if (isLoading) {
    return <RoomsSkeleton />;
  }

  if (rooms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <Image
            src={
              search
                ? "/illustrations/no-search-results.png"
                : "/illustrations/empty-rooms.png"
            }
            alt={search ? "No search results" : "No rooms"}
            width={160}
            height={160}
            className="object-contain"
          />
        </motion.div>
        <h3 className="text-lg font-semibold text-heading mb-2">
          No rooms found
        </h3>
        <p className="text-para-muted mb-4">
          {search
            ? `No rooms match your search "${search}"`
            : "There are no rooms in this category yet"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { delay: 0.3, staggerChildren: 0.1 },
        },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {rooms.map((room) => (
        <motion.div
          key={room.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          <RoomCard
            room={room}
            onJoin={handleJoinRoom}
            onEdit={handleEditRoom}
            onDelete={onDeleteRoom}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import RoomCard from "../../RoomCard";
import RoomsSkeleton from "./RoomsSkeleton";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import RoomsEmptyState from "./RoomsEmptyState";

export default function RoomsList() {
  const searchParams = useSearchParams();

  // Get filter and search from URL (source of truth)
  const filterParam = searchParams.get("filter");
  const filter =
    filterParam === "created" || filterParam === "joined" ? filterParam : "all";
  const search = searchParams.get("search") || "";

  const { rooms, isFetching } = useGetUserRooms({ filter, search });

  if (isFetching) {
    return <RoomsSkeleton />;
  }

  if (rooms.length === 0) {
    return <RoomsEmptyState search={search} />;
  }

  return (
    <motion.div
      key={filter} // Re-animate when filter changes
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {rooms.map((room, index) => (
        <motion.div
          key={room.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <RoomCard room={room} />
        </motion.div>
      ))}
    </motion.div>
  );
}

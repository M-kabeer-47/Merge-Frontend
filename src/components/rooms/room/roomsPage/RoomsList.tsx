"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import RoomCard from "../../RoomCard";
import RoomsSkeleton from "./RoomsSkeleton";
import { useRoomActions, useRoomFilters } from "@/contexts/RoomsContext";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import RoomsEmptyState from "./RoomsEmptyState";

export default function RoomsList() {
  const router = useRouter();
  const { onDeleteRoom } = useRoomActions();
  const { filter, search } = useRoomFilters();

  const { rooms, isFetching } = useGetUserRooms({ filter, search });

  const handleEditRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}/settings`);
  };

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
  };

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

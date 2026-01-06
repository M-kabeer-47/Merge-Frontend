"use client";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { RoomDetails } from "@/types/room-details";
import { useQuery } from "@tanstack/react-query";
import { getRoomDetails } from "@/server-api/room";
// Moderator type for room context
export type RoomUserRole = "instructor" | "moderator" | "student" | null;

// Room Context type
export interface RoomContextType {
  room: RoomDetails | null;
  userRole: RoomUserRole;
}

interface RoomProviderProps {
  roomID: string;
  children: ReactNode;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children, roomID }: RoomProviderProps) {
  const { user } = useAuth();
  const { data: room } = useQuery({
    queryKey: ["room", roomID],
    queryFn: () => getRoomDetails(roomID),
    staleTime: Infinity,
  });
  // Determine user role within the room
  const userRole = () => {
    if (!room || !user) return null;

    // Check if user is the room admin/instructor
    if (user.id === room.admin?.id) {
      return "instructor" as const;
    }

    // Check if user is in moderators list
    if (room.moderators?.some((moderator) => moderator.id === user.id)) {
      return "moderator" as const;
    }

    // Default to student
    return "student" as const;
  };

  // Create context value with role flags
  const contextValue = {
    room: room as RoomDetails,
    userRole: userRole(),
  };

  return (
    <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}

"use client";
import { createContext, useContext, ReactNode } from "react";
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
  const { data: room } = useQuery({
    queryKey: ["room", roomID],
    queryFn: () => getRoomDetails(roomID),
    staleTime: Infinity,
  });
  // userRole is returned per-room by GET /room/:id — just normalize and use it.
  const userRole = (): RoomUserRole => {
    if (!room) return null;

    switch ((room.userRole || "").toLowerCase()) {
      case "instructor":
      case "admin":
        return "instructor";
      case "moderator":
        return "moderator";
      case "student":
      case "member":
        return "student";
      default:
        return null;
    }
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

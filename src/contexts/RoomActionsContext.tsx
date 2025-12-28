"use client";

import { createContext, useContext } from "react";

interface RoomActionsContextType {
  onDeleteRoom: (room: { id: string; title: string }) => void;
}

const RoomActionsContext = createContext<RoomActionsContextType | null>(null);

export function RoomActionsProvider({
  children,
  onDeleteRoom,
}: {
  children: React.ReactNode;
  onDeleteRoom: (room: { id: string; title: string }) => void;
}) {
  return (
    <RoomActionsContext.Provider value={{ onDeleteRoom }}>
      {children}
    </RoomActionsContext.Provider>
  );
}

export function useRoomActions() {
  const context = useContext(RoomActionsContext);
  if (!context) {
    throw new Error("useRoomActions must be used within RoomActionsProvider");
  }
  return context;
}

"use client";

import { createContext, useContext } from "react";

interface RoomsContextType {
  // Filters
  filter: "all" | "created" | "joined";
  search: string;
  // Actions
  onDeleteRoom: (room: { id: string; title: string }) => void;
}

const RoomsContext = createContext<RoomsContextType | null>(null);

interface RoomsProviderProps {
  filter: "all" | "created" | "joined";
  search: string;
  onDeleteRoom: (room: { id: string; title: string }) => void;
  children: React.ReactNode;
}

export function RoomsProvider({
  filter,
  search,
  onDeleteRoom,
  children,
}: RoomsProviderProps) {
  return (
    <RoomsContext.Provider value={{ filter, search, onDeleteRoom }}>
      {children}
    </RoomsContext.Provider>
  );
}

export function useRoomFilters() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRoomFilters must be used within RoomsProvider");
  }
  return { filter: context.filter, search: context.search };
}

export function useRoomActions() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRoomActions must be used within RoomsProvider");
  }
  return { onDeleteRoom: context.onDeleteRoom };
}

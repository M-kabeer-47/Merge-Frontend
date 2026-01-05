import { ReactNode } from "react";
import { getRoomDetails } from "@/server-api/room";
import { RoomProvider } from "./RoomProvider";

interface RoomProviderServerProps {
  roomId: string;
  children: ReactNode;
}

export async function RoomProviderServer({
  roomId,
  children,
}: RoomProviderServerProps) {
  const room = await getRoomDetails(roomId);

  return <RoomProvider room={room}>{children}</RoomProvider>;
}

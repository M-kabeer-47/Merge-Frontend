import { ReactNode } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
  const queryClient = new QueryClient();

  // Prefetch room details on server
  await queryClient.prefetchQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomDetails(roomId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomProvider roomID={roomId}>{children}</RoomProvider>
    </HydrationBoundary>
  );
}

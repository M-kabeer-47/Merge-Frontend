import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRoomMembers } from "@/server-api/room-members";
import RoomSettingsClient from "./RoomSettingsClient";

interface SettingsDataWrapperProps {
  roomId: string;
}

/**
 * Server component that prefetches room members for initial page load.
 * Uses React Query hydration for optimistic updates on the client.
 */
export default async function SettingsDataWrapper({
  roomId,
}: SettingsDataWrapperProps) {
  const queryClient = new QueryClient();

  // Prefetch members data for initial hydration
  await queryClient.prefetchQuery({
    queryKey: ["room", roomId, "members"],
    queryFn: () => getRoomMembers(roomId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomSettingsClient roomId={roomId} />
    </HydrationBoundary>
  );
}

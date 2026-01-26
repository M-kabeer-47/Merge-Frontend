import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRoomMembers } from "@/server-api/room-members";
import RoomSettingsClient from "@/components/rooms/settings/RoomSettingsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomSettingsPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  // Prefetch Room Members
  // Key must match useFetchRoomMembers: ["room", roomId, "members"]
  await queryClient.prefetchQuery({
    queryKey: ["room", id, "members"],
    queryFn: () => getRoomMembers(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomSettingsClient />
    </HydrationBoundary>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRooms } from "@/server-api/rooms";
import RoomsList from "./RoomsList";

// Server component prefetches default rooms data for initial page load
// Filter/search changes are handled by React Query on the client
export default async function RoomsDataWrapper() {
  const queryClient = new QueryClient();

  // Only prefetch default "all" rooms with no search for initial load
  await queryClient.prefetchQuery({
    queryKey: ["rooms", "all", ""],
    queryFn: () => getRooms({ filter: "all", search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomsList />
    </HydrationBoundary>
  );
}

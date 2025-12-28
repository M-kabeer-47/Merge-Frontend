import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRooms } from "@/server-api/rooms";
import RoomsList from "./RoomsList";

interface RoomsDataWrapperProps {
  filter: "all" | "created" | "joined";
  search: string;
  activeTab: "all" | "joined" | "my-rooms";
}

export default async function RoomsDataWrapper({
  filter,
  search,
  activeTab,
}: RoomsDataWrapperProps) {
  const queryClient = new QueryClient();

  // Prefetch rooms into React Query cache
  await queryClient.prefetchQuery({
    queryKey: ["rooms", filter, search],
    queryFn: () => getRooms({ filter, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoomsList filter={filter} search={search} activeTab={activeTab} />
    </HydrationBoundary>
  );
}

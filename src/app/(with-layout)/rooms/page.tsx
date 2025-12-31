import { Suspense } from "react";
import RoomsPageClient from "@/components/rooms/RoomsPageClient";
import RoomsDataWrapper from "@/components/rooms/RoomsDataWrapper";
import RoomsSkeleton from "@/components/rooms/RoomsSkeleton";

// Server component only prefetches default data for initial load
// Client handles filter/search changes via React Query
export default async function RoomsPage() {
  return (
    <RoomsPageClient>
      <Suspense fallback={<RoomsSkeleton />}>
        <RoomsDataWrapper />
      </Suspense>
    </RoomsPageClient>
  );
}

import { Suspense } from "react";
import RoomsPageClient from "@/components/rooms/room/roomsPage/RoomsPageClient";
import RoomsDataWrapper from "@/components/rooms/room/roomsPage/RoomsDataWrapper";
import RoomsSkeleton from "@/components/rooms/room/roomsPage/RoomsSkeleton";

interface RoomsPageProps {
  searchParams: Promise<{ filter?: string; search?: string }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { filter, search } = await searchParams;

  return (
    <RoomsPageClient initialFilter={filter} initialSearch={search}>
      <Suspense fallback={<RoomsSkeleton />}>
        <RoomsDataWrapper />
      </Suspense>
    </RoomsPageClient>
  );
}

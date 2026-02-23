import { Suspense } from "react";
import RoomsPageClient from "@/components/rooms/room/rooms-page/RoomsPageClient";
import RoomsDataWrapper from "@/components/rooms/room/rooms-page/RoomsDataWrapper";
import RoomsSkeleton from "@/components/rooms/room/rooms-page/RoomsSkeleton";

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

import { Suspense } from "react";
import RoomsPageClient from "@/components/rooms/RoomsPageClient";
import RoomsDataWrapper from "@/components/rooms/RoomsDataWrapper";
import RoomsSkeleton from "@/components/rooms/RoomsSkeleton";

interface RoomsPageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
  }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const { filter = "all", search = "" } = await searchParams;

  // Validate filter
  const validFilter =
    filter === "created" || filter === "joined" ? filter : "all";

  const activeTab =
    validFilter === "created"
      ? "my-rooms"
      : validFilter === "joined"
      ? "joined"
      : "all";

  return (
    <RoomsPageClient>
      <Suspense fallback={<RoomsSkeleton />}>
        <RoomsDataWrapper
          filter={validFilter}
          search={search}
          activeTab={activeTab}
        />
      </Suspense>
    </RoomsPageClient>
  );
}

import { RoomProviderServer } from "@/providers/RoomProviderServer";
import RoomLayoutClient from "@/components/rooms/room/RoomLayoutClient";
import RoomLayoutSkeleton from "@/components/rooms/room/RoomLayoutSkeleton";
import { Suspense } from "react";

interface RoomLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function RoomLayout({
  children,
  params,
}: RoomLayoutProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<RoomLayoutSkeleton />}>
      <RoomProviderServer roomId={id}>
        <RoomLayoutClient>{children}</RoomLayoutClient>
      </RoomProviderServer>
    </Suspense>
  );
}

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAnnouncements } from "@/server-api/announcements";
import AnnouncementsList from "@/components/announcements/AnnouncementsList";

interface AnnouncementsDataWrapperProps {
  params: Promise<{ id: string }>;
}

export default async function AnnouncementsDataWrapper({
  params,
}: AnnouncementsDataWrapperProps) {
  const queryClient = new QueryClient();

  const { id: roomId } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["announcements", roomId],
    queryFn: () => getAnnouncements({ roomId, filter: "all" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementsList roomId={roomId} />
    </HydrationBoundary>
  );
}

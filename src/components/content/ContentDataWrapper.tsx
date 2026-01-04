import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRoomContent } from "@/server-api/room-content";
import ContentList from "./ContentList";

interface ContentDataWrapperProps {
  roomId: string;
  folderId: string | null;
}

// Server component prefetches current folder content for initial page load
// Mutations use refreshFolderCache to keep cache warm for navigation
export default async function ContentDataWrapper({
  roomId,
  folderId,
}: ContentDataWrapperProps) {
  const queryClient = new QueryClient();

  // Fetch current folder content only (no subfolder prefetching for fast initial load)
  const content = await getRoomContent({
    roomId,
    folderId,
    search: "",
    sortBy: undefined,
    sortOrder: undefined,
  });

  // Prefetch into React Query for client hydration
  await queryClient.prefetchQuery({
    queryKey: ["room-content", roomId, folderId || null, "", null, null],
    queryFn: () => Promise.resolve(content),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContentList />
    </HydrationBoundary>
  );
}

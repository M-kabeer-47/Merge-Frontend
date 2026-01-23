import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getGeneralChatMessages } from "@/server-api/general-chat";
import GeneralChatClient from "./GeneralChatClient";

interface GeneralChatDataWrapperProps {
  roomId: string;
}

/**
 * Server component that prefetches initial chat messages.
 * Uses dehydrate/HydrationBoundary pattern to pass data to client.
 */
export default async function GeneralChatDataWrapper({
  roomId,
}: GeneralChatDataWrapperProps) {
  const queryClient = new QueryClient();

  // Prefetch first page of messages server-side
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["general-chat", roomId],
    queryFn: () => getGeneralChatMessages({ roomId, page: 1, limit: 20 }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GeneralChatClient roomId={roomId} />
    </HydrationBoundary>
  );
}

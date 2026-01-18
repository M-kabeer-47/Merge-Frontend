import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getGeneralChatMessages } from "@/server-api/general-chat";
import GeneralChatClientWrapper from "./GeneralChatClientWrapper";

interface GeneralChatDataWrapperProps {
  roomId: string;
}

/**
 * Server component that prefetches initial chat messages for the room.
 * Uses React Query hydration for optimistic updates on the client.
 */
export default async function GeneralChatDataWrapper({
  roomId,
}: GeneralChatDataWrapperProps) {
  const queryClient = new QueryClient();

  // Prefetch first page of messages (20 messages) for initial hydration
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["general-chat", roomId],
    queryFn: async () => {
      return await getGeneralChatMessages({
        roomId,
        page: 1,
        limit: 20,
        sortOrder: "DESC",
      });
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GeneralChatClientWrapper roomId={roomId} />
    </HydrationBoundary>
  );
}

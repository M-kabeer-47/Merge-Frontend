"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type {
  FetchMessagesResponse,
  ChatMessage,
  ApiChatMessage,
  MessageAttachment,
} from "@/types/general-chat";

interface UseFetchMessagesOptions {
  roomId: string;
  limit?: number;
  enabled?: boolean;
}

// Transform API message to frontend ChatMessage
function transformMessage(apiMessage: ApiChatMessage): ChatMessage {
  const attachments: MessageAttachment[] = apiMessage.attachmentURL
    ? [
        {
          id: `att-${apiMessage.id}`,
          name: apiMessage.attachmentURL.split("/").pop() || "file",
          type: "file",
          url: apiMessage.attachmentURL,
          size: 0,
        },
      ]
    : [];

  return {
    id: apiMessage.id,
    content: apiMessage.content,
    userId: apiMessage.author.id,
    roomId: apiMessage.room.id,
    replyToId: apiMessage.replyToId,
    attachments,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.updatedAt,
    isEdited: apiMessage.isEdited,
    isDeletedForEveryone: apiMessage.isDeletedForEveryone,
    user: apiMessage.author,
  };
}

/**
 * Hook for fetching general chat messages with infinite scrolling
 * Loads messages as user scrolls up (older messages)
 */
export function useFetchMessages({
  roomId,
  limit = 20,
  enabled = true,
}: UseFetchMessagesOptions) {
  const query = useInfiniteQuery({
    queryKey: ["general-chat", roomId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<FetchMessagesResponse>("/general-chat", {
        params: {
          roomId,
          page: pageParam,
          limit,
          sortOrder: "DESC", // Most recent first
        },
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      // Return next page number if there are more messages
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!roomId,
    staleTime: 0, // Always fetch fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Flatten all messages from all pages and transform them
  const messages: ChatMessage[] =
    query.data?.pages.flatMap((page) =>
      page.messages.map(transformMessage)
    ) || [];

  // Check if we have more messages to load (user can scroll up)
  const hasMore = query.hasNextPage;

  // Total count from the first page
  const totalMessages = query.data?.pages[0]?.total || 0;

  return {
    messages,
    hasMore,
    totalMessages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
  };
}

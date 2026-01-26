"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "@/utils/api";
import type {
  FetchMessagesResponse,
  ChatMessage,
  ChatCacheData,
  ChatCachePage,
} from "@/types/general-chat";

interface UseFetchMessagesOptions {
  roomId: string;
  limit?: number;
  enabled?: boolean;
}

export const CHAT_QUERY_KEY = "general-chat";

// API response may have "author" instead of "user"
interface ApiMessageResponse extends Omit<ChatMessage, 'user'> {
  user?: ChatMessage['user'];
  author?: ChatMessage['user'];
}

/**
 * Normalize message: API returns "author", socket returns "user"
 */
function normalizeMessage(msg: ApiMessageResponse): ChatMessage {
  const user = msg.user || msg.author || {
    id: msg.userId || "",
    firstName: "Unknown",
    lastName: "User",
    email: "",
    image: null,
  };
  
  return {
    ...msg,
    user,
  } as ChatMessage;
}

/**
 * Hook for fetching chat messages with infinite scroll support
 * Server sends ChatMessage[] directly - just normalize author→user
 */
export function useFetchMessages({
  roomId,
  limit = 20,
  enabled = true,
}: UseFetchMessagesOptions) {
  const queryKey = [CHAT_QUERY_KEY, roomId];

  const query = useInfiniteQuery<ChatCachePage, Error, ChatCacheData>({
    queryKey,
    queryFn: async ({ pageParam = 1 }): Promise<ChatCachePage> => {
      const response = await api.get<FetchMessagesResponse>("/general-chat", {
        params: {
          roomId,
          page: pageParam,
          limit,
          sortOrder: "DESC",
        },
      });

      // Normalize: API may return "author" instead of "user"
      const messages = response.data.messages.map(normalizeMessage);
      
      return {
        ...response.data,
        messages,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!roomId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  // Flatten messages from all pages (already transformed) - memoized for performance
  const messages: ChatMessage[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.messages) ?? [],
    [query.data?.pages]
  );

  return {
    messages,
    hasMore: query.hasNextPage,
    totalMessages: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
    queryKey,
  };
}

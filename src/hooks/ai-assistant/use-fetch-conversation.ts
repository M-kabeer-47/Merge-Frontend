"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { ConversationWithMessages } from "@/types/ai-chat";

/**
 * Hook to fetch a specific conversation with all its messages
 * @param conversationId - The conversation ID to fetch
 * @param isStreaming - When true, disables background refetching to prevent
 *   overwriting optimistic cache updates during streaming
 */
export default function useFetchConversation(
  conversationId: string | null,
  isStreaming: boolean = false,
) {
  const fetchConversation = async (): Promise<ConversationWithMessages | null> => {
    if (!conversationId) return null;

    const response = await api.get<ConversationWithMessages>(
      `/ai-assistant/conversations/${conversationId}`
    );
    return response.data;
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["ai-conversation", conversationId],
    queryFn: fetchConversation,
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    // Disable all background refetching during streaming to prevent
    // server data from overwriting optimistic cache updates
    refetchOnWindowFocus: !isStreaming,
    refetchOnReconnect: !isStreaming,
    refetchInterval: false,
  });

  return {
    conversation: data,
    messages: data?.messages || [],
    isLoading, // true only on initial fetch (no cached data)
    isFetching, // true on any fetch including background refetches
    isError,
    error,
    refetch,
  };
}

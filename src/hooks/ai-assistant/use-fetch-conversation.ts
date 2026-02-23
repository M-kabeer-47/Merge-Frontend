"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { ConversationWithMessages } from "@/types/ai-chat";

/**
 * Hook to fetch a specific conversation with all its messages
 */
export default function useFetchConversation(conversationId: string | null) {
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
    staleTime: 10 * 1000, // 10 seconds
    retry: 2,
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

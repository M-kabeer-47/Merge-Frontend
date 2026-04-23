"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { ChatSession } from "@/types/ai-chat";

/**
 * Hook to fetch all AI assistant conversations
 */
export default function useFetchConversations() {
  const fetchConversations = async (): Promise<ChatSession[]> => {
    const response = await api.get<ChatSession[]>(
      "/ai-assistant/conversations"
    );
    return response.data;
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["ai-conversations"],
    queryFn: fetchConversations,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
  });

  return {
    conversations: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

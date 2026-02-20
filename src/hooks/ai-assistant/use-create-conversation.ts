"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type {
  CreateConversationPayload,
  CreateConversationResponse,
  ChatSession,
} from "@/types/ai-chat";

/**
 * Hook to create a new AI conversation
 */
export default function useCreateConversation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateConversationPayload) => {
      const response = await api.post<CreateConversationResponse>(
        "/ai-assistant/conversations",
        data
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create conversation. Please try again."
      );
    },
    onSuccess: (newConversation) => {
      // Optimistically add to conversations list
      queryClient.setQueryData<ChatSession[]>(
        ["ai-conversations"],
        (old = []) => {
          const session: ChatSession = {
            ...newConversation,
            messageCount: 0,
            isPinned: false,
          };
          return [session, ...old];
        }
      );

      toast.success("Conversation created successfully!");
    },
    onSettled: () => {
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
  });

  return {
    createConversation: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

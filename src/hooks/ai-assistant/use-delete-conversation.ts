"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { DeleteConversationResponse, ChatSession } from "@/types/ai-chat";

/**
 * Hook to delete a conversation
 */
export default function useDeleteConversation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await api.delete<DeleteConversationResponse>(
        `/ai-assistant/conversations/${conversationId}`
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error("Delete conversation error:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      toastApiError(error, "Failed to delete conversation. Please try again.");
    },
    onSuccess: (_, conversationId) => {
      // Remove from conversations list
      queryClient.setQueryData<ChatSession[]>(
        ["ai-conversations"],
        (old = []) => old.filter((conv) => conv.id !== conversationId)
      );

      // Remove specific conversation cache
      queryClient.removeQueries({
        queryKey: ["ai-conversation", conversationId],
      });

      toast.success("Conversation deleted successfully!");
    },
    onSettled: () => {
      // Ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
  });

  return {
    deleteConversation: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

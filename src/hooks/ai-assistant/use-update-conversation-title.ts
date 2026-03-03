"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type {
  UpdateConversationTitlePayload,
  UpdateConversationResponse,
  ChatSession,
} from "@/types/ai-chat";

/**
 * Hook to update conversation title
 */
export default function useUpdateConversationTitle() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: UpdateConversationTitlePayload;
    }) => {
      const response = await api.patch<UpdateConversationResponse>(
        `/ai-assistant/conversations/${conversationId}/title`,
        data
      );
      return response.data;
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to update conversation title. Please try again.");
    },
    onSuccess: (updatedConversation, { conversationId }) => {
      // Update in conversations list
      queryClient.setQueryData<ChatSession[]>(
        ["ai-conversations"],
        (old = []) =>
          old.map((conv) =>
            conv.id === conversationId
              ? { ...conv, title: updatedConversation.title }
              : conv
          )
      );

      // Update in specific conversation cache
      queryClient.invalidateQueries({
        queryKey: ["ai-conversation", conversationId],
      });

      toast.success("Conversation title updated!");
    },
  });

  return {
    updateTitle: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

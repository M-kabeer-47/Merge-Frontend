"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { AttachmentType } from "@/types/ai-chat";
import type {
  SendMessagePayload,
  SendMessageResponse,
  ConversationWithMessages,
  ChatMessage,
} from "@/types/ai-chat";

/**
 * Map file type to AttachmentType enum
 */
function mapFileTypeToAttachmentType(fileType: string): AttachmentType | undefined {
  const lowerType = fileType.toLowerCase();
  
  if (lowerType.includes("image") || lowerType.includes("jpeg") || lowerType.includes("jpg") || lowerType.includes("png")) {
    return AttachmentType.IMAGE;
  }
  if (lowerType.includes("pdf")) {
    return AttachmentType.PDF;
  }
  if (lowerType.includes("docx") || lowerType.includes("document")) {
    return AttachmentType.DOCX;
  }
  if (lowerType.includes("pptx") || lowerType.includes("presentation")) {
    return AttachmentType.PPTX;
  }
  if (lowerType.includes("txt") || lowerType.includes("text/plain")) {
    return AttachmentType.TXT;
  }
  
  return undefined;
}

/**
 * Hook to send a message and get AI response
 */
export default function useSendMessage(conversationId: string | null) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: SendMessagePayload) => {
      if (!conversationId) {
        throw new Error("No conversation selected");
      }

      const response = await api.post<SendMessageResponse>(
        `/ai-assistant/conversations/${conversationId}/messages`,
        data
      );
      return response.data;
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    },
    onSuccess: (aiResponse, userMessageData) => {
      if (!conversationId) return;

      // Create user message object
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessageData.message,
        createdAt: new Date().toISOString(),
      };

      // Update conversation with both user message and AI response
      queryClient.setQueryData<ConversationWithMessages>(
        ["ai-conversation", conversationId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: [...old.messages, userMessage, aiResponse],
          };
        }
      );

      // Invalidate conversations list to update message count and last message
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isSending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    mapFileTypeToAttachmentType,
  };
}


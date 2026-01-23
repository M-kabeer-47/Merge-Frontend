"use client";

import { useState, useCallback } from "react";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import { useChatStore } from "./use-chat-store";
import { sendMessage as emitSendMessage } from "./use-socket-chat-events";
import { useAuth } from "@/providers/AuthProvider";
import { createOptimisticMessage } from "@/types/general-chat";
import type { AttachmentFile } from "@/components/chat/AttachmentPreview";
import type { SendMessagePayload } from "@/types/general-chat";
import type { Socket } from "socket.io-client";

interface SendMessageParams {
  roomId: string;
  content: string;
  replyToId?: string;
  attachments?: AttachmentFile[];
  socket: Socket | null;
}

function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Hook for sending chat messages with optimistic updates and file upload support
 */
export default function useSendChatMessage(roomId: string) {
  const { user } = useAuth();
  const store = useChatStore(roomId);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(
    new Set()
  );

  const sendMessage = useCallback(
    async ({ content, replyToId, attachments, socket }: Omit<SendMessageParams, 'roomId'>) => {
      if (!user) throw new Error("Not authenticated");

      const tempId = generateTempId();
      const hasAttachments = attachments && attachments.length > 0;
      const attachment = hasAttachments ? attachments[0] : undefined;

      // Create optimistic message using helper from types
      const optimisticMessage = createOptimisticMessage({
        tempId,
        roomId,
        content: content || "",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image || null,
        },
        replyToId,
        attachment: attachment
          ? {
              file: attachment.file,
              preview: attachment.preview,
              type: attachment.type,
            }
          : undefined,
      });

      // Add to cache immediately
      store.addMessage(optimisticMessage);
      setPendingMessages((prev) => new Set(prev).add(tempId));

      try {
        let attachmentURL: string | undefined;

        if (hasAttachments && attachment) {
          // Upload with progress tracking
          attachmentURL = await uploadToCloudinary({
            file: attachment.file,
            attachmentType: attachment.type,
            onProgress: (progress) => {
              store.updateUploadProgress(tempId, progress);
            },
          });

          // Update with final URL
          store.updateMessage(tempId, {
            attachments: [
              {
                ...optimisticMessage.attachments[0],
                url: attachmentURL,
                isUploading: false,
              },
            ],
            isUploading: false,
            uploadProgress: 100,
          });
        }

        // Prepare and send payload
        const payload: SendMessagePayload = {
          roomId,
          content: content?.trim() || undefined,
          replyToId,
          attachmentURL,
        };

        await emitSendMessage(socket, payload);

        // Mark as sent immediately
        store.markAsSent(tempId);

        // Clean up pending state
        setPendingMessages((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        store.markAsFailed(tempId);
        throw error;
      }
    },
    [user, roomId, store]
  );

  const sendMessageWithFiles = useCallback(
    async ({ content, replyToId, attachments, socket }: Omit<SendMessageParams, 'roomId'>) => {
      if (!attachments || attachments.length === 0) {
        return sendMessage({ content, replyToId, socket });
      }

      // Single image with content
      if (attachments.length === 1 && attachments[0].type === "image") {
        return sendMessage({ content, replyToId, attachments, socket });
      }

      // Multiple files: send content first, then files separately
      if (content?.trim()) {
        await sendMessage({ content, replyToId, socket });
      }

      for (const att of attachments) {
        await sendMessage({
          content: "",
        attachments: [att],
          socket,
        });
      }
    },
    [sendMessage]
  );

  return {
    sendMessage: sendMessageWithFiles,
    isMessagePending: (tempId: string) => pendingMessages.has(tempId),
  };
}

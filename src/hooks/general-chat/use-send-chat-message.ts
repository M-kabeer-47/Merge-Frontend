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
    new Set(),
  );

  const sendMessage = useCallback(
    async ({
      content,
      replyToId,
      attachments,
      socket,
    }: Omit<SendMessageParams, "roomId">) => {
      if (!user) throw new Error("Not authenticated");

      const tempId = generateTempId();
      const hasAttachments = attachments && attachments.length > 0;

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
        attachments: attachments, // Pass raw attachments array
      });

      // Add to cache immediately
      store.addMessage(optimisticMessage);
      setPendingMessages((prev) => new Set(prev).add(tempId));

      try {
        let uploadedAttachments: { name: string; url: string }[] = [];

        if (hasAttachments) {
          // Upload all files in parallel
          uploadedAttachments = await Promise.all(
            (attachments || []).map(async (att, index) => {
              const url = await uploadToCloudinary({
                file: att.file,
                attachmentType: att.type,
                onProgress: (progress) => {
                  // Update progress for this specific attachment
                  store.updateAttachmentProgress(tempId, index, progress);
                },
              });

              return {
                name: att.file.name,
                url: url,
              };
            }),
          );

          // Update store with final URLs (optimistic message update)
          // We map the uploaded results back to the message attachments structure
          const finalAttachments = uploadedAttachments.map((ua, i) => ({
            ...optimisticMessage.attachments[i],
            url: ua.url,
            isUploading: false,
          }));

          store.updateMessage(tempId, {
            attachments: finalAttachments,
            isUploading: false,
            uploadProgress: 100,
          });
        }

        // Prepare and send payload
        const payload: SendMessagePayload = {
          roomId,
          content: content?.trim() || undefined,
          replyToId,
          attachments:
            uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
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
    [user, roomId, store],
  );

  const sendMessageWithFiles = async ({
    content,
    replyToId,
    attachments,
    socket,
  }: Omit<SendMessageParams, "roomId">) => {
    // Send logic completely unified now
    return sendMessage({ content, replyToId, attachments, socket });
  };

  return {
    sendMessage: sendMessageWithFiles,
    isMessagePending: (tempId: string) => pendingMessages.has(tempId),
  };
}

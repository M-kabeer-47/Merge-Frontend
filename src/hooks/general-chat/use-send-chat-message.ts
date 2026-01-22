"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import type { AttachmentFile } from "@/components/chat/AttachmentPreview";
import type { SendMessagePayload } from "@/types/general-chat";
import type { Socket } from "socket.io-client";
import { sendMessage as emitSendMessage } from "./use-socket-chat-events";

interface SendMessageParams {
  roomId: string;
  content: string;
  replyToId?: string;
  attachments?: AttachmentFile[];
  socket: Socket | null;
}

/**
 * Hook for sending chat messages with file upload support
 * Simplified: only handles upload + emit, no optimistic update logic
 * React Query cache updates are handled by the component via socket events
 */
export default function useSendChatMessage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sendMessage = async ({
    roomId,
    content,
    replyToId,
    attachments,
    socket,
  }: SendMessageParams) => {
    // Text-only message
    if (!attachments || attachments.length === 0) {
      const payload: SendMessagePayload = { roomId, content, replyToId };
      await emitSendMessage(socket, payload);
      return;
    }

    // Handle attachments - upload first, then send
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const attachmentType = attachments[0].type;

      if (attachmentType === "image") {
        // Upload first image (API currently supports single attachment)
        const uploadedUrl = await uploadToCloudinary({
          file: attachments[0].file,
          attachmentType,
          onProgress: setUploadProgress,
        });

        const payload: SendMessagePayload = {
          roomId,
          content: content?.trim() || undefined,
          replyToId,
          attachmentURL: uploadedUrl,
        };
        await emitSendMessage(socket, payload);
      } else {
        // For files, send separate messages for each
        for (let i = 0; i < attachments.length; i++) {
          const att = attachments[i];
          const uploadedUrl = await uploadToCloudinary({
            file: att.file,
            attachmentType,
            onProgress: (p) =>
              setUploadProgress(
                Math.round(((i + p / 100) / attachments.length) * 100),
              ),
          });

          const payload: SendMessagePayload = {
            roomId,
            content: i === 0 ? content?.trim() || undefined : undefined,
            replyToId: i === 0 ? replyToId : undefined,
            attachmentURL: uploadedUrl,
          };
          await emitSendMessage(socket, payload);
        }
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    sendMessage,
    isUploading,
    uploadProgress,
  };
}

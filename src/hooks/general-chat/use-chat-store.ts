"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChatMessage,
  ChatCacheData,
  MessageStatus,
  isOptimisticId,
} from "@/types/general-chat";
import { CHAT_QUERY_KEY } from "./use-fetch-messages";

/**
 * Unified chat store hook - Single source of truth for all cache operations
 * This hook consolidates all chat cache manipulation in one place
 */
export function useChatStore(roomId: string) {
  const queryClient = useQueryClient();
  const queryKey = [CHAT_QUERY_KEY, roomId];

  /**
   * Get all messages from cache (flattened from all pages)
   */
  const getMessages = (): ChatMessage[] => {
    const data = queryClient.getQueryData<ChatCacheData>(queryKey);
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.messages);
  };

  /**
   * Get a specific message by ID
   */
  const getMessage = (messageId: string): ChatMessage | undefined => {
    return getMessages().find((m) => m.id === messageId);
  };

  /**
   * Add a new message to the cache (prepends to first page)
   * If this is a real message from WebSocket and we have a matching optimistic message,
   * replace the optimistic message instead of adding a duplicate
   */
  const addMessage = (message: ChatMessage) => {
    // Robustly extract userId from message (top-level, user, or author)
    const getUserId = (msg: any) =>
      msg.userId || msg.user?.id || msg.author?.id || undefined;
    queryClient.setQueryData<ChatCacheData>(queryKey, (old) => {
      if (!old?.pages?.length) {
        // Create initial structure if cache is empty
        return {
          pages: [
            {
              messages: [message],
              total: 1,
              totalPages: 1,
              currentPage: 1,
              room: { id: roomId },
            },
          ],
          pageParams: [1],
        };
      }

      // Check if message already exists by ID
      const messageExists = old.pages.some((page) =>
        page.messages.some((m) => m.id === message.id),
      );
      if (messageExists) return old;

      // For real messages (non-optimistic), check if there's a matching optimistic message
      // to replace (same userId, similar content after trimming)
      if (!isOptimisticId(message.id)) {
        const messageTime = new Date(message.createdAt).getTime();
        const incomingContent = (message.content || "").trim();
        const incomingUserId = getUserId(message);

        // Find all optimistic messages
        const optimisticMessages = old.pages.flatMap((p) =>
          p.messages.filter((m) => isOptimisticId(m.id)),
        );

        // Find optimistic message to replace
        for (const page of old.pages) {
          const optimisticIndex = page.messages.findIndex((m) => {
            if (!isOptimisticId(m.id)) return false;
            if (getUserId(m) !== incomingUserId) return false;

            // Content match (trim both for comparison)
            const optimisticContent = (m.content || "").trim();
            if (optimisticContent !== incomingContent) return false;

            // Within 60 seconds of each other (increased tolerance)
            const timeDiff = Math.abs(
              new Date(m.createdAt).getTime() - messageTime,
            );
            if (timeDiff > 60000) return false;

            return true;
          });

          if (optimisticIndex !== -1) {
            // Replace optimistic message with real message (keeping position)
            return {
              ...old,
              pages: old.pages.map((p, pageIndex) => {
                if (pageIndex === old.pages.indexOf(page)) {
                  const newMessages = [...p.messages];
                  newMessages[optimisticIndex] = {
                    ...message,
                    status: "sent" as MessageStatus,
                  };
                  return { ...p, messages: newMessages };
                }
                return p;
              }),
            };
          }
        }
      }

      // No matching optimistic message found, prepend to first page
      return {
        ...old,
        pages: old.pages.map((page, index) =>
          index === 0
            ? { ...page, messages: [message, ...page.messages] }
            : page,
        ),
      };
    });
  };

  /**
   * Update an existing message in the cache
   */
  const updateMessage = (messageId: string, updates: Partial<ChatMessage>) => {
    queryClient.setQueryData<ChatCacheData>(queryKey, (old) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m,
          ),
        })),
      };
    });
  };

  /**
   * Replace a message entirely (used for replacing optimistic with real)
   */
  const replaceMessage = (oldId: string, newMessage: ChatMessage) => {
    queryClient.setQueryData<ChatCacheData>(queryKey, (old) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => (m.id === oldId ? newMessage : m)),
        })),
      };
    });
  };

  /**
   * Remove a message from the cache
   */
  const removeMessage = (messageId: string) => {
    queryClient.setQueryData<ChatCacheData>(queryKey, (old) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.filter((m) => m.id !== messageId),
        })),
      };
    });
  };

  /**
   * Mark a message as deleted (soft delete)
   */
  const markAsDeleted = (messageId: string) => {
    updateMessage(messageId, {
      isDeleted: true,
      content: "",
      attachments: [],
    });
  };

  /**
   * Update message status (for optimistic updates)
   */
  const updateStatus = (messageId: string, status: MessageStatus) => {
    updateMessage(messageId, { status });
  };

  /**
   * Mark message as sent
   */
  const markAsSent = (messageId: string) => {
    updateStatus(messageId, "sent");
  };

  /**
   * Mark message as failed
   */
  const markAsFailed = (messageId: string) => {
    updateStatus(messageId, "failed");
  };

  /**
   * Update upload progress for a message
   */
  const updateUploadProgress = (messageId: string, progress: number) => {
    updateMessage(messageId, {
      uploadProgress: progress,
      isUploading: progress < 100,
    });
  };

  /**
   * Update upload progress for a specific attachment
   */
  const updateAttachmentProgress = (
    messageId: string,
    attachmentIdOrIndex: string | number,
    progress: number,
  ) => {
    queryClient.setQueryData<ChatCacheData>(queryKey, (old) => {
      if (!old?.pages) return old;

      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => {
            if (m.id !== messageId) return m;

            // Found message, update specific attachment
            const updatedAttachments = m.attachments?.map((att, index) => {
              // Match by ID if string, or index if number
              const isMatch =
                typeof attachmentIdOrIndex === "number"
                  ? index === attachmentIdOrIndex
                  : att.id === attachmentIdOrIndex;

              if (isMatch) {
                return {
                  ...att,
                  isUploading: progress < 100,
                  uploadProgress: progress,
                };
              }
              return att;
            });

            // Also check if all attachments are done to update message-level status
            const allDone = updatedAttachments?.every(
              (a) => !a.isUploading || a.uploadProgress === 100,
            );

            return {
              ...m,
              attachments: updatedAttachments,
              // Optional: syncing message level progress
              isUploading: !allDone,
            };
          }),
        })),
      };
    });
  };

  /**
   * Invalidate and refetch messages
   */
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    // Read operations
    getMessages,
    getMessage,

    // Write operations
    addMessage,
    updateMessage,
    replaceMessage,
    removeMessage,
    markAsDeleted,

    // Status operations
    updateStatus,
    markAsSent,
    markAsFailed,
    updateUploadProgress,
    updateAttachmentProgress,

    // Query operations
    invalidate,
    queryKey,
  };
}

export type ChatStore = ReturnType<typeof useChatStore>;

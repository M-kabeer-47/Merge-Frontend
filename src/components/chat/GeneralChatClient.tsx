"use client";

import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocketChat } from "@/hooks/general-chat/use-websocket-chat";
import { useFetchMessages } from "@/hooks/general-chat/use-fetch-messages";
import useSendChatMessage from "@/hooks/general-chat/use-send-chat-message";
import {
  updateMessage as emitUpdateMessage,
  deleteForMe as emitDeleteForMe,
  deleteForEveryone as emitDeleteForEveryone,
} from "@/hooks/general-chat/use-socket-chat-events";
import MessageItem from "@/components/chat/MessageItem";
import MessageComposer from "@/components/chat/MesageComposer";
import { AttachmentFile } from "@/components/chat/AttachmentPreview";
import type { ChatMessage, FetchMessagesResponse } from "@/types/general-chat";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";

interface GeneralChatClientProps {
  roomId: string;
}

// Convert ChatMessage user to mock User format for existing UI components
interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

// Mock ChatMessage interface from UI components
interface MockChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  deletedForEveryone?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: {
    emoji: string;
    users: string[];
    count: number;
  }[];
  attachments?: {
    id: string;
    name: string;
    file: File;
    type: "image" | "file" | "link";
    url: string;
    size?: number;
    preview?: string;
    uploadProgress?: number;
    isUploading?: boolean;
  }[];
  seen?: boolean;
  seenBy?: string[];
  status?: "sending" | "sent" | "delivered" | "seen";
  uploadProgress?: number;
  isUploading?: boolean;
}

const GeneralChatClient: React.FC<GeneralChatClientProps> = ({ roomId }) => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const [editingMessage, setEditingMessage] = useState<
    ChatMessage | undefined
  >();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  // Use send message hook
  const { sendMessage: sendMessageWithUpload, isUploading } =
    useSendChatMessage();

  // Don't render until we have user info
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fetch messages with infinite scroll (React Query manages the data)
  const {
    messages: fetchedMessages,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchMessages({
    roomId,
    limit: 20,
  });

  // Messages from React Query - reversed for display (oldest first)
  const messages = [...fetchedMessages].reverse();

  // Helper to update React Query cache
  const updateMessagesCache = (
    updater: (messages: ChatMessage[]) => ChatMessage[],
  ) => {
    queryClient.setQueryData<{
      pages: FetchMessagesResponse[];
      pageParams: number[];
    }>(["general-chat", roomId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          if (index === 0) {
            // Update messages in first page (most recent)
            const allMessages = oldData.pages.flatMap((p) =>
              p.messages.map((m) => ({
                ...m,
                id: m.id,
                content: m.content,
              })),
            );
            // This is simplified - full implementation would properly update the cache
            return page;
          }
          return page;
        }),
      };
    });
  };

  // WebSocket connection (connection-only, events use cache)
  const {
    socket,
    isConnected,
    error: wsError,
  } = useWebSocketChat({
    roomId,
    onNewMessage: (message) => {
      console.log("📨 New message from WebSocket:", message);
      // Add to React Query cache
      queryClient.setQueryData<{
        pages: FetchMessagesResponse[];
        pageParams: number[];
      }>(["general-chat", roomId], (oldData) => {
        if (!oldData) return oldData;
        // Check if message already exists
        const allExistingIds = oldData.pages.flatMap((p) =>
          p.messages.map((m) => m.id),
        );
        if (allExistingIds.includes(message.id)) {
          return oldData;
        }
        // Add to first page (most recent messages)
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                messages: [
                  {
                    id: message.id,
                    content: message.content,
                    attachmentURL: message.attachments?.[0]?.url || null,
                    replyToId: message.replyToId,
                    isEdited: message.isEdited,
                    isDeletedForEveryone: message.deletedForEveryone,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    author: message.user,
                    room: { id: roomId },
                  },
                  ...page.messages,
                ],
                total: page.total + 1,
              };
            }
            return page;
          }),
        };
      });
    },
    onMessageUpdated: (message) => {
      console.log("✏️ Message updated from WebSocket:", message);
      queryClient.setQueryData<{
        pages: FetchMessagesResponse[];
        pageParams: number[];
      }>(["general-chat", roomId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) =>
              m.id === message.id
                ? {
                    ...m,
                    content: message.content,
                    isEdited: true,
                    updatedAt: message.updatedAt,
                  }
                : m,
            ),
          })),
        };
      });
    },
    onMessageDeleted: ({ messageId }) => {
      console.log("🗑️ Message deleted from WebSocket:", messageId);
      queryClient.setQueryData<{
        pages: FetchMessagesResponse[];
        pageParams: number[];
      }>(["general-chat", roomId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m.id !== messageId),
            total: page.total - 1,
          })),
        };
      });
    },
    onError: (error) => {
      console.error("❌ WebSocket error:", error);
      toast.error(error.error || "An error occurred");
    },
  });

  // Show WebSocket connection error
  useEffect(() => {
    if (wsError) {
      toast.error(wsError);
    }
  }, [wsError]);

  // Auto-scroll to bottom only on initial load or new message (not pagination)
  useEffect(() => {
    const prevLen = prevMessagesLength.current;
    const currLen = messages.length;
    prevMessagesLength.current = currLen;

    if (currLen > 0) {
      if (prevLen === 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
        return;
      }
      if (currLen - prevLen === 1) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages.length]);

  const handleSendMessage = async (
    content: string,
    replyToId?: string,
    attachments?: AttachmentFile[],
  ) => {
    if (!currentUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    try {
      await sendMessageWithUpload({
        roomId,
        content,
        replyToId,
        attachments,
        socket,
      });
      setReplyingTo(undefined);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find((m) => m.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(undefined);
  };

  const handleEdit = (messageId: string) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    if (messageToEdit) {
      setEditingMessage(messageToEdit);
      setReplyingTo(undefined);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(undefined);
  };

  const handleUpdateMessage = async (messageId: string, content: string) => {
    try {
      await emitUpdateMessage(socket, {
        messageId,
        roomId,
        content: content.trim(),
      });
      setEditingMessage(undefined);
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDeleteForMe = async (messageId: string) => {
    try {
      // Optimistically remove from cache
      queryClient.setQueryData<{
        pages: FetchMessagesResponse[];
        pageParams: number[];
      }>(["general-chat", roomId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m.id !== messageId),
          })),
        };
      });
      await emitDeleteForMe(socket, { messageId, roomId });
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
      // Refetch to restore state
      queryClient.invalidateQueries({ queryKey: ["general-chat", roomId] });
    }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this message for everyone?",
    );
    if (confirmed) {
      try {
        await emitDeleteForEveryone(socket, { messageId, roomId });
        toast.success("Message deleted for everyone");
      } catch (error) {
        console.error("Failed to delete message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const convertToMockUser = (messageUser: MessageUser) => ({
    id: messageUser.id,
    name: `${messageUser.firstName} ${messageUser.lastName}`,
    initials: `${messageUser.firstName[0]}${messageUser.lastName[0]}`,
    role: "student" as const,
    isOnline: true,
    avatar: messageUser.image || undefined,
  });

  const convertToMockMessage = (message: ChatMessage): MockChatMessage => ({
    id: message.id,
    userId: message.userId,
    content: message.content,
    timestamp: new Date(message.createdAt),
    edited: message.isEdited,
    deletedForEveryone: message.deletedForEveryone,
    replyTo: message.replyToId || undefined,
    reactions: [],
    attachments: message.attachments.map((att) => ({
      id: att.id,
      name: att.name,
      type: att.type,
      url: att.url,
      size: att.size,
      preview: att.preview,
      uploadProgress: att.uploadProgress,
      isUploading: att.isUploading,
      file: new File([], att.name, { type: "application/octet-stream" }),
    })),
    seen: message.seen,
    status: message.status === "failed" ? "sent" : message.status,
    uploadProgress: message.uploadProgress,
    isUploading: message.isUploading,
  });

  return (
    <div className="flex flex-col h-full bg-main-background">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          ⚠️ Connecting to chat server...
        </div>
      )}

      {/* Scrollable Chat Container with InfiniteScroll */}
      <div
        id="scrollableDiv"
        ref={scrollContainerRef}
        className="h-[500px] overflow-y-auto relative flex flex-col-reverse"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchNextPage}
          hasMore={!!hasMore}
          loader={
            <div className="py-4 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-sm text-para-muted mt-2">
                  Loading older messages...
                </p>
              </div>
            </div>
          }
          endMessage={
            messages.length > 0 ? (
              <div className="py-4 flex justify-center">
                <p className="text-sm text-para-muted">
                  Beginning of conversation
                </p>
              </div>
            ) : null
          }
          scrollableTarget="scrollableDiv"
          inverse={true}
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {/* Messages List */}
          <div className="space-y-0 py-5 px-4 pb-[20px]">
            {messages.map((message) => {
              const user = convertToMockUser(message.user);
              const mockMessage = convertToMockMessage(message);
              const replyToMessage = message.replyToId
                ? messages.find((m) => m.id === message.replyToId)
                : undefined;
              const replyToUser = replyToMessage
                ? convertToMockUser(replyToMessage.user)
                : undefined;
              const mockReplyToMessage = replyToMessage
                ? convertToMockMessage(replyToMessage)
                : undefined;

              return (
                <MessageItem
                  key={message.id}
                  ref={(el) => {
                    messageRefs.current[message.id] = el;
                  }}
                  message={mockMessage}
                  user={user}
                  replyToMessage={mockReplyToMessage}
                  replyToUser={replyToUser}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDeleteForMe={handleDeleteForMe}
                  onDeleteForEveryone={handleDeleteForEveryone}
                  onScrollToMessage={scrollToMessage}
                  currentUserId={currentUser?.id || ""}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </InfiniteScroll>
      </div>

      {/* Message Composer - outside scroll container */}
      <div className="bg-main-background border-t border-light-border">
        <MessageComposer
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo ? convertToMockMessage(replyingTo) : undefined}
          replyingToUser={
            replyingTo ? convertToMockUser(replyingTo.user) : undefined
          }
          onCancelReply={handleCancelReply}
          editingMessage={
            editingMessage ? convertToMockMessage(editingMessage) : undefined
          }
          onCancelEdit={handleCancelEdit}
          onUpdateMessage={handleUpdateMessage}
        />
      </div>
    </div>
  );
};

export default GeneralChatClient;

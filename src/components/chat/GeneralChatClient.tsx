"use client";

import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useWebSocketChat } from "@/hooks/general-chat/use-websocket-chat";
import { useFetchMessages } from "@/hooks/general-chat/use-fetch-messages";
import useSendChatMessage from "@/hooks/general-chat/use-send-chat-message";
import { useChatStore } from "@/hooks/general-chat/use-chat-store";
import {
  updateMessage as emitUpdateMessage,
  deleteForMe as emitDeleteForMe,
  deleteForEveryone as emitDeleteForEveryone,
} from "@/hooks/general-chat/use-socket-chat-events";
import MessageItem from "@/components/chat/MessageItem";
import MessageSkeleton from "@/components/chat/MessageSkeleton";
import MessageComposer from "@/components/chat/MesageComposer";
import { AttachmentFile } from "@/components/chat/AttachmentPreview";
import type { ChatMessage } from "@/types/general-chat";
import { enhanceUser } from "@/types/general-chat";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { tryIt } from "@/utils/try-it";

interface GeneralChatClientProps {
  roomId: string;
}

const GeneralChatClient: React.FC<GeneralChatClientProps> = ({ roomId }) => {
  const { user: currentUser } = useAuth();
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const [editingMessage, setEditingMessage] = useState<
    ChatMessage | undefined
  >();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(0);

  // Chat store for cache operations
  const { removeMessage } = useChatStore(roomId);

  // Send message hook with optimistic updates
  const { sendMessage: sendMessageWithUpload } = useSendChatMessage(roomId);

  // Fetch messages with infinite scroll
  const {
    messages: fetchedMessages,
    hasMore,
    isLoading,
    fetchNextPage,
  } = useFetchMessages({
    roomId,
    limit: 20,
  });

  // Messages reversed for display (oldest first)
  const messages = [...fetchedMessages].reverse();

  // WebSocket connection - handles cache updates internally via useChatStore
  const { socket, isConnected, error: wsError } = useWebSocketChat({ roomId });

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

  // Don't render until we have user info
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSendMessage = async (
    content: string,
    replyToId?: string,
    attachments?: AttachmentFile[],
  ) => {
    if (!currentUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    const [, error] = await tryIt(
      sendMessageWithUpload({
        content,
        replyToId,
        attachments,
        socket,
      }),
    );

    if (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } else {
      setReplyingTo(undefined);
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
    const [, error] = await tryIt(
      emitUpdateMessage(socket, {
        messageId,
        roomId,
        content: content.trim(),
      }),
    );

    if (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
      return;
    }

    setEditingMessage(undefined);
  };

  const handleDeleteForMe = async (messageId: string) => {
    // Optimistically remove from cache
    removeMessage(messageId);

    const [, error] = await tryIt(
      emitDeleteForMe(socket, { messageId, roomId }),
    );

    if (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this message for everyone?",
    );
    if (!confirmed) return;

    const [, error] = await tryIt(
      emitDeleteForEveryone(socket, { messageId, roomId }),
    );

    if (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
      return;
    }

    toast.success("Message deleted for everyone");
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
              const user = enhanceUser(message.user);
              const replyToMessage = message.replyToId
                ? messages.find((m) => m.id === message.replyToId)
                : undefined;
              const replyToUser = replyToMessage
                ? enhanceUser(replyToMessage.user)
                : undefined;

              return (
                <MessageItem
                  key={message.id}
                  ref={(el) => {
                    messageRefs.current[message.id] = el;
                  }}
                  message={message}
                  user={user}
                  replyToMessage={replyToMessage}
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
          replyingTo={replyingTo}
          replyingToUser={replyingTo ? enhanceUser(replyingTo.user) : undefined}
          onCancelReply={handleCancelReply}
          editingMessage={editingMessage}
          onCancelEdit={handleCancelEdit}
          onUpdateMessage={handleUpdateMessage}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteDialog.isOpen}
        onClose={() =>
          setConfirmDeleteDialog({ isOpen: false, messageId: null })
        }
        onConfirm={confirmDeleteForEveryone}
        title="Delete Message"
        message="This message will be permanently deleted for everyone."
        itemName="Are you sure you want to delete this message"
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default GeneralChatClient;

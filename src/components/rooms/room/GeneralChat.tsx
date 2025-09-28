// File: src/components/rooms/chat/GeneralChat.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  mockMessages,
  mockUsers,
  ChatMessage,
  currentUserId,
} from "@/lib/constants/mockChatData";
import MessageItem from "@/components/chat/MessageItem";
import MessageComposer from "@/components/chat/MesageComposer";

const GeneralChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, replyToId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      content,
      timestamp: new Date(),
      replyTo: replyToId,
      reactions: [],
    };

    setMessages((prev) => [...prev, newMessage]);
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

  const handleReaction = (messageId: string, emoji: string) => {
    console.log("Reaction added:", { messageId, emoji }); // Better than alert

    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          // Create a new message object to avoid mutation
          const updatedMessage = { ...message };
          const existingReaction = updatedMessage.reactions.find(
            (r) => r.emoji === emoji
          );

          if (existingReaction) {
            // Toggle user's reaction
            const userIndex = existingReaction.users.indexOf(currentUserId);
            if (userIndex > -1) {
              // Remove reaction - create new arrays to avoid mutation
              existingReaction.users = existingReaction.users.filter(
                (id) => id !== currentUserId
              );
              existingReaction.count--;

              // Remove reaction if no users left
              if (existingReaction.count === 0) {
                updatedMessage.reactions = updatedMessage.reactions.filter(
                  (r) => r.emoji !== emoji
                );
              }
            } else {
              // Add reaction
              existingReaction.users = [
                ...existingReaction.users,
                currentUserId,
              ];
              existingReaction.count++;
            }
          } else {
            // Add new reaction
            updatedMessage.reactions = [
              ...updatedMessage.reactions,
              {
                emoji,
                users: [currentUserId],
                count: 1,
              },
            ];
          }

          return updatedMessage;
        }
        return message;
      })
    );
  };

  // Function to scroll to a specific message
  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add a brief highlight effect
      messageElement.style.border = "2px solid var(--heading)";
      setTimeout(() => {
        messageElement.style.border = "";
      }, 2000);
    }
  };

  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  return (
    <div className="flex flex-col h-full bg-main-background pb-[80px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message */}

        {/* Messages List */}
        <div className="space-y-0 py-5 px-4">
          {messages.map((message) => {
            const user = getUserById(message.userId);
            const replyToMessage = message.replyTo
              ? messages.find((m) => m.id === message.replyTo)
              : undefined;
            const replyToUser = replyToMessage
              ? getUserById(replyToMessage.userId)
              : undefined;

            if (!user) return null;

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
                onReaction={handleReaction}
                onScrollToMessage={scrollToMessage}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 bg-background border-t border-light-border w-full">
        <MessageComposer
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo}
          replyingToUser={
            replyingTo ? getUserById(replyingTo.userId) : undefined
          }
          onCancelReply={handleCancelReply}
        />
      </div>
      {/* Message Composer */}
    </div>
  );
};

export default GeneralChat;

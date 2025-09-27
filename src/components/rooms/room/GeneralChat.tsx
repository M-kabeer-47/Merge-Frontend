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
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const existingReaction = message.reactions.find(
            (r) => r.emoji === emoji
          );

          if (existingReaction) {
            // Toggle user's reaction
            const userIndex = existingReaction.users.indexOf(currentUserId);
            if (userIndex > -1) {
              // Remove reaction
              existingReaction.users.splice(userIndex, 1);
              existingReaction.count--;
              // Remove reaction if no users left
              if (existingReaction.count === 0) {
                message.reactions = message.reactions.filter(
                  (r) => r.emoji !== emoji
                );
              }
            } else {
              // Add reaction
              existingReaction.users.push(currentUserId);
              existingReaction.count++;
            }
          } else {
            // Add new reaction
            message.reactions.push({
              emoji,
              users: [currentUserId],
              count: 1,
            });
          }
        }
        return message;
      })
    );
  };

  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message */}
        <div className="px-6 py-4 border-b border-light-border bg-gray-50/50">
          <h3 className="font-semibold text-heading mb-1">
            Welcome to General Chat
          </h3>
          <p className="text-sm text-para-muted">
            This is where you can chat with other participants in the room. Be
            respectful and keep discussions relevant to the course.
          </p>
        </div>

        {/* Messages List */}
        <div className="space-y-0">
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
                message={message}
                user={user}
                replyToMessage={replyToMessage}
                replyToUser={replyToUser}
                onReply={handleReply}
                onReaction={handleReaction}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        replyingToUser={replyingTo ? getUserById(replyingTo.userId) : undefined}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
};

export default GeneralChat;

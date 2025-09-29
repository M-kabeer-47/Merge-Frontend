// File: src/components/chat/MessageItem.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  User,
  currentUserId,
} from "@/lib/constants/mock-chat-data";
import MessageHeader from "./MessageHeader";
import MessageAvatar from "./MessageAvatar";
import RepliedMessage from "./RepliedMessage";
import MessageAttachments from "./MessageAttachments";
import MessageOptions from "./MessageOptions";

interface MessageItemProps {
  message: ChatMessage;
  user: User;
  replyToMessage?: ChatMessage;
  replyToUser?: User;
  onReply: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
  ref: React.Ref<HTMLDivElement> | null;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  user,
  replyToMessage,
  replyToUser,
  onReply,
  onScrollToMessage,
  ref,
}) => {
  const isOwnMessage = message.userId === currentUserId;

  // Close emoji picker when clicking outside

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (replyToMessage) {
      onScrollToMessage(replyToMessage.id);
    }
  };

  return (
    <div
      className={`group flex gap-3 py-4 px-4 min-h-fit rounded-xl sm:max-w-5xl max-w-sm mb-6 transition-colors duration-200 relative ${
        isOwnMessage ? "bg-primary ml-auto " : "bg-secondary/10"
      }`}
      ref={ref}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <MessageAvatar user={user} isOwnMessage={isOwnMessage} />
      )}

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Message Header */}
        <MessageHeader
          user={user}
          message={message}
          isOwnMessage={isOwnMessage}
        />

        {/* Reply Context - Fixed click handling */}
        {replyToMessage && replyToUser && (
          <RepliedMessage
            isOwnMessage={isOwnMessage}
            replyToMessage={replyToMessage}
            replyToUser={replyToUser}
            handleReplyClick={handleReplyClick}
          />
        )}

        {/* Message Text */}
        <div
          className={`text-sm leading-relaxed mb-2 whitespace-pre-wrap ${
            isOwnMessage ? "text-white/95" : "text-para"
          }`}
        >
          {message.content}
        </div>

        {/* Attachments */}
        <MessageAttachments message={message} isOwnMessage={isOwnMessage} />

        {/* Reactions */}

        {/* Message Actions */}
        <MessageOptions
          isOwnMessage={isOwnMessage}
          onReply={onReply}
          message={message}
        />
      </div>
    </div>
  );
};

export default MessageItem;

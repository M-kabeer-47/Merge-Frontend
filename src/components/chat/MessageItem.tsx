// File: src/components/chat/MessageItem.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ChatMessage,
  User,
} from "@/lib/constants/mock-chat-data";
import MessageHeader from "./MessageHeader";
import MessageAvatar from "./MessageAvatar";
import RepliedMessage from "./RepliedMessage";
import MessageAttachments from "./MessageAttachments";
import MessageOptions from "./MessageOptions";
import { Check, CheckCheck, Loader2 } from "lucide-react";

// import check, checkcheck from tabler-icons-react

interface MessageItemProps {
  message: ChatMessage;
  user: User;
  replyToMessage?: ChatMessage;
  replyToUser?: User;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDeleteForMe: (messageId: string) => void;
  onDeleteForEveryone: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
  currentUserId: string;
  ref: React.Ref<HTMLDivElement> | null;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  user,
  replyToMessage,
  replyToUser,
  onReply,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
  onScrollToMessage,
  currentUserId,
  ref,
}) => {
  const isOwnMessage = message.userId === currentUserId;

  // Format time
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

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
        isOwnMessage ? "bg-primary/90 ml-auto " : "bg-secondary/5"
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

        {/* Time and Seen Status */}
        <div
          className={`flex items-center gap-1 mt-1 justify-end 
        `}
        >
          <span
            className={`text-xs ${
              isOwnMessage ? "text-white/60" : "text-para-muted"
            }`}
          >
            {formatTime(message.timestamp)}
          </span>

          {/* Status - Only show for own messages */}
          {isOwnMessage && (
            <span className="ml-1">
              {message.status === "sending" || message.isUploading === true ? (
                <Loader2 className="h-3.5 w-3.5 text-background animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 text-white/60" />
              )}
            </span>
          )}
        </div>

        {/* Reactions */}

        {/* Message Actions */}
        <MessageOptions
          isOwnMessage={isOwnMessage}
          onReply={onReply}
          onEdit={onEdit}
          onDeleteForMe={onDeleteForMe}
          onDeleteForEveryone={onDeleteForEveryone}
          message={message}
        />
      </div>
    </div>
  );
};

export default MessageItem;

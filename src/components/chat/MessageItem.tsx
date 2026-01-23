// File: src/components/chat/MessageItem.tsx
import React from "react";
import type { ChatMessage, ChatUser } from "@/types/general-chat";
import MessageHeader from "./MessageHeader";
import MessageAvatar from "./MessageAvatar";
import RepliedMessage from "./RepliedMessage";
import MessageAttachments from "./MessageAttachments";
import MessageOptions from "./MessageOptions";
import { Check, Loader2, AlertCircle, RotateCcw } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
  user?: ChatUser | null;
  replyToMessage?: ChatMessage;
  replyToUser?: ChatUser | null;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDeleteForMe: (messageId: string) => void;
  onDeleteForEveryone: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
  onRetry?: (message: ChatMessage) => void;
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
  onRetry,
  currentUserId,
  ref,
}) => {
  // Use isMine from API if available, otherwise compare userId (for WebSocket messages)
  const isOwnMessage = message.isMine ?? message.userId === currentUserId;
  const isFailed = message.status === "failed";
  const isSending = message.status === "sending" || message.isUploading;

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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
      } ${isFailed ? "opacity-70 border border-red-500/50" : ""}`}
      ref={ref}
    >
      {/* Edited label in top right */}
      {message.isEdited && !message.isDeleted && (
        <span
          className="absolute top-2 right-4 text-xs text-white/80 select-none pointer-events-none"
          style={{ zIndex: 2 }}
        >
          (Edited)
        </span>
      )}

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
          } ${message.content === "This message was deleted" ? "italic opacity-70" : ""}`}
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
            {formatTime(message.createdAt)}
          </span>

          {/* Status - Only show for own messages */}
          {isOwnMessage && (
            <span className="ml-1 flex items-center gap-1">
              {isFailed ? (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  {onRetry && (
                    <button
                      onClick={() => onRetry(message)}
                      className="ml-1 p-0.5 hover:bg-white/10 rounded"
                      title="Retry sending"
                    >
                      <RotateCcw className="h-3 w-3 text-red-400 hover:text-white" />
                    </button>
                  )}
                </>
              ) : isSending ? (
                <Loader2 className="h-3.5 w-3.5 text-background animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 text-white/60" />
              )}
            </span>
          )}
        </div>

        {/* Failed message indicator */}
        {isFailed && (
          <div className="text-xs text-red-400 mt-1">
            Failed to send. {onRetry ? "Tap to retry." : ""}
          </div>
        )}

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

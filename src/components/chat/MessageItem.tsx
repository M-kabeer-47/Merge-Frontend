// File: src/components/chat/MessageItem.tsx
import React from "react";
import { ChatMessage, User, currentUserId } from "@/lib/constants/mockChatData";
import { Reply, MoreHorizontal, Smile, FileText, Download } from "lucide-react";
import { format } from "date-fns";

interface MessageItemProps {
  message: ChatMessage;
  user: User;
  replyToMessage?: ChatMessage;
  replyToUser?: User;
  onReply: (messageId: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  user,
  replyToMessage,
  replyToUser,
  onReply,
  onReaction,
}) => {
  const isOwnMessage = message.userId === currentUserId;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return isOwnMessage ? "text-white" : "text-primary";
      case "admin":
        return isOwnMessage ? "text-white" : "text-accent";
      default:
        return isOwnMessage ? "text-white" : "text-heading";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className={`group flex gap-3 py-3 px-6 min-h-[120px] rounded-xl max-w-5xl mb-6 transition-colors duration-200 ${
        isOwnMessage ? "bg-primary/90 ml-auto " : "bg-secondary/5"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isOwnMessage ? "bg-white/20" : "bg-primary/10"
            }`}
          >
            <span
              className={`text-xs font-medium ${
                isOwnMessage ? "text-white" : "text-primary"
              }`}
            >
              {user.initials}
            </span>
          </div>
        )}
        {user.isOnline && (
          <div
            className={`w-3 h-3 bg-green-500 rounded-full border-2 border-background -mt-2 ml-6`}
          ></div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Message Header */}
        <div
          className={`flex items-baseline gap-2 mb-1 ${
            isOwnMessage ? "" : ""
          }`}
        >
          <span className={`font-semibold text-sm ${getRoleColor(user.role)}`}>
            {isOwnMessage ? "You" : user.name}
          </span>
          {user.role === "instructor" && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                isOwnMessage
                  ? "bg-white/20 text-white"
                  : "bg-primary/10 text-primary"
              }`}
            >
              Instructor
            </span>
          )}
          {user.role === "admin" && (
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                isOwnMessage
                  ? "bg-white/20 text-white"
                  : "bg-accent/10 text-accent"
              }`}
            >
              Admin
            </span>
          )}
          <span
            className={`text-xs ${
              isOwnMessage ? "text-white/70" : "text-para-muted"
            }`}
          >
            {/* {format(message.timestamp, { addSuffix: true })} */}
          </span>
          {message.edited && (
            <span
              className={`text-xs ${
                isOwnMessage ? "text-white/70" : "text-para-muted"
              }`}
            >
              (edited)
            </span>
          )}
        </div>

        {/* Reply Context */}
        {replyToMessage && replyToUser && (
          <div
            className={`mb-2 p-3 rounded-md py-1 ${
              isOwnMessage
                ? "border-r-2 border-white/30 bg-white/10 "
                : "border-l-2 border-gray-200 bg-gray-50/50"
            }`}
          >
            <div
              className={`text-xs mb-1 ${
                isOwnMessage ? "text-white/80" : "text-para-muted"
              }`}
            >
              Replying to{" "}
              <span
                className={`font-medium ${
                  isOwnMessage ? "text-white" : "text-heading"
                }`}
              >
                {replyToUser.name}
              </span>
            </div>
            <div
              className={`text-sm line-clamp-2 ${
                isOwnMessage ? "text-white/90" : "text-para"
              }`}
            >
              {replyToMessage.content}
            </div>
          </div>
        )}

        {/* Message Text */}
        <div
          className={`text-sm leading-relaxed mb-2 whitespace-pre-wrap ${
            isOwnMessage ? "text-white" : "text-para"
          }`}
        >
          {message.content}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={`mb-2 space-y-2 ${
              isOwnMessage ? "flex flex-col items-end" : ""
            }`}
          >
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`flex items-center gap-3 p-3 rounded-lg border w-fit ${
                  isOwnMessage
                    ? "bg-white/10 border-white/20"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <FileText
                  className={`h-5 w-5 ${
                    isOwnMessage ? "text-white" : "text-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium truncate ${
                      isOwnMessage ? "text-white" : "text-heading"
                    }`}
                  >
                    {attachment.name}
                  </div>
                  {attachment.size && (
                    <div
                      className={`text-xs ${
                        isOwnMessage ? "text-white/70" : "text-para-muted"
                      }`}
                    >
                      {formatFileSize(attachment.size)}
                    </div>
                  )}
                </div>
                <button
                  className={`p-1 rounded transition-colors ${
                    isOwnMessage ? "hover:bg-white/20" : "hover:bg-gray-200"
                  }`}
                >
                  <Download
                    className={`h-4 w-4 ${
                      isOwnMessage ? "text-white/80" : "text-para-muted"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div
            className={`flex items-center gap-1 mb-2 ${
              isOwnMessage ? "justify-end" : ""
            }`}
          >
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReaction(message.id, reaction.emoji)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors ${
                  reaction.users.includes(currentUserId)
                    ? isOwnMessage
                      ? "bg-white/20 border-white/30 text-white"
                      : "bg-primary/10 border-primary/20 text-primary"
                    : isOwnMessage
                    ? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                    : "bg-gray-50 border-gray-200 text-para-muted hover:bg-gray-100"
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div
          className={`flex items-center gap-1 opacity-100 transition-opacity ${
            isOwnMessage ? "justify-end" : ""
          }`}
        >
          <button
            onClick={() => onReply(message.id)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              isOwnMessage
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-para-muted hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>
          <button
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              isOwnMessage
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-para-muted hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Smile className="h-3 w-3" />
            React
          </button>
          <button
            className={`p-1 rounded transition-colors ${
              isOwnMessage
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-para-muted hover:text-heading hover:bg-gray-100"
            }`}
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

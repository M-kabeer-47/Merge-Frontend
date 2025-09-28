// File: src/components/chat/MessageItem.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, User, currentUserId } from "@/lib/constants/mockChatData";
import { Reply, MoreHorizontal, Smile, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/EmojiPicker";
import MessageHeader from "./MessageHeader";
import MessageAvatar from "./MessageAvatar";
import RepliedMessage from "./RepliedMessage";

interface MessageItemProps {
  message: ChatMessage;
  user: User;
  replyToMessage?: ChatMessage;
  replyToUser?: User;
  onReply: (messageId: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onScrollToMessage: (messageId: string) => void;
  ref: React.Ref<HTMLDivElement> | null;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  user,
  replyToMessage,
  replyToUser,
  onReply,
  onReaction,
  onScrollToMessage,
  ref,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isOwnMessage = message.userId === currentUserId;

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (replyToMessage) {
      onScrollToMessage(replyToMessage.id);
    }
  };

  // Fixed emoji selection handler
  const handleEmojiSelect = (emojiData: any) => {
    // Handle different possible emoji data structures
    let emojiString = "";

    if (typeof emojiData === "string") {
      emojiString = emojiData;
    } else if (emojiData?.emoji) {
      emojiString = emojiData.emoji;
    } else if (emojiData?.native) {
      emojiString = emojiData.native;
    } else if (emojiData?.unified) {
      // Convert unified code to emoji if needed
      emojiString = String.fromCodePoint(
        ...emojiData.unified.split("-").map((hex: string) => parseInt(hex, 16))
      );
    }

    alert("Emoji selected:" + JSON.stringify({ emojiData, emojiString })); // Debug log

    if (emojiString) {
      onReaction(message.id, emojiString);
      setShowEmojiPicker(false);
    } else {
      console.warn("Could not extract emoji from data:", emojiData);
    }
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
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
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={`mb-2 space-y-2 ${
              isOwnMessage ? "flex flex-col items-end" : ""
            }`}
          >
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`flex items-center gap-3 p-3 rounded-lg  w-fit ${
                  isOwnMessage
                    ? "bg-white/10 border-white/20"
                    : "bg-secondary/15"
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
                <button className="p-1 rounded transition-colors">
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
            className={`flex items-center gap-1 mb-2 flex-wrap ${
              isOwnMessage ? "justify-end" : ""
            }`}
          >
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onReaction(message.id, reaction.emoji);
                }}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-colors bg-primary/15 text-heading`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div
          className={`flex items-center gap-1 opacity-100 transition-opacity relative ${
            isOwnMessage ? "justify-end" : ""
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReply(message.id);
            }}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
              isOwnMessage
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-para-muted hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>

          {/* React Button with Emoji Picker */}
          <div className="relative">
            <button
              onClick={toggleEmojiPicker}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                isOwnMessage
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-para-muted hover:text-primary hover:bg-primary/5"
              } ${
                showEmojiPicker
                  ? isOwnMessage
                    ? "bg-white/10"
                    : "bg-primary/5"
                  : ""
              }`}
            >
              <Smile className="h-3 w-3" />
              React
            </button>

            {/* Emoji Picker Popup - Fixed positioning and event handling */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className={`absolute z-[60] top-[35px] ${
                  isOwnMessage ? "right-0" : "left-0"
                } shadow-xl border border-border rounded-lg bg-background overflow-hidden`}
                style={{ width: "280px", height: "400px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker onEmojiSelect={handleEmojiSelect}>
                  <EmojiPickerSearch placeholder="Search emojis..." />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </div>
            )}
          </div>

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

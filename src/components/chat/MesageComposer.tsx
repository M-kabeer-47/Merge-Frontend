// File: src/components/rooms/chat/MessageComposer.tsx
import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, X, AtSign } from "lucide-react";
import { ChatMessage, User } from "@/lib/constants/mockChatData";

interface MessageComposerProps {
  onSendMessage: (content: string, replyToId?: string) => void;
  replyingTo?: ChatMessage;
  replyingToUser?: User;
  onCancelReply: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  replyingTo,
  replyingToUser,
  onCancelReply,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), replyingTo?.id);
      setMessage("");
      if (replyingTo) {
        onCancelReply();
      }
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="border-t border-light-border bg-main-background w-full ">
      {/* Reply Context */}
      {replyingTo && replyingToUser && (
        <div className="px-6 py-3 ">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-para-muted mb-1">
                Replying to{" "}
                <span className="font-medium text-heading">
                  {replyingToUser.name}
                </span>
              </div>
              <div className="text-sm text-para line-clamp-2">
                {replyingTo.content}
              </div>
            </div>
            <button
              onClick={onCancelReply}
              className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
            >
              <X className="h-4 w-4 text-heading relative right-[70px] " />
            </button>
          </div>
        </div>
      )}

      {/* Composer */}
      <div className="px-4 py-3 ">
        <div className="flex items-center gap-3">
          {/* Message Input */}
          <div className="w-[93%] relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="text-para w-full px-4 py-3 pr-12 border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none overflow-hidden min-h-[44px] max-h-[120px] text-sm"
              rows={1}
            />

            {/* Inline Actions */}
            <div className="absolute right-2 bottom-4 flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Paperclip className="h-4 w-4 text-para-muted" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <AtSign className="h-4 w-4 text-para-muted" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <Smile className="h-4 w-4 text-para-muted" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`px-3.5 py-3 h-[42px] rounded-lg relative top-[-5px] transition-all duration-200 ${
              message.trim()
                ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                : "bg-primary/50 text-white cursor-not-allowed"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Helper Text */}
      </div>
    </div>
  );
};

export default MessageComposer;

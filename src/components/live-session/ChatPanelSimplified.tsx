/**
 * ChatPanel Component - Simplified for Sidebar Integration
 * 
 * Displays chat messages with upvoting and bot integration.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  ThumbsUp,
  Bot,
  Sparkles,
  MoreVertical,
  Trash2,
  Pin,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import type { ChatMessage } from "@/types/live-session";

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage?: (content: string, askBot: boolean) => void;
  onUpvoteMessage?: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onPinMessage?: (messageId: string) => void;
}

export default function ChatPanel({
  messages,
  currentUserId,
  onSendMessage,
  onUpvoteMessage,
  onDeleteMessage,
  onPinMessage,
}: ChatPanelProps) {
  const [messageInput, setMessageInput] = useState("");
  const [askBot, setAskBot] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput, askBot);
      setMessageInput("");
      setAskBot(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="space-y-2">
              {/* User Message */}
              <div className="group relative">
                <div className="flex items-start gap-2">
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {message.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-heading">
                        {message.senderName}
                      </span>
                      <span className="text-[10px] text-para-muted">
                        {formatDistanceToNow(message.timestamp, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-para whitespace-pre-wrap break-words leading-relaxed">
                      {message.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => onUpvoteMessage?.(message.id)}
                        className={`
                          flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-colors
                          ${
                            message.upvotes > 0
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-gray-100 text-para-muted"
                          }
                        `}
                        title="Upvote this message"
                      >
                        <ThumbsUp
                          className={`w-3 h-3 ${message.upvotes > 0 ? "fill-current" : ""}`}
                        />
                        {message.upvotes > 0 && message.upvotes}
                      </button>
                    </div>
                  </div>

                  {/* More Menu */}
                  <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setShowMenu(showMenu === message.id ? null : message.id)
                      }
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="More actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5 text-para" />
                    </button>

                    {showMenu === message.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-light-border rounded-lg shadow-xl py-1 min-w-[140px]">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.message);
                              setShowMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-para hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              onPinMessage?.(message.id);
                              setShowMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-para hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pin className="w-3.5 h-3.5" />
                            Pin
                          </button>
                          {message.senderId === currentUserId && (
                            <>
                              <div className="h-px bg-light-border my-1" />
                              <button
                                onClick={() => {
                                  onDeleteMessage?.(message.id);
                                  setShowMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/5 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bot Reply (if exists) */}
              {message.botReply && (
                <div className="ml-9 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-primary rounded">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      AI Assistant
                    </span>
                  </div>
                  <p className="text-xs text-para whitespace-pre-wrap leading-relaxed">
                    {message.botReply.content}
                  </p>
                  {message.botReply.sources && message.botReply.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-primary/10">
                      <p className="text-[10px] text-para-muted mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.botReply.sources.map((source: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-white/50 rounded text-[10px] text-para"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Send className="w-6 h-6 text-para-muted" />
            </div>
            <p className="text-sm text-para font-medium">No messages yet</p>
            <p className="text-xs text-para-muted mt-1">Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="p-3 border-t border-light-border bg-gray-50">
        {/* Ask Bot Toggle */}
        <label className="flex items-center gap-2 mb-2 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={askBot}
              onChange={(e) => setAskBot(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-primary transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${askBot ? "text-primary" : "text-para-muted"}`} />
            <span className={`text-xs font-medium ${askBot ? "text-primary" : "text-para"}`}>
              Ask AI Assistant
            </span>
          </div>
        </label>

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-3 py-2 bg-white border border-light-border rounded-lg text-sm text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            style={{ minHeight: "36px", maxHeight: "80px" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0"
            aria-label="Send message"
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

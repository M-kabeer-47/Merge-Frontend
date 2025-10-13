/**
 * ChatPanel Component
 * 
 * Displays chat messages with upvoting functionality and bot integration.
 * Includes tabs for Messages and Bot Answers.
 */

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Send,
  ThumbsUp,
  Bot,
  MessageSquare,
  Sparkles,
  Search,
  MoreVertical,
  Trash2,
  Pin,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import type { ChatMessage, BotReply } from "@/types/live-session";

interface ChatPanelProps {
  messages: ChatMessage[];
  botReplies?: BotReply[];
  currentUserId: string;
  onSendMessage?: (content: string, askBot: boolean) => void;
  onUpvoteMessage?: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onPinMessage?: (messageId: string) => void;
  topVotedMessageId?: string;
}

type TabType = "messages" | "bot-answers";

export default function ChatPanel({
  messages,
  botReplies = [],
  currentUserId,
  onSendMessage,
  onUpvoteMessage,
  onDeleteMessage,
  onPinMessage,
  topVotedMessageId,
}: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const [messageInput, setMessageInput] = useState("");
  const [askBot, setAskBot] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sort messages: top voted first, then by timestamp
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.id === topVotedMessageId) return -1;
      if (b.id === topVotedMessageId) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [messages, topVotedMessageId]);

  // Extract bot replies from messages
  const extractedBotReplies = useMemo(() => {
    const replies: BotReply[] = [];
    messages.forEach((msg) => {
      if (msg.botReply) {
        replies.push(msg.botReply);
      }
    });
    return replies;
  }, [messages]);

  // Use extracted replies if botReplies prop is empty
  const displayBotReplies = botReplies.length > 0 ? botReplies : extractedBotReplies;

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
    <div className="h-full flex flex-col bg-white">
      {/* Header with Tabs */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-light-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("messages")}
            className={`
              flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all
              flex items-center justify-center gap-2 relative
              ${
                activeTab === "messages"
                  ? "bg-primary text-white shadow-md"
                  : "text-para hover:bg-white/50"
              }
            `}
          >
            <MessageSquare className="w-4 h-4" />
            Messages
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === "messages" ? "bg-white/20" : "bg-secondary/10"}`}>
              {messages.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("bot-answers")}
            className={`
              flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all
              flex items-center justify-center gap-2 relative
              ${
                activeTab === "bot-answers"
                  ? "bg-primary text-white shadow-md"
                  : "text-para hover:bg-white/50"
              }
            `}
          >
            <Bot className="w-4 h-4" />
            Bot Answers
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === "bot-answers" ? "bg-white/20" : "bg-secondary/10"}`}>
              {displayBotReplies.length}
            </span>
          </button>
        </div>
      </div>

      {/* Messages List or Bot Answers */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activeTab === "messages" ? (
          sortedMessages.length > 0 ? (
            sortedMessages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* User Message */}
                <div className={`group relative ${
                  message.id === topVotedMessageId 
                    ? "p-3 bg-secondary/5 border-2 border-primary/30 rounded-xl" 
                    : ""
                }`}>
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
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
                        <span className="text-sm font-semibold text-heading">
                          {message.senderName}
                        </span>
                        {message.id === topVotedMessageId && (
                          <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 fill-current" />
                            TOP VOTED
                          </span>
                        )}
                        <span className="text-xs text-para-muted">
                          {formatDistanceToNow(message.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-para whitespace-pre-wrap break-words">
                        {message.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpvoteMessage?.(message.id)}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors
                            ${
                              message.upvotes > 0
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/5 text-para hover:bg-secondary/10"
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
                        className="p-1 hover:bg-secondary/10 rounded transition-colors"
                        aria-label="More actions"
                      >
                        <MoreVertical className="w-4 h-4 text-para" />
                      </button>

                      {showMenu === message.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 bg-main-background border border-light-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(message.message);
                                setShowMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              Copy
                            </button>
                            <button
                              onClick={() => {
                                onPinMessage?.(message.id);
                                setShowMenu(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-para hover:bg-secondary/10 flex items-center gap-2"
                            >
                              <Pin className="w-4 h-4" />
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
                                  className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
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
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-12 h-12 text-para-muted mb-3" />
              <p className="text-para font-medium">No messages yet</p>
              <p className="text-sm text-para-muted mt-1">Start the conversation!</p>
            </div>
          )
        ) : (
          // Bot Answers Tab
          displayBotReplies.length > 0 ? (
            displayBotReplies.map((reply) => (
              <div
                key={reply.id}
                className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary rounded-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    AI Assistant
                  </span>
                  <span className="text-xs text-para-muted ml-auto">
                    {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-para whitespace-pre-wrap mb-3">
                  {reply.content}
                </p>
                {reply.sources && reply.sources.length > 0 && (
                  <div className="pt-3 border-t border-primary/10">
                    <p className="text-xs font-medium text-para-muted mb-2">
                      Sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reply.sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/50 rounded text-xs text-para"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-12 h-12 text-para-muted mb-3" />
              <p className="text-para font-medium">No bot answers yet</p>
              <p className="text-sm text-para-muted mt-1">
                Enable "Ask Bot" when sending a message
              </p>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      {activeTab === "messages" && (
        <div className="p-4 border-t border-light-border">
          {/* Ask Bot Toggle */}
          <label className="flex items-center gap-2 mb-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={askBot}
                onChange={(e) => setAskBot(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-secondary/20 rounded-full peer-checked:bg-primary transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${askBot ? "text-primary" : "text-para-muted"}`} />
              <span className={`text-sm font-medium ${askBot ? "text-primary" : "text-para"}`}>
                Ask Bot to answer
              </span>
            </div>
          </label>

          {/* Input Area */}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-secondary/5 border border-light-border rounded-lg text-para placeholder:text-para-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-primary hover:bg-primary/90 disabled:bg-secondary/20 disabled:text-para-muted text-white rounded-lg transition-colors flex-shrink-0"
              aria-label="Send message"
              title="Send message (Enter)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

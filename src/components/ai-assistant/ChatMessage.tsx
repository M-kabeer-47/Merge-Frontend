"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Copy,
  Check,
  RefreshCw,
  FileText,
  Sparkles,
  BookmarkPlus,
} from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onSaveToNotes?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export default function ChatMessage({
  message,
  isStreaming = false,
  onSaveToNotes,
  onRegenerate,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Format message content with basic markdown-like support
  const formatContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Code blocks
      if (line.startsWith("```")) {
        return null; // Handle separately
      }
      // Bold text
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={idx} className="mb-2">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      // List items
      if (line.match(/^\d+\./)) {
        return (
          <li key={idx} className="ml-4 mb-1">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 mb-1 list-disc">
            {line.slice(2)}
          </li>
        );
      }
      // Regular paragraph
      return line.trim() ? (
        <p key={idx} className="mb-2 last:mb-0">
          {line}
        </p>
      ) : (
        <br key={idx} />
      );
    });
  };

  // Extract code blocks
  const hasCodeBlock = message.content.includes("```");
  let contentParts: { type: "text" | "code"; content: string }[] = [];
  
  if (hasCodeBlock) {
    const parts = message.content.split(/(```[\s\S]*?```)/g);
    contentParts = parts.map((part) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        return {
          type: "code",
          content: part.slice(3, -3).trim(),
        };
      }
      return { type: "text", content: part };
    });
  } else {
    contentParts = [{ type: "text", content: message.content }];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"} mb-6`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isAssistant
            ? "bg-gradient-to-br from-primary to-secondary text-white"
            : "bg-accent/10 text-accent"
        }`}
      >
        {isAssistant ? (
          <Sparkles className="w-5 h-5" />
        ) : (
          <span className="text-sm font-semibold">You</span>
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[85%] ${isAssistant ? "" : "flex flex-col items-end"}`}
      >
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isAssistant
              ? "bg-main-background border border-light-border"
              : "bg-primary text-white"
          }`}
        >
          <div
            className={`text-[15px] leading-relaxed ${
              isAssistant ? "text-para" : "text-white"
            }`}
          >
            {contentParts.map((part, idx) => (
              <div key={idx}>
                {part.type === "code" ? (
                  <pre className="bg-main-background dark:bg-[#0a0812] text-para rounded-lg p-3 my-2 overflow-x-auto border border-light-border">
                    <code className="text-sm font-mono">{part.content}</code>
                  </pre>
                ) : (
                  <div>{formatContent(part.content)}</div>
                )}
              </div>
            ))}
            {/* Blinking cursor for streaming */}
            {isStreaming && (
              <span className="inline-block w-[3px] h-[1.1em] bg-primary ml-0.5 align-middle rounded-sm animate-pulse" />
            )}
          </div>

          {/* Context File Indicator */}
          {message.contextFileId && (
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="text-xs px-2 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Attached file</span>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-para-muted mt-1 px-2">
          {formatTime(message.createdAt)}
        </div>

        {/* Actions (for assistant messages, hidden during streaming) */}
        {isAssistant && !isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors text-para-muted hover:text-para"
              title="Copy"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onSaveToNotes?.(message.id)}
              className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors text-para-muted hover:text-para"
              title="Save to notes"
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRegenerate?.(message.id)}
              className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors text-para-muted hover:text-para"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}


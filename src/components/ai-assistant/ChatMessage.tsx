"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  onSaveToNotes?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export default function ChatMessage({
  message,
  onSaveToNotes,
  onRegenerate,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeBlock(id);
    setTimeout(() => setCopiedCodeBlock(null), 2000);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

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
            {isAssistant ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-headings:text-heading prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-strong:text-heading prose-strong:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-blockquote:border-primary/40 prose-blockquote:text-para-muted prose-hr:border-light-border prose-table:text-sm prose-th:text-heading prose-td:text-para">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      // Code blocks (fenced ```) either have a language class OR contain newlines
                      // Inline code (`code`) is single-line with no className
                      const isInline = !match && !className && !codeString.includes("\n");
                      const codeId = `code-${message.id}-${codeString.slice(0, 20)}`;

                      if (isInline) {
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-mono text-[13px]"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return (
                        <div className="relative group/code my-3">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] dark:bg-[#0a0812] rounded-t-lg border border-b-0 border-light-border">
                            <span className="text-xs text-para-muted font-mono">
                              {match?.[1] || "code"}
                            </span>
                            <button
                              onClick={() => handleCopyCode(codeString, codeId)}
                              className="text-para-muted hover:text-para transition-colors p-1 rounded"
                              title="Copy code"
                            >
                              {copiedCodeBlock === codeId ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <pre className="!mt-0 !rounded-t-none bg-[#1e1e2e] dark:bg-[#0a0812] border border-t-0 border-light-border overflow-x-auto">
                            <code className={`text-sm font-mono ${className || ""}`} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                    pre({ children }) {
                      return <>{children}</>;
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto my-3 rounded-lg border border-light-border">
                          <table className="!my-0">{children}</table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="!bg-secondary/5 !font-semibold">{children}</th>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
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

        {/* Actions (for assistant messages) */}
        {isAssistant && (
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

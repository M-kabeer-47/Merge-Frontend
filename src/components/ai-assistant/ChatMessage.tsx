"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Copy,
  Check,
  RefreshCw,
  FileText,
  Sparkles,
  BookmarkPlus,
  FileImage,
  FileType2,
} from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/types/ai-chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
  onSaveToNotes?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentPill({
  name,
  type,
  size,
  onUserBubble,
}: {
  name: string;
  type?: string | null;
  size?: number | null;
  onUserBubble: boolean;
}) {
  const Icon = type === "image" ? FileImage : FileType2;
  const sizeStr = formatFileSize(size);
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs max-w-full ${
        onUserBubble
          ? "bg-white/15 text-white border border-white/20"
          : "bg-secondary/10 text-secondary border border-secondary/20"
      }`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate max-w-[220px] font-medium">{name}</span>
      {sizeStr && (
        <span className={onUserBubble ? "text-white/60" : "text-para-muted"}>
          · {sizeStr}
        </span>
      )}
    </div>
  );
}

function ChatMessageInner({
  message,
  isStreaming = false,
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
              <div className="ai-markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    /* ---------- Headings ---------- */
                    h1({ children }) {
                      return (
                        <h1 className="text-xl font-bold text-heading mt-6 mb-3 first:mt-0 pb-2 border-b border-light-border">
                          {children}
                        </h1>
                      );
                    },
                    h2({ children }) {
                      return (
                        <h2 className="text-lg font-semibold text-heading mt-5 mb-2 first:mt-0 flex items-center gap-2">
                          <span className="inline-block w-1 h-5 rounded-full bg-gradient-to-b from-primary to-secondary flex-shrink-0" />
                          {children}
                        </h2>
                      );
                    },
                    h3({ children }) {
                      return (
                        <h3 className="text-base font-semibold text-heading mt-4 mb-1.5 first:mt-0">
                          {children}
                        </h3>
                      );
                    },

                    /* ---------- Paragraph ---------- */
                    p({ children }) {
                      return (
                        <p className="mb-3 last:mb-0 leading-[1.75] text-para">
                          {children}
                        </p>
                      );
                    },

                    /* ---------- Bold / Strong ---------- */
                    strong({ children }) {
                      return (
                        <strong className="font-semibold text-heading">
                          {children}
                        </strong>
                      );
                    },

                    /* ---------- Links ---------- */
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors"
                        >
                          {children}
                        </a>
                      );
                    },

                    /* ---------- Unordered List ---------- */
                    ul({ children }) {
                      return (
                        <ul className="my-2 ml-1 space-y-1.5 list-none ai-ul">
                          {children}
                        </ul>
                      );
                    },

                    /* ---------- Ordered List ---------- */
                    ol({ children, start }) {
                      return (
                        <ol
                          start={start}
                          className="my-2 ml-1 space-y-1.5 list-none ai-ol"
                          style={{ counterReset: `ai-list-counter ${(start || 1) - 1}` }}
                          data-ordered="true"
                        >
                          {children}
                        </ol>
                      );
                    },

                    /* ---------- List Item ---------- */
                    li({ children, node }) {
                      // Determine if parent is ol by checking if node's parent tagName is "ol"
                      const isOrdered = node?.position
                        ? false // fallback, will be overridden by CSS
                        : false;
                      return (
                        <li className="flex gap-2 text-para leading-[1.75] ai-li">
                          <span className="flex-shrink-0 mt-[0.35em] ai-li-marker">
                            <span className="ai-li-bullet inline-block w-1.5 h-1.5 rounded-full bg-primary/60 mt-0.5" />
                            <span className="ai-li-number hidden items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold" />
                          </span>
                          <span className="flex-1">{children}</span>
                        </li>
                      );
                    },

                    /* ---------- Blockquote ---------- */
                    blockquote({ children }) {
                      return (
                        <blockquote className="my-3 px-4 py-2 border-l-3 border-primary/40 bg-primary/5 rounded-r-lg text-para-muted italic">
                          {children}
                        </blockquote>
                      );
                    },

                    /* ---------- Horizontal Rule ---------- */
                    hr() {
                      return (
                        <hr className="my-4 border-none h-px bg-gradient-to-r from-transparent via-light-border to-transparent" />
                      );
                    },

                    /* ---------- Code (inline + block) ---------- */
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const codeString = String(children).replace(/\n$/, "");
                      const isInline =
                        !match && !className && !codeString.includes("\n");
                      const codeId = `code-${message.id}-${codeString.slice(0, 20)}`;

                      if (isInline) {
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-mono text-[13px] border border-secondary/10"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      return (
                        <div className="relative group/code my-3 rounded-xl overflow-hidden border border-light-border shadow-sm">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e2e] dark:bg-[#0a0812]">
                            <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">
                              {match?.[1] || "code"}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyCode(codeString, codeId)
                              }
                              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                              title="Copy code"
                            >
                              {copiedCodeBlock === codeId ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="!mt-0 !rounded-none !rounded-b-xl bg-[#1e1e2e] dark:bg-[#0a0812] overflow-x-auto p-4">
                            <code
                              className={`text-sm font-mono leading-relaxed ${className || ""}`}
                              {...props}
                            >
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                    pre({ children }) {
                      return <>{children}</>;
                    },

                    /* ---------- Table ---------- */
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto my-3 rounded-xl border border-light-border shadow-sm">
                          <table className="w-full text-sm">{children}</table>
                        </div>
                      );
                    },
                    thead({ children }) {
                      return (
                        <thead className="bg-secondary/5 border-b border-light-border">
                          {children}
                        </thead>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="text-left px-4 py-2.5 font-semibold text-heading text-xs uppercase tracking-wider">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="px-4 py-2.5 text-para border-t border-light-border/50">
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <>
                {message.attachmentOriginalName && (
                  <div className="mb-2">
                    <AttachmentPill
                      name={message.attachmentOriginalName}
                      type={message.attachmentType}
                      size={message.attachmentFileSize}
                      onUserBubble={true}
                    />
                  </div>
                )}
                {message.content && (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </>
            )}
          </div>

          {/* Context File Indicator (legacy room-file path) */}
          {isAssistant && message.contextFileId && (
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="text-xs px-2 py-1 rounded-md bg-secondary/10 text-secondary border border-secondary/20 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Attached file</span>
              </div>
            </div>
          )}

          {/* Sources — when the answer drew from one or more files in the
              user's rooms. We dedupe by filename so a 3-chunk citation of
              the same lecture shows up as one chip. */}
          {isAssistant && !isStreaming && message.sources && message.sources.length > 0 && (() => {
            const uniqueFiles = Array.from(
              new Set(
                message.sources
                  .map((s) => s.fileName)
                  .filter((n): n is string => Boolean(n)),
              ),
            );
            if (uniqueFiles.length === 0) return null;
            return (
              <div className="mt-3 pt-3 border-t border-light-border">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-para-muted mb-1.5">
                  Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueFiles.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-1 text-[11px] font-medium text-secondary ring-1 ring-secondary/20"
                    >
                      <FileText className="w-3 h-3" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
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

// React.memo prevents re-renders of stable messages while an assistant
// reply is streaming. Previously every SSE chunk caused every ChatMessage
// in the list to re-render (and re-parse its markdown), producing the
// flashy/laggy feel. With the cache no longer being written on every
// chunk (see use-stream-query.ts), message prop references stay stable,
// so shallow equality is enough.
const ChatMessage = React.memo(ChatMessageInner, (prev, next) => {
  return (
    prev.message === next.message &&
    prev.isStreaming === next.isStreaming &&
    prev.onSaveToNotes === next.onSaveToNotes &&
    prev.onRegenerate === next.onRegenerate
  );
});

export default ChatMessage;

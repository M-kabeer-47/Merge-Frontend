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
  MoreVertical,
  Trash2,
  Pin,
  Copy,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import type { LiveQnaQuestion } from "@/types/live-qna";
import type { BotReply } from "@/types/live-session";

interface ChatPanelProps {
  questions: LiveQnaQuestion[];
  botReplies?: BotReply[];
  currentUserId: string;
  isHost: boolean;
  onSendQuestion?: (content: string, askBot: boolean) => void;
  onToggleVote?: (questionId: string, hasVoted: boolean) => void;
  onRemoveQuestion?: (questionId: string) => void;
  onMarkAnswered?: (questionId: string) => void;
  onMarkOpen?: (questionId: string) => void;
  onAskAiBot?: (questionId: string) => void;
  askingBotFor?: Set<string>;
  topQuestionId?: string | null;
  darkMode?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
}

type TabType = "messages" | "bot-answers";

export default function ChatPanel({
  questions,
  botReplies = [],
  currentUserId,
  isHost,
  onSendQuestion,
  onToggleVote,
  onRemoveQuestion,
  onMarkAnswered,
  onMarkOpen,
  onAskAiBot,
  askingBotFor,
  topQuestionId,
  darkMode = false,
  isLoading = false,
  onClose,
}: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  const [messageInput, setMessageInput] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const theme = useMemo(
    () => ({
      container: darkMode
        ? "bg-[#0b0e1a] text-[#e8ebff]"
        : "bg-[#f9f9ff] text-[#22263f]",
      header: darkMode
        ? "bg-white/5 border-white/10"
        : "bg-white/90 border-black/5",
      tabActive: darkMode
        ? "bg-white/15 text-white"
        : "bg-white text-primary",
      tabInactive: darkMode
        ? "text-[#8f97c8] hover:bg-white/5"
        : "text-para hover:bg-white/70",
      statBadge: darkMode
        ? "bg-white/5 border-white/10"
        : "bg-white border-black/5",
      card: darkMode
        ? "bg-white/5 border-white/10"
        : "bg-white border-black/5",
      cardHighlight: darkMode
        ? "bg-primary/15 border-primary/40 shadow-[0_20px_40px_-28px_rgba(155,93,229,0.45)]"
        : "bg-primary/5 border-primary/25 shadow-[0_25px_40px_-30px_rgba(155,93,229,0.25)]",
      meta: darkMode ? "text-[#9aa3c7]" : "text-para-muted",
      body: darkMode ? "text-[#dadfff]" : "text-para",
      chip: darkMode
        ? "bg-primary/20 text-primary border border-primary/40"
        : "bg-primary/10 text-primary border border-primary/20",
      answeredChip: darkMode
        ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/40"
        : "bg-emerald-100 text-emerald-600 border border-emerald-200",
      menuPanel: darkMode
        ? "bg-[#151a2e]/95 border-white/10"
        : "bg-white border-light-border",
      menuItem: darkMode
        ? "text-[#dfe2ff] hover:bg-white/5"
        : "text-para hover:bg-secondary/10",
      voteButtonIdle: darkMode
        ? "bg-white/5 text-[#a8aedc] border border-white/10 hover:border-white/20 hover:bg-white/10"
        : "bg-secondary/10 text-para border border-light-border hover:bg-secondary/20 hover:border-primary/30",
      voteButtonActive: darkMode
        ? "bg-primary text-white border border-primary/50 shadow-[0_12px_24px_-16px_rgba(155,93,229,0.55)]"
        : "bg-primary text-white border border-primary/40 shadow-[0_15px_30px_-18px_rgba(155,93,229,0.35)]",
      voteCountBadge: darkMode
        ? "bg-white/10 text-white border border-white/15"
        : "bg-secondary/10 text-primary border border-primary/20",
      divider: darkMode ? "border-white/10" : "border-light-border",
      emptyIcon: darkMode ? "text-white/30" : "text-para-muted",
      secondaryAction: darkMode
        ? "text-[#9aa3c7] hover:text-white"
        : "text-para-muted hover:text-para",
      composer: darkMode
        ? "bg-white/5 border-white/10 text-white placeholder:text-[#7d84b3]"
        : "bg-white border-light-border text-para placeholder:text-para-muted",
      sendButtonIdle: darkMode
        ? "bg-white/5 text-white/30"
        : "bg-secondary/10 text-para-muted",
      botCard: darkMode
        ? "bg-white/5 border-white/10"
        : "bg-white border border-light-border",
      closeButton: darkMode
        ? "border border-white/15 text-white/70 hover:text-white hover:bg-white/10"
        : "border border-light-border text-para-muted hover:text-heading hover:bg-secondary/20",
    }),
    [darkMode]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  // Sort messages: top voted first, then by timestamp
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (a.id === topQuestionId) return -1;
      if (b.id === topQuestionId) return 1;

      if (b.votesCount !== a.votesCount) {
        return b.votesCount - a.votesCount;
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [questions, topQuestionId]);

  // Extract bot replies from questions that have an AI answer
  const extractedBotReplies = useMemo<BotReply[]>(() => {
    return questions
      .filter((q) => q.aiAnswer)
      .map((q) => ({
        id: q.id,
        question: q.content,
        answer: q.aiAnswer!,
        content: q.aiAnswer!,
        timestamp: new Date(q.aiAnsweredAt ?? q.updatedAt),
        helpful: null,
        sources: q.aiAnswerSources ?? [],
      }));
  }, [questions]);

  // Use extracted replies if botReplies prop is empty
  const displayBotReplies =
    botReplies.length > 0 ? botReplies : extractedBotReplies;

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendQuestion?.(messageInput, false);
      setMessageInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const maxVotes = useMemo(
    () => questions.reduce((acc, q) => Math.max(acc, q.votesCount), 0),
    [questions]
  );

  const answeredCount = useMemo(
    () => questions.filter((q) => q.status === "answered").length,
    [questions]
  );

  return (
    <div
      className={`h-full flex flex-col transition-colors duration-300 ${theme.container}`}
    >
      {/* Header with Tabs */}
      <div
        className={`px-5 py-4 border-b backdrop-blur-sm rounded-b-2xl ${theme.header}`}
      >
        <div className="flex w-full flex-wrap items-start gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "messages" ? theme.tabActive : theme.tabInactive
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  activeTab === "messages"
                    ? "bg-white/15 text-white"
                    : "bg-secondary/10 text-current"
                }`}
              >
                {questions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("bot-answers")}
              className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "bot-answers" ? theme.tabActive : theme.tabInactive
              }`}
            >
              <Bot className="w-4 h-4" />
              Bot Answers
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  activeTab === "bot-answers"
                    ? "bg-white/15 text-white"
                    : "bg-secondary/10 text-current"
                }`}
              >
                {displayBotReplies.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap justify-end">
            <div
              className={`px-3 py-2 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:gap-2 ${theme.statBadge}`}
            >
              <span className="font-semibold">Most votes</span>
              <span className={`${theme.meta}`}>
                {questions.length > 0 ? `${maxVotes} votes` : "Not yet"}
              </span>
            </div>
            <div
              className={`px-3 py-2 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:gap-2 ${theme.statBadge}`}
            >
              <span className="font-semibold">Answered</span>
              <span className={`${theme.meta}`}>{answeredCount}</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${theme.closeButton}`}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages List or Bot Answers */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === "messages" ? (
          isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
              <p className={`text-sm ${theme.meta}`}>Loading questions…</p>
            </div>
          ) : sortedQuestions.length > 0 ? (
            sortedQuestions.map((question) => {
              const createdAt = new Date(question.createdAt);
              const answered = question.status === "answered";
              const viewerHasVoted = question.viewerHasVoted;
              const cardBase = `relative border rounded-xl px-4 py-3 transition-colors duration-200 ${
                question.id === topQuestionId ? theme.cardHighlight : theme.card
              }`;
              const showMenuButton = isHost;
              const showVoteButton = !isHost;
              const voteCount = question.votesCount;
              return (
                <div key={question.id} className="space-y-2">
                  {/* User Message */}
                  <div className={cardBase}>
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {(question.author.firstName + " " + question.author.lastName)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-heading">
                            {question.author.firstName} {question.author.lastName}
                            {question.isMine && " (You)"}
                          </span>
                          {question.id === topQuestionId && (
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-wide ${theme.chip}`}
                            >
                              <ThumbsUp className="w-3 h-3 fill-current" />
                              TOP VOTED
                            </span>
                          )}
                          {answered && (
                            <span
                              className={`px-2.5 py-1 text-[10px] font-semibold rounded-full flex items-center gap-1 uppercase tracking-wide ${theme.answeredChip}`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              ANSWERED
                            </span>
                          )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${theme.meta}`}>
                              {formatDistanceToNow(createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                            {showVoteButton ? (
                              <button
                                onClick={() => onToggleVote?.(question.id, viewerHasVoted)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                                  viewerHasVoted ? theme.voteButtonActive : theme.voteButtonIdle
                                }`}
                                title={
                                  viewerHasVoted
                                    ? "Remove your vote"
                                    : "Upvote this question"
                                }
                              >
                                <ThumbsUp
                                  className={`w-3.5 h-3.5 ${
                                    viewerHasVoted ? "fill-current" : ""
                                  }`}
                                />
                                {voteCount}
                              </button>
                            ) : (
                              <span
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${theme.voteCountBadge}`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {voteCount}
                              </span>
                            )}
                            {showMenuButton && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setShowMenu(
                                      showMenu === question.id ? null : question.id
                                    )
                                  }
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    darkMode
                                      ? "border-white/10 hover:bg-white/10"
                                      : "border-light-border hover:bg-secondary/20"
                                  }`}
                                  aria-label="More actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {showMenu === question.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-10"
                                      onClick={() => setShowMenu(null)}
                                    />
                                    <div
                                      className={`absolute right-0 top-full mt-2 z-20 rounded-2xl py-2 min-w-[180px] border shadow-xl ${theme.menuPanel}`}
                                    >
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(question.content);
                                          setShowMenu(null);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${theme.menuItem}`}
                                      >
                                        <Copy className="w-4 h-4" />
                                        Copy
                                      </button>
                                      <button
                                        onClick={() => {
                                          answered
                                            ? onMarkOpen?.(question.id)
                                            : onMarkAnswered?.(question.id);
                                          setShowMenu(null);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${theme.menuItem}`}
                                      >
                                        <Pin className="w-4 h-4" />
                                        {answered ? "Mark as open" : "Mark as answered"}
                                      </button>
                                      <button
                                        onClick={() => {
                                          onAskAiBot?.(question.id);
                                          setShowMenu(null);
                                        }}
                                        disabled={askingBotFor?.has(question.id)}
                                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors disabled:opacity-50 ${theme.menuItem}`}
                                      >
                                        {askingBotFor?.has(question.id) ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Sparkles className="w-4 h-4" />
                                        )}
                                        Ask AI to answer
                                      </button>
                                      <div className={`h-px mx-3 my-2 ${theme.divider}`} />
                                      <button
                                        onClick={() => {
                                          onRemoveQuestion?.(question.id);
                                          setShowMenu(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center gap-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Remove question
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p
                          className={`mt-1 text-sm leading-relaxed whitespace-pre-wrap break-words ${theme.body}`}
                        >
                          {question.content}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Inline AI answer — shown when bot has answered */}
                  {question.aiAnswer && (
                    <div className={`rounded-xl border px-4 py-3 ${theme.botCard}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-primary text-white">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                          AI Assistant
                        </span>
                        {question.aiAnsweredAt && (
                          <span className={`text-xs ml-auto ${theme.meta}`}>
                            {formatDistanceToNow(new Date(question.aiAnsweredAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme.body}`}>
                        {question.aiAnswer}
                      </p>
                      {question.aiAnswerSources && question.aiAnswerSources.length > 0 && (
                        <div className={`mt-2 pt-2 border-t flex flex-wrap gap-1.5 ${theme.divider}`}>
                          {question.aiAnswerSources.map((source, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                                darkMode
                                  ? "bg-white/5 border-white/10 text-white/70"
                                  : "bg-secondary/10 border-secondary/20 text-para"
                              }`}
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className={`w-12 h-12 mb-3 ${theme.emptyIcon}`} />
              <p className={`font-medium ${theme.body}`}>No questions yet</p>
              <p className={`text-sm mt-1 ${theme.meta}`}>
                Be the first to ask something!
              </p>
            </div>
          )
        ) : // Bot Answers Tab
        displayBotReplies.length > 0 ? (
          displayBotReplies.map((reply) => (
            <div
              key={reply.id}
              className={`p-5 rounded-2xl border transition-colors ${theme.botCard}`}
            >
              {/* Original question */}
              <div className={`mb-3 pb-3 border-b ${theme.divider}`}>
                <p className={`text-xs font-medium mb-1 ${theme.meta}`}>Question</p>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${theme.body}`}>
                  {reply.question}
                </p>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary text-white shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                  AI Assistant
                </span>
                <span className={`text-xs ml-auto ${theme.meta}`}>
                  {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed whitespace-pre-wrap mb-3 ${theme.body}`}
              >
                {reply.content}
              </p>
              {reply.sources && reply.sources.length > 0 && (
                <div className={`pt-3 border-t ${theme.divider}`}>
                  <p className={`text-xs font-medium mb-2 ${theme.meta}`}>
                    Sources:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reply.sources.map((source, idx) => (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                          darkMode
                            ? "bg-white/5 border-white/10 text-white/80"
                            : "bg-secondary/10 border-secondary/20 text-para"
                        }`}
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
            <Bot className={`w-12 h-12 mb-3 ${theme.emptyIcon}`} />
            <p className={`font-medium ${theme.body}`}>No bot answers yet</p>
            <p className={`text-sm mt-1 ${theme.meta}`}>
              Admin can ask AI to answer questions from the menu
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      {activeTab === "messages" && (
        <div className={`p-5 border-t ${theme.divider}`}>
          {/* Input Area */}
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                rows={1}
                className={`w-full px-4 py-3 pr-14 rounded-2xl border resize-none focus:outline-none focus:ring-2 transition-all ${theme.composer}`}
                style={{ minHeight: "48px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className={`p-3 rounded-2xl flex-shrink-0 transition-all shadow-lg flex items-center justify-center ${
                messageInput.trim()
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : theme.sendButtonIdle
              }`}
              aria-label="Submit question"
              title="Submit question (Enter)"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

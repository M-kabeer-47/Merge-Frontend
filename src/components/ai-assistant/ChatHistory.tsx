"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  MessageSquare,
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import type { ChatSession } from "@/types/ai-chat";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "../ui/Button";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onRenameSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onTogglePin?: (sessionId: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ChatHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onTogglePin,
  onClose,
  isMobile = false,
}: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filter sessions
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate pinned and unpinned
  const pinnedSessions = filteredSessions.filter((s) => s.isPinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.isPinned);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const SessionItem = ({ session }: { session: ChatSession }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
        activeSessionId === session.id
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-gray-100"
      }`}
      onClick={() => {
        onSelectSession(session.id);
        if (isMobile) onClose?.();
      }}
    >
      <div className="flex items-start gap-2">
        <MessageSquare
          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
            activeSessionId === session.id ? "text-primary" : "text-para-muted"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4
              className={`text-sm font-medium truncate ${
                activeSessionId === session.id ? "text-primary" : "text-heading"
              }`}
            >
              {session.title}
            </h4>
            {session.isPinned && (
              <Pin
                className="w-3 h-3 text-accent flex-shrink-0"
                fill="currentColor"
              />
            )}
          </div>
          <p className="text-xs text-para-muted truncate mb-1">
            {session.preview}
          </p>
          <div className="flex items-center gap-2 text-xs text-para-muted">
            <span>{formatDate(session.updatedAt)}</span>
            <span>•</span>
            <span>{session.messageCount} msgs</span>
          </div>
        </div>

        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(menuOpen === session.id ? null : session.id);
          }}
          className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4 text-para-muted" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen === session.id && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(null)}
          />
          <div className="absolute right-2 top-10 w-40 bg-main-background border border-light-border rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.(session.id);
                setMenuOpen(null);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Pin className="w-3.5 h-3.5" />
              {session.isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRenameSession?.(session.id);
                setMenuOpen(null);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete this chat session?")) {
                  onDeleteSession?.(session.id);
                }
                setMenuOpen(null);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2 border-t border-light-border"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <div
      className={`flex flex-col h-full ${
        isMobile
          ? "bg-main-background"
          : "border-r border-light-border bg-gray-50/50"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-light-border bg-main-background">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-raleway font-bold text-heading">
            Chat History
          </h2>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-para-muted" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <Button
          onClick={() => {
            onNewChat();
            if (isMobile) onClose?.();
          }}
          className="w-full"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        {/* Search */}
        <div className="mt-3">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search chats..."
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-medium text-heading mb-1">
              {searchTerm ? "No chats found" : "No chat history"}
            </p>
            <p className="text-xs text-para-muted max-w-[180px]">
              {searchTerm
                ? "Try a different search term"
                : "Start a new conversation"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pinned Sessions */}
            {pinnedSessions.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-para-muted uppercase tracking-wide px-3 mb-2">
                  Pinned
                </h3>
                <div className="space-y-1">
                  <AnimatePresence>
                    {pinnedSessions.map((session) => (
                      <SessionItem key={session.id} session={session} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            {unpinnedSessions.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-para-muted uppercase tracking-wide px-3 mb-2">
                  Recent
                </h3>
                <div className="space-y-1">
                  <AnimatePresence>
                    {unpinnedSessions.map((session) => (
                      <SessionItem key={session.id} session={session} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

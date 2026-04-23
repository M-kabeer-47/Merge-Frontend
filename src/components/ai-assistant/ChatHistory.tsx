"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";
import type { ChatSession } from "@/types/ai-chat";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "../ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ChatHistorySkeleton from "./ChatHistorySkeleton";

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => Promise<void> | void;
  onClose?: () => void;
  isMobile?: boolean;
  isLoading?: boolean;
}

export default function ChatHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClose,
  isMobile = false,
  isLoading = false,
}: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(
    null,
  );

  // Filter sessions
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.lastMessage?.content || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const formatDate = (date: string | Date) => {
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

  return (
    <div
      className={`flex flex-col h-full ${
        isMobile ? "bg-main-background" : "border-r border-light-border"
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
              className="p-1.5 rounded-lg hover:bg-secondary/10 transition-colors"
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
          <SearchBar onSearch={setSearchTerm} placeholder="Search chats..." />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isLoading ? (
          <ChatHistorySkeleton />
        ) : filteredSessions.length === 0 ? (
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
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                  activeSessionId === session.id
                    ? "bg-secondary/20"
                    : "hover:bg-secondary/10"
                }`}
                onClick={() => {
                  if (menuOpen) return;
                  onSelectSession(session.id);
                  if (isMobile) onClose?.();
                }}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      activeSessionId === session.id
                        ? "text-primary"
                        : "text-para-muted"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-medium truncate mb-0.5 ${
                        activeSessionId === session.id
                          ? "text-primary"
                          : "text-heading"
                      }`}
                    >
                      {session.title}
                    </h4>
                    <p className="text-xs text-para-muted truncate mb-1">
                      {session.lastMessage?.content || "No messages yet"}
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
                      setMenuOpen(
                        menuOpen === session.id ? null : session.id,
                      );
                    }}
                    className="p-1 rounded hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-para-muted" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {menuOpen === session.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(null);
                      }}
                    />
                    <div className="absolute right-2 top-10 w-40 bg-main-background border border-light-border rounded-lg shadow-lg z-20 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session);
                          setIsDeleteDialogOpen(true);
                          setMenuOpen(null);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={async () => {
          if (sessionToDelete) {
            try {
              setIsDeleting(true);
              await onDeleteSession?.(sessionToDelete.id);
            } finally {
              setIsDeleting(false);
            }
          }
          setIsDeleteDialogOpen(false);
          setSessionToDelete(null);
        }}
        isLoading={isDeleting}
        title="Delete Chat Session"
        message="Are you sure you want to delete"
        itemName={sessionToDelete?.title}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

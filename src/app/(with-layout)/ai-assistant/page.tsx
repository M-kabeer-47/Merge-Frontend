"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { PanelRightOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ChatMessage from "@/components/ai-assistant/ChatMessage";
import ChatComposer from "@/components/ai-assistant/ChatComposer";
import ChatHistory from "@/components/ai-assistant/ChatHistory";
import NameInputModal from "@/components/ui/NameInputModal";
import useFetchConversations from "@/hooks/ai-assistant/use-fetch-conversations";
import useFetchConversation from "@/hooks/ai-assistant/use-fetch-conversation";
import useCreateConversation from "@/hooks/ai-assistant/use-create-conversation";
import useDeleteConversation from "@/hooks/ai-assistant/use-delete-conversation";
import useUpdateConversationTitle from "@/hooks/ai-assistant/use-update-conversation-title";
import useSendMessage from "@/hooks/ai-assistant/use-send-message";
import useUploadAttachment from "@/hooks/ai-assistant/use-upload-attachment";
import { useAuth } from "@/providers/AuthProvider";
import type { ContextFile, ChatSession } from "@/types/ai-chat";

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [pinnedSessions, setPinnedSessions] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{ content: string; files: ContextFile[] } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations and active conversation
  const { conversations, isLoading: loadingConversations } =
    useFetchConversations();
  const { messages, isLoading: loadingMessages } =
    useFetchConversation(activeSessionId);

  // Mutations
  const { createConversation, isCreating } = useCreateConversation();
  const { deleteConversation, isDeleting } = useDeleteConversation();
  const { updateTitle } = useUpdateConversationTitle();
  const { sendMessage, isSending, mapFileTypeToAttachmentType } = useSendMessage(activeSessionId);
  const { uploadAttachment, isUploading, uploadProgress } =
    useUploadAttachment();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add sessions with pin status
  const sessionsWithPins: ChatSession[] = conversations.map((conv) => ({
    ...conv,
    isPinned: pinnedSessions.has(conv.id),
  }));

  // Handle new chat - open dialog
  const handleNewChat = () => {
    setIsCreateDialogOpen(true);
  };

  // Handle create conversation with title
  const handleCreateConversation = async (title: string) => {
    try {
      const newConversation = await createConversation({ title });
      setActiveSessionId(newConversation.id);
      setContextFiles([]);
      
      // If there's a pending message, send it after creating the conversation
      if (pendingMessage) {
        await sendMessageToConversation(
          newConversation.id,
          pendingMessage.content,
          pendingMessage.files
        );
        setPendingMessage(null);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Handle select session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setContextFiles([]);
  };

  // Handle toggle pin (client-side only)
  const handleTogglePin = (sessionId: string) => {
    setPinnedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  // Handle delete conversation
  const handleDeleteConversation = async (sessionId: string) => {
    try {
      await deleteConversation(sessionId);
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  // Handle rename conversation
  const handleRenameConversation = async (sessionId: string, newTitle: string) => {
    try {
      await updateTitle({
        conversationId: sessionId,
        data: { title: newTitle },
      });
    } catch (error) {
      console.error("Failed to rename conversation:", error);
    }
  };

  // Handle send message with optional file
  const handleSendMessage = async (content: string, files: ContextFile[]) => {
    if (!activeSessionId) {
      // Show create dialog when no active session
      setPendingMessage({ content, files });
      setIsCreateDialogOpen(true);
    } else {
      await sendMessageToConversation(activeSessionId, content, files);
    }
  };

  const sendMessageToConversation = async (
    conversationId: string,
    content: string,
    files: ContextFile[]
  ) => {
    try {
      const attachmentData = files.length > 0 ? files[0] : null;

      await sendMessage({
        message: content,
        attachmentS3Url: attachmentData?.url,
        attachmentType: attachmentData ? mapFileTypeToAttachmentType(attachmentData.type) : undefined,
        attachmentOriginalName: attachmentData?.name,
        attachmentFileSize: attachmentData?.size,
      });

      // Clear context files after sending
      setContextFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handle file upload from device
  const handleUploadFile = async (file: File) => {
    try {
      const uploaded = await uploadAttachment(file);
      
      const contextFile: ContextFile = {
        id: `file-${Date.now()}`,
        name: uploaded.fileName,
        type: uploaded.fileType,
        size: uploaded.fileSize,
        url: uploaded.s3Url,
      };
      
      setContextFiles((prev) => [...prev, contextFile]);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  // Handle context file management
  const handleAddContext = () => {
    // TODO: Implement modal to select files from rooms
    toast.info("Feature coming soon: Select files from your rooms");
  };

  const handleRemoveContextFile = (fileId: string) => {
    setContextFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Handle save to notes
  const handleSaveToNotes = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      console.log("Save to notes:", message.content);
      // TODO: Implement save to notes functionality
      toast.info("Feature coming soon: Save message to notes");
    }
  };

  // Handle regenerate (resend last user message)
  const handleRegenerate = async (messageId: string) => {
    toast.info("Feature coming soon: Regenerate response");
  };

  const isGenerating = isSending;

  return (
    <div className="h-screen flex overflow-hidden bg-main-background">
      {/* History Sidebar - Animated width like AppSidebar */}
      <motion.div
        animate={{
          width: showHistory ? "280px" : "0px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative flex-shrink-0 overflow-hidden border-r border-light-border"
      >
        {showHistory && (
          <div className="w-[280px]">
            <ChatHistory
              sessions={sessionsWithPins}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onTogglePin={handleTogglePin}
              onRenameSession={handleRenameConversation}
              onDeleteSession={handleDeleteConversation}
              onClose={() => setShowHistory(false)}
              isMobile={false}
            />
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Minimal Header - Just toggle button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-main-background border border-light-border hover:bg-background transition-colors shadow-sm"
            title="Toggle Chat History"
          >
            <PanelRightOpen className={`w-5 h-5 text-para transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Chat Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Welcome Section (when no messages) */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-6 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-raleway font-bold text-heading mb-3">
                  Good Morning, {user?.firstName || "there"}
                </h2>
                <p className="text-lg text-para mb-8">
                  How Can I{" "}
                  <span className="text-primary font-semibold">
                    Assist You Today?
                  </span>
                </p>
              </motion.div>
            </div>
          )}

          {/* Messages Area */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-44">
              <div className="max-w-3xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSaveToNotes={handleSaveToNotes}
                    onRegenerate={handleRegenerate}
                  />
                ))}

                {/* Loading Indicator */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 mb-6"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 max-w-[85%]">
                      <div className="rounded-2xl px-4 py-3 bg-main-background border border-light-border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
                          <span className="text-sm text-para-muted ml-2">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Composer - Fixed at bottom */}
        <div className="absolute w-full max-w-[700px] left-1/2 -translate-x-1/2 bottom-22 z-10">
          <ChatComposer
            onSendMessage={handleSendMessage}
            onAddContext={handleAddContext}
            onUploadFile={handleUploadFile}
            contextFiles={contextFiles}
            onRemoveContextFile={handleRemoveContextFile}
            disabled={isGenerating || isUploading}
            uploadProgress={uploadProgress}
          />
        </div>
      </div>

      {/* Create Conversation Dialog */}
      <NameInputModal
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setPendingMessage(null);
        }}
        onSubmit={async (title: string) => {
          await handleCreateConversation(title);
          setIsCreateDialogOpen(false);
        }}
        title="New Chat Session"
        label="Session Title"
        placeholder="Enter a title for your chat..."
        submitText="Create"
        isLoading={isCreating}
        maxLength={100}
      />
    </div>
  );
}

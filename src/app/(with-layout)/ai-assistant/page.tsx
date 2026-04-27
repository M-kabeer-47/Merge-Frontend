"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { PanelRightOpen } from "lucide-react";
import { toast } from "sonner";
import ChatMessage from "@/components/ai-assistant/ChatMessage";
import ChatComposer from "@/components/ai-assistant/ChatComposer";
import ChatHistory from "@/components/ai-assistant/ChatHistory";
import ChatLoadingSkeleton from "@/components/ai-assistant/ChatLoadingSkeleton";
import WelcomeScreen from "@/components/ai-assistant/WelcomeScreen";
import TypingIndicator from "@/components/ai-assistant/TypingIndicator";
import RoomFilePickerModal from "@/components/ai-assistant/RoomFilePickerModal";
import useFetchConversations from "@/hooks/ai-assistant/use-fetch-conversations";
import useFetchConversation from "@/hooks/ai-assistant/use-fetch-conversation";
import useCreateConversation from "@/hooks/ai-assistant/use-create-conversation";
import useDeleteConversation from "@/hooks/ai-assistant/use-delete-conversation";
import useStreamQuery from "@/hooks/ai-assistant/use-stream-query";
import useUploadAttachment from "@/hooks/ai-assistant/use-upload-attachment";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import type { ContextFile, ConversationWithMessages } from "@/types/ai-chat";
import useMySubscription from "@/hooks/subscription/use-my-subscription";
import LockedFeatureScreen from "@/components/subscription/LockedFeatureScreen";

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { subscription, isLoading: subLoading } = useMySubscription();
  const hasAiAssistant = !!subscription?.plan?.hasAiAssistant;
  const isInstructor = user?.role === "instructor";
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mutations
  const { createConversation, isCreating } = useCreateConversation();
  const { deleteConversation, isDeleting } = useDeleteConversation();
  const { streamQuery, isStreaming, streamingMessage, pendingUserMessage } =
    useStreamQuery();

  // Fetch conversations and active conversation
  const { conversations, isLoading: loadingConversations } =
    useFetchConversations();
  const { conversation, messages, isLoading: loadingMessages } =
    useFetchConversation(activeSessionId, isStreaming);
  const { uploadAttachment, isUploading, uploadProgress } =
    useUploadAttachment();

  // Max attachments allowed per conversation (mirror of backend cap).
  const MAX_ATTACHMENTS_PER_CONVERSATION = 2;
  const conversationAttachmentCount =
    conversation?.attachments?.length ?? 0;
  const atAttachmentCap =
    !!activeSessionId &&
    conversationAttachmentCount >= MAX_ATTACHMENTS_PER_CONVERSATION;

  // Build the single list that the main map renders. During streaming we
  // append the live streamingMessage after the cached messages (also
  // filtering any cached copy with the same id to avoid duplicates). When
  // the stream ends, the same id exists in `messages` (written on the
  // complete event in use-stream-query.ts), so the array transitions
  // smoothly: [..., streamingMessage(id=S)] → [..., cachedFinal(id=S)].
  // Because the position and key are preserved, React reuses the DOM
  // node and framer-motion doesn't replay the entry animation.
  const displayMessages = React.useMemo(() => {
    const base = streamingMessage
      ? messages.filter((m) => m.id !== streamingMessage.id)
      : messages;
    return streamingMessage ? [...base, streamingMessage] : base;
  }, [messages, streamingMessage]);

  // Smart auto-scroll: only scroll if user is already at bottom, with throttling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isUserScrollingRef.current) return;

    // Throttle scroll updates during streaming to avoid jank
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      // Check if user is near the bottom (within 150px threshold)
      const threshold = 150;
      const isNearBottom =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        threshold;

      if (isNearBottom) {
        // Use instant scroll during streaming for smooth typing effect
        if (streamingMessage) {
          // During streaming, scroll instantly to avoid animation lag
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        } else {
          // After message sent, smooth scroll
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      }
    }, 50); // Throttle to 50ms for smooth performance

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages.length, streamingMessage?.content?.length]);

  // Track user scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const threshold = 150;
      const isNearBottom =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        threshold;

      // Mark as user scrolling if they've scrolled away from bottom
      isUserScrollingRef.current = !isNearBottom;

      // Reset after a delay so auto-scroll can resume
      if (!isNearBottom) {
        setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 1000);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle new chat - create conversation without dialog
  const handleNewChat = async () => {
    try {
      const newConversation = await createConversation();

      // Pre-populate cache so skeleton doesn't flash for new empty conversations
      queryClient.setQueryData<ConversationWithMessages>(
        ["ai-conversation", newConversation.id],
        {
          ...newConversation,
          messages: [],
        },
      );

      setActiveSessionId(newConversation.id);
      setContextFiles([]);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Handle select session
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setContextFiles([]);
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

  // Handle send message with streaming
  const handleSendMessage = async (content: string, files: ContextFile[]) => {
    const attachmentData = files.length > 0 ? files[0] : null;

    // Map file MIME or filename to attachment type. Falls back to the
    // filename extension when the browser reports a generic/unknown MIME
    // (e.g. application/octet-stream) — otherwise the backend drops the
    // attachment because attachmentType is required for it to be forwarded
    // to FastAPI.
    const mapFileTypeToAttachmentType = (
      fileType: string,
      fileName?: string,
    ): "pdf" | "docx" | "txt" | "pptx" | "image" | undefined => {
      const lowerType = (fileType || "").toLowerCase();
      const lowerName = (fileName || "").toLowerCase();
      const has = (needle: string) =>
        lowerType.includes(needle) || lowerName.endsWith("." + needle);

      if (has("pdf")) return "pdf";
      if (has("docx") || lowerType.includes("document")) return "docx";
      if (has("txt") || lowerType.includes("text/plain")) return "txt";
      if (has("pptx") || lowerType.includes("presentation")) return "pptx";
      if (
        lowerType.includes("image") ||
        has("png") ||
        has("jpg") ||
        has("jpeg") ||
        has("gif") ||
        has("webp")
      )
        return "image";
      return undefined;
    };

    // If the file is from a room (has roomId), send its ID as contextFileId
    const contextFileId = attachmentData?.roomId
      ? attachmentData.id
      : undefined;

    const resolvedAttachmentType = attachmentData
      ? mapFileTypeToAttachmentType(attachmentData.type, attachmentData.name)
      : undefined;

    if (attachmentData && !contextFileId && !resolvedAttachmentType) {
      toast.error(
        `Unsupported file type: ${attachmentData.name}. Please upload a PDF, DOCX, PPTX, TXT, or image.`,
      );
      return;
    }

    // Clear context files immediately after clicking send so they disappear from composer
    setContextFiles([]);

    await streamQuery(
      {
        conversationId: activeSessionId || undefined,
        message: content,
        contextFileId,
        attachmentS3Url: contextFileId ? undefined : attachmentData?.url,
        attachmentType: contextFileId ? undefined : resolvedAttachmentType,
        attachmentOriginalName: contextFileId ? undefined : attachmentData?.name,
        attachmentFileSize: contextFileId ? undefined : attachmentData?.size,
      },
      (conversationId) => {
        // On conversation created
        if (!activeSessionId) {
          setActiveSessionId(conversationId);
        }
      },
      (title) => {
        // On title updated (optional callback)
        console.log("Conversation title updated:", title);
      },
    );

    // Clear context files after sending
    setContextFiles([]);
  };

  // Handle file upload from device
  const handleUploadFile = async (file: File) => {
    if (atAttachmentCap) {
      toast.error(
        `This conversation already has ${MAX_ATTACHMENTS_PER_CONVERSATION} files. Start a new chat to attach another.`,
      );
      return;
    }
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
    if (atAttachmentCap) {
      toast.error(
        `This conversation already has ${MAX_ATTACHMENTS_PER_CONVERSATION} files. Start a new chat to attach another.`,
      );
      return;
    }
    setIsFilePickerOpen(true);
  };

  const handleSelectRoomFile = (file: ContextFile) => {
    setContextFiles((prev) => [...prev, file]);
  };

  const handleRemoveContextFile = (fileId: string) => {
    setContextFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Stable references so React.memo(ChatMessage) can short-circuit
  // during per-chunk streaming re-renders of the parent.
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleSaveToNotes = useCallback((messageId: string) => {
    const message = messagesRef.current.find((m) => m.id === messageId);
    if (message) {
      console.log("Save to notes:", message.content);
      // TODO: Implement save to notes functionality
      toast.info("Feature coming soon: Save message to notes");
    }
  }, []);

  const handleRegenerate = useCallback(async (_messageId: string) => {
    toast.info("Feature coming soon: Regenerate response");
  }, []);

  const composerProps = {
    onSendMessage: handleSendMessage,
    onAddContext: handleAddContext,
    onUploadFile: handleUploadFile,
    contextFiles,
    onRemoveContextFile: handleRemoveContextFile,
    // disabled blocks the send button + attach buttons; textarea is only
    // blocked while the assistant is streaming, so the user can keep
    // typing their question while a file uploads in the background.
    disabled: isStreaming || isUploading,
    isStreaming,
    uploadProgress,
    attachmentCount: conversationAttachmentCount,
    maxAttachments: MAX_ATTACHMENTS_PER_CONVERSATION,
    atAttachmentCap,
  };

  // Lock screen for users without AI Assistant on their plan.
  // Wait for the subscription query to settle so we don't flash the lock to users who actually have access.
  if (!subLoading && !hasAiAssistant) {
    return (
      <LockedFeatureScreen
        featureName="AI Assistant"
        description="Chat with an AI tutor that knows your room content. Ask questions, get explanations, and study smarter."
        perks={[
          "Ask questions about your room files (PDFs, slides, notes)",
          "Get instant explanations on tough concepts",
          "Save conversations to revisit later",
          "Auto-applied discount if you've earned a reward badge",
        ]}
        requiredPlan={isInstructor ? "Educator" : "Student Plus"}
      />
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-main-background">
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
          <div className="w-[280px] h-full">
            <ChatHistory
              sessions={conversations}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteConversation}
              onClose={() => setShowHistory(false)}
              isMobile={false}
              isLoading={loadingConversations}
            />
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Minimal Header - Just toggle button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg bg-main-background border border-light-border hover:bg-background transition-colors shadow-sm"
            title="Toggle Chat History"
          >
            <PanelRightOpen
              className={`w-5 h-5 text-para transition-transform ${showHistory ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Chat Content Area */}
        {activeSessionId && loadingMessages && !pendingUserMessage ? (
          <ChatLoadingSkeleton />
        ) : messages.length === 0 && !isStreaming && !pendingUserMessage ? (
          <WelcomeScreen userName={user?.firstName} {...composerProps} />
        ) : (
          /* Conversation State: messages scroll, composer fixed at bottom */
          <>
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 pb-4"
              style={{
                scrollBehavior: streamingMessage ? "auto" : "smooth",
                overflowAnchor: "none",
              }}
            >
              <div className="max-w-3xl mx-auto">
                {/* Show pending user message (first message before conversation is created) */}
                {pendingUserMessage &&
                  !messages.some((m) => m.id === pendingUserMessage.id) && (
                    <ChatMessage
                      key={pendingUserMessage.id}
                      message={pendingUserMessage}
                      onSaveToNotes={handleSaveToNotes}
                      onRegenerate={handleRegenerate}
                    />
                  )}

                {/* Single render path: streamingMessage is appended to
                    displayMessages as the last item. When the stream ends,
                    the cached final message (same id, same position) takes
                    its place in-situ — React reuses the same component
                    instance, so the entry animation only fires ONCE. */}
                {displayMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isStreaming={message.id === streamingMessage?.id}
                    onSaveToNotes={handleSaveToNotes}
                    onRegenerate={handleRegenerate}
                  />
                ))}

                {isStreaming && !streamingMessage && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="shrink-0 w-full max-w-[700px] mx-auto px-4 pb-4">
              <ChatComposer {...composerProps} />
            </div>
          </>
        )}
      </div>

      {/* Room File Picker Modal */}
      <RoomFilePickerModal
        isOpen={isFilePickerOpen}
        onClose={() => setIsFilePickerOpen(false)}
        onSelectFile={handleSelectRoomFile}
      />
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  StreamQueryPayload,
  ChatMessage,
  ConversationWithMessages,
  SourceEvent,
} from "@/types/ai-chat";

interface StreamingState {
  isStreaming: boolean;
  streamingMessage: ChatMessage | null;
  pendingUserMessage: ChatMessage | null;
  sources: SourceEvent[];
  error: string | null;
}

/**
 * Hook to handle streaming AI queries with SSE
 */
export default function useStreamQuery() {
  const queryClient = useQueryClient();
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamingMessage: null,
    pendingUserMessage: null,
    sources: [],
    error: null,
  });

  const streamQuery = useCallback(
    async (
      payload: StreamQueryPayload,
      onConversationCreated?: (conversationId: string) => void,
      onTitleUpdated?: (title: string) => void,
    ) => {
      let conversationId = payload.conversationId;
      let userMessageId: string | null = null;
      let assistantMessageId: string | null = null;
      let accumulatedAnswer = "";
      let completedSuccessfully = false;
      const accumulatedSources: SourceEvent[] = [];

      // Create optimistic user message upfront so it can be displayed immediately
      const optimisticUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: payload.message,
        contextFileId: payload.contextFileId || null,
        createdAt: new Date().toISOString(),
        attachmentOriginalName: payload.attachmentOriginalName || null,
        attachmentType: payload.attachmentType || null,
        attachmentFileSize: payload.attachmentFileSize || null,
        attachmentUrl: payload.attachmentS3Url || null,
      };
      userMessageId = optimisticUserMessage.id;

      // Helper: ensure cache entry always exists (never silently drop updates)
      const ensureCacheEntry = (
        old: ConversationWithMessages | undefined,
      ): ConversationWithMessages => {
        if (old) return old;
        // Create a minimal entry so updates aren't lost
        return {
          id: conversationId!,
          title: "Conversation",
          summary: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [optimisticUserMessage],
        };
      };

      setStreamingState({
        isStreaming: true,
        streamingMessage: null,
        pendingUserMessage: !conversationId ? optimisticUserMessage : null,
        sources: [],
        error: null,
      });

      try {
        // Cancel any in-flight conversation queries to prevent race conditions
        if (conversationId) {
          await queryClient.cancelQueries({
            queryKey: ["ai-conversation", conversationId],
          });
        }

        // Add user message to cache if we have a conversation ID
        if (conversationId) {
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              const entry = ensureCacheEntry(old);
              // Avoid duplicate: check if user message already exists
              if (
                entry.messages.some((m) => m.id === optimisticUserMessage.id)
              ) {
                return entry;
              }
              return {
                ...entry,
                messages: [...entry.messages, optimisticUserMessage],
              };
            },
          );
        }

        // Make SSE request
        const response = await fetch("/api/ai-assistant/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";

        // Read stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          buffer += chunk;
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (!line.trim() || line.startsWith(":")) continue;

            if (line.startsWith("event:")) {
              currentEvent = line.slice(6).trim();
              continue;
            }

            if (line.startsWith("data:")) {
              const data = line.slice(5).trim();
              if (!data) continue;

              let parsed: any;
              try {
                parsed = JSON.parse(data);
              } catch (parseError) {
                console.error("[SSE JSON Parse Error]", parseError);
                currentEvent = "";
                continue;
              }

              // Handle error events OUTSIDE try-catch so they propagate
              if (currentEvent === "error" || parsed.error) {
                throw new Error(
                  parsed.error || "An error occurred during streaming",
                );
              }

              try {
                // Handle based on event type
                if (currentEvent === "conversation" || parsed.conversation_id) {
                  // conversation event
                  conversationId = parsed.conversation_id;
                  if (conversationId) {
                    // Cancel any queries for the new conversation BEFORE
                    // triggering state changes that would start a refetch
                    await queryClient.cancelQueries({
                      queryKey: ["ai-conversation", conversationId],
                    });

                    // If this is a new conversation, populate cache BEFORE
                    // calling onConversationCreated (which sets activeSessionId
                    // and triggers useFetchConversation). Without this, the
                    // refetch races with the backend saving the user message
                    // and returns empty messages, causing the user's message
                    // to disappear.
                    if (!payload.conversationId) {
                      queryClient.setQueryData<ConversationWithMessages>(
                        ["ai-conversation", conversationId],
                        () => ({
                          id: conversationId!,
                          title: "New Conversation",
                          summary: null,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          messages: [optimisticUserMessage],
                        }),
                      );

                      // Clear pending user message since it's now in cache
                      setStreamingState((prev) => ({
                        ...prev,
                        pendingUserMessage: null,
                      }));
                    }

                    onConversationCreated?.(conversationId);
                  }
                } else if (currentEvent === "title" || parsed.title) {
                  // title event
                  onTitleUpdated?.(parsed.title);

                  // Update conversation title in cache
                  if (conversationId) {
                    queryClient.setQueryData<ConversationWithMessages>(
                      ["ai-conversation", conversationId],
                      (old) => {
                        if (!old) return old;
                        return { ...old, title: parsed.title };
                      },
                    );
                  }
                } else if (currentEvent === "status" && parsed.status) {
                  // status event - silently ignore
                } else if (
                  currentEvent === "chunk" ||
                  parsed.text !== undefined
                ) {
                  // chunk event - progressive text streaming.
                  // IMPORTANT: only update the dedicated streamingMessage
                  // state here. Writing to the React Query cache on every
                  // chunk cascades re-renders through the whole page
                  // (sidebar, every prior ChatMessage, markdown re-parse)
                  // and is what made streaming feel choppy. The cache is
                  // updated once on the "complete" event below.
                  const chunkText = parsed.text || "";
                  accumulatedAnswer += chunkText;

                  if (!assistantMessageId) {
                    assistantMessageId = `assistant-streaming-${Date.now()}`;
                  }

                  setStreamingState((prev) => ({
                    ...prev,
                    streamingMessage: {
                      id: assistantMessageId!,
                      role: "assistant",
                      content: accumulatedAnswer,
                      createdAt: prev.streamingMessage?.createdAt ?? new Date().toISOString(),
                    },
                  }));
                } else if (currentEvent === "sources" || parsed.fileId) {
                  // sources event
                  const source: SourceEvent = {
                    fileId: parsed.fileId,
                    chunkIndex: parsed.chunkIndex,
                    content: parsed.content,
                    relevanceScore: parsed.relevanceScore,
                  };
                  accumulatedSources.push(source);
                  setStreamingState((prev) => ({
                    ...prev,
                    sources: accumulatedSources,
                  }));
                } else if (
                  currentEvent === "complete" ||
                  parsed.messageId ||
                  parsed.processing_time_ms !== undefined
                ) {
                  // complete event - finalize the streaming message in cache.
                  // IMPORTANT: keep the id equal to assistantMessageId (the
                  // streaming id). When the streaming bubble unmounts and the
                  // cached copy takes over in the main message list, the
                  // React key stays the same across the transition so
                  // framer-motion's entry animation does NOT replay.
                  // The server-assigned id is preserved as a non-key field.
                  completedSuccessfully = true;
                  const finalMessageId = parsed.messageId || parsed.message_id;
                  const processingTime =
                    parsed.processing_time_ms || parsed.processingTimeMs;
                  const chunksRetrieved =
                    parsed.chunks_retrieved ?? parsed.totalChunks;

                  if (conversationId && assistantMessageId) {
                    queryClient.setQueryData<ConversationWithMessages>(
                      ["ai-conversation", conversationId],
                      (old) => {
                        const entry = ensureCacheEntry(old);
                        const messages = [...entry.messages];

                        const assistantMsgIndex = messages.findIndex(
                          (m) => m.id === assistantMessageId,
                        );

                        const finalMessage: ChatMessage = {
                          id: assistantMessageId!,
                          role: "assistant",
                          content: accumulatedAnswer,
                          createdAt:
                            messages[assistantMsgIndex]?.createdAt ??
                            new Date().toISOString(),
                          processingTimeMs: processingTime,
                          chunksRetrieved: chunksRetrieved,
                          sources:
                            accumulatedSources.length > 0
                              ? accumulatedSources.map((s) => ({
                                  file_id: s.fileId,
                                  chunk_index: s.chunkIndex,
                                  content: s.content,
                                  relevance_score: s.relevanceScore,
                                  section_title: "",
                                }))
                              : undefined,
                        };
                        // Track the real server id for future API calls
                        // without using it as the React key.
                        (finalMessage as any).serverId = finalMessageId || null;

                        if (assistantMsgIndex !== -1) {
                          messages[assistantMsgIndex] = finalMessage;
                        } else {
                          messages.push(finalMessage);
                        }

                        return { ...entry, messages };
                      },
                    );
                  }
                }

                // Reset event type after processing
                currentEvent = "";
              } catch (eventError) {
                console.error("[SSE Event Processing Error]", eventError);
                currentEvent = "";
              }
            }
          }
        }

        // Fallback: if stream ended without a "complete" event, ensure message is in cache
        if (
          !completedSuccessfully &&
          accumulatedAnswer &&
          conversationId &&
          assistantMessageId
        ) {
          console.warn(
            "[SSE] Stream ended without complete event — saving accumulated answer as fallback",
          );
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              const entry = ensureCacheEntry(old);
              const messages = [...entry.messages];
              const idx = messages.findIndex(
                (m) => m.id === assistantMessageId,
              );

              const fallbackMessage: ChatMessage = {
                id: assistantMessageId!,
                role: "assistant",
                content: accumulatedAnswer,
                createdAt: new Date().toISOString(),
                sources:
                  accumulatedSources.length > 0
                    ? accumulatedSources.map((s) => ({
                        file_id: s.fileId,
                        chunk_index: s.chunkIndex,
                        content: s.content,
                        relevance_score: s.relevanceScore,
                        section_title: "",
                      }))
                    : undefined,
              };

              if (idx !== -1) {
                messages[idx] = fallbackMessage;
              } else {
                messages.push(fallbackMessage);
              }

              return { ...entry, messages };
            },
          );
        }

        // Invalidate conversations list so the sidebar picks up the new
        // title / last-message preview.
        queryClient.invalidateQueries({
          queryKey: ["ai-conversations"],
        });

        // NOTE: we intentionally do NOT invalidate ["ai-conversation", id]
        // here. The cache already contains the final messages (written from
        // the SSE complete event). An immediate refetch would replace our
        // local message ids with server-assigned ids, which changes the
        // React keys for every bubble and triggers framer-motion entry
        // animations a second time right after the reply finishes. The
        // cached data becomes naturally stale (staleTime=30s in
        // use-fetch-conversation) and will refetch on next use.

        setStreamingState((prev) => ({
          ...prev,
          isStreaming: false,
          streamingMessage: null,
          pendingUserMessage: null,
        }));
      } catch (error: any) {
        console.error("[SSE Error]", error);
        const errorMsg =
          error?.message || "Failed to send message. Please try again.";

        // Even on error, save accumulated answer if we have one
        if (accumulatedAnswer && conversationId && assistantMessageId) {
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              const entry = ensureCacheEntry(old);
              const messages = [...entry.messages];
              const idx = messages.findIndex(
                (m) => m.id === assistantMessageId,
              );

              const partialMessage: ChatMessage = {
                id: assistantMessageId!,
                role: "assistant",
                content: accumulatedAnswer,
                createdAt: new Date().toISOString(),
              };

              if (idx !== -1) {
                messages[idx] = partialMessage;
              } else {
                messages.push(partialMessage);
              }

              return { ...entry, messages };
            },
          );
        }

        setStreamingState((prev) => ({
          ...prev,
          isStreaming: false,
          streamingMessage: null,
          pendingUserMessage: null,
          error: errorMsg,
        }));

        toast.error(errorMsg);

        // Only remove optimistic user message if we have NO accumulated answer
        if (!accumulatedAnswer && conversationId && userMessageId) {
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              if (!old) return old;
              return {
                ...old,
                messages: old.messages.filter((m) => m.id !== userMessageId),
              };
            },
          );
        }
      }
    },
    [queryClient],
  );

  const resetStreaming = useCallback(() => {
    setStreamingState({
      isStreaming: false,
      streamingMessage: null,
      pendingUserMessage: null,
      sources: [],
      error: null,
    });
  }, []);

  return {
    streamQuery,
    isStreaming: streamingState.isStreaming,
    streamingMessage: streamingState.streamingMessage,
    pendingUserMessage: streamingState.pendingUserMessage,
    sources: streamingState.sources,
    error: streamingState.error,
    resetStreaming,
  };
}

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
      };
      userMessageId = optimisticUserMessage.id;

      setStreamingState({
        isStreaming: true,
        streamingMessage: null,
        pendingUserMessage: !conversationId ? optimisticUserMessage : null,
        sources: [],
        error: null,
      });

      try {
        // Fix 3: Cancel any in-flight conversation queries to prevent race conditions
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
              if (!old) return old;
              return {
                ...old,
                messages: [...old.messages, optimisticUserMessage],
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

              // Fix 1: Handle error events OUTSIDE try-catch so they propagate
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
                    onConversationCreated?.(conversationId);

                    // Fix 3: Cancel any queries for the new conversation too
                    await queryClient.cancelQueries({
                      queryKey: ["ai-conversation", conversationId],
                    });
                  }

                  // If this is a new conversation, add user message now
                  if (!payload.conversationId) {
                    queryClient.setQueryData<ConversationWithMessages>(
                      ["ai-conversation", conversationId],
                      (old) => ({
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

                    // Fix 5: Don't invalidate conversations list mid-stream
                    // It will be invalidated after streaming ends
                  }
                } else if (currentEvent === "status" && parsed.status) {
                  // status event - could be used to show "searching", "generating", etc.
                  // Silently ignore for now
                } else if (currentEvent === "chunk" || parsed.text !== undefined) {
                  // chunk event - progressive text streaming
                  const chunkText = parsed.text || "";
                  accumulatedAnswer += chunkText;

                  // Create streaming message for real-time display
                  if (!assistantMessageId) {
                    assistantMessageId = `assistant-streaming-${Date.now()}`;
                  }

                  // Update state for smooth streaming display
                  setStreamingState((prev) => ({
                    ...prev,
                    streamingMessage: {
                      id: assistantMessageId!,
                      role: "assistant",
                      content: accumulatedAnswer,
                      createdAt: new Date().toISOString(),
                    },
                  }));

                  // Note: We don't update cache on every chunk for performance
                  // Cache will be updated with final message on 'complete' event
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

                  // Update assistant message with sources
                  if (conversationId && assistantMessageId) {
                    queryClient.setQueryData<ConversationWithMessages>(
                      ["ai-conversation", conversationId],
                      (old) => {
                        if (!old) return old;
                        const messages = [...old.messages];
                        const assistantMsgIndex = messages.findIndex(
                          (m) =>
                            m.id === assistantMessageId ||
                            m.id.startsWith("assistant-streaming"),
                        );

                        if (assistantMsgIndex !== -1) {
                          messages[assistantMsgIndex] = {
                            ...messages[assistantMsgIndex],
                            sources: accumulatedSources.map((s) => ({
                              file_id: s.fileId,
                              chunk_index: s.chunkIndex,
                              content: s.content,
                              relevance_score: s.relevanceScore,
                              section_title: "",
                            })),
                          };
                        }

                        return { ...old, messages };
                      },
                    );
                  }
                } else if (currentEvent === "complete" || parsed.messageId || parsed.processing_time_ms !== undefined) {
                  // complete event - finalize the streaming message
                  completedSuccessfully = true;
                  const finalMessageId = parsed.messageId || parsed.message_id;
                  const processingTime = parsed.processing_time_ms || parsed.processingTimeMs;
                  const chunksRetrieved = parsed.chunks_retrieved || parsed.totalChunks;

                  // Add or update the final assistant message in cache
                  if (conversationId && assistantMessageId) {
                    queryClient.setQueryData<ConversationWithMessages>(
                      ["ai-conversation", conversationId],
                      (old) => {
                        if (!old) return old;
                        const messages = [...old.messages];

                        // Find existing streaming message or add new one
                        const assistantMsgIndex = messages.findIndex((m) =>
                          m.id === assistantMessageId || m.id.startsWith("assistant-streaming"),
                        );

                        const finalMessage: ChatMessage = {
                          id: finalMessageId || assistantMessageId,
                          role: "assistant",
                          content: accumulatedAnswer,
                          createdAt: new Date().toISOString(),
                          processingTimeMs: processingTime,
                          chunksRetrieved: chunksRetrieved,
                          sources: accumulatedSources.length > 0
                            ? accumulatedSources.map((s) => ({
                                file_id: s.fileId,
                                chunk_index: s.chunkIndex,
                                content: s.content,
                                relevance_score: s.relevanceScore,
                                section_title: "",
                              }))
                            : undefined,
                        };

                        if (assistantMsgIndex !== -1) {
                          // Update existing message
                          messages[assistantMsgIndex] = finalMessage;
                        } else {
                          // Add new message
                          messages.push(finalMessage);
                        }

                        return { ...old, messages };
                      },
                    );
                  }
                }

                // Reset event type after processing
                currentEvent = "";
              } catch (eventError) {
                console.error("[SSE Event Processing Error]", eventError);
                // Continue processing other events - don't break the stream
                // for non-critical processing errors
                currentEvent = "";
              }
            }
          }
        }

        // Fix 2: If stream ended without a "complete" event, save accumulated answer as fallback
        if (!completedSuccessfully && accumulatedAnswer && conversationId && assistantMessageId) {
          console.warn("[SSE] Stream ended without complete event — saving accumulated answer as fallback");
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              if (!old) return old;
              const messages = [...old.messages];
              const assistantMsgIndex = messages.findIndex(
                (m) => m.id === assistantMessageId || m.id.startsWith("assistant-streaming"),
              );

              const fallbackMessage: ChatMessage = {
                id: assistantMessageId!,
                role: "assistant",
                content: accumulatedAnswer,
                createdAt: new Date().toISOString(),
                sources: accumulatedSources.length > 0
                  ? accumulatedSources.map((s) => ({
                      file_id: s.fileId,
                      chunk_index: s.chunkIndex,
                      content: s.content,
                      relevance_score: s.relevanceScore,
                      section_title: "",
                    }))
                  : undefined,
              };

              if (assistantMsgIndex !== -1) {
                messages[assistantMsgIndex] = fallbackMessage;
              } else {
                messages.push(fallbackMessage);
              }

              return { ...old, messages };
            },
          );
        }

        // Fix 5: Invalidate conversations list AFTER streaming ends (not mid-stream)
        queryClient.invalidateQueries({
          queryKey: ["ai-conversations"],
        });

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

        // Fix 2: Even on error, save accumulated answer if we have one
        if (accumulatedAnswer && conversationId && assistantMessageId) {
          queryClient.setQueryData<ConversationWithMessages>(
            ["ai-conversation", conversationId],
            (old) => {
              if (!old) return old;
              const messages = [...old.messages];
              const assistantMsgIndex = messages.findIndex(
                (m) => m.id === assistantMessageId || m.id.startsWith("assistant-streaming"),
              );

              const partialMessage: ChatMessage = {
                id: assistantMessageId!,
                role: "assistant",
                content: accumulatedAnswer,
                createdAt: new Date().toISOString(),
              };

              if (assistantMsgIndex !== -1) {
                messages[assistantMsgIndex] = partialMessage;
              } else {
                messages.push(partialMessage);
              }

              return { ...old, messages };
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
        // (meaning the request completely failed before any response)
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

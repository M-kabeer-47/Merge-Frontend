"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import type { LiveQnaQuestion, LiveQnaUser } from "@/types/live-qna";
import { fetchLiveQnaQuestions, askAiBotToAnswer } from "@/server-api/live-qna";

const COMMUNICATION_URL = process.env.NEXT_PUBLIC_COMMUNICATION_URL || "";

type WebSocketResponse<T = any> = {
  success: boolean;
  error?: string;
  payload?: T;
};

type UseLiveQnaOptions = {
  roomId: string | null;
  sessionId: string | null;
  currentUserId: string | null;
  currentUserProfile?: LiveQnaUser | null;
};

type QuestionPayload = { question: LiveQnaQuestion };

type RemovePayload = { id: string };

type QuestionEvent = LiveQnaQuestion & {
  viewerHasVoted?: boolean;
};

async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) return null;
    const data = await response.json();
    return data.token || null;
  } catch (error) {
    console.error("[LiveQna] Failed to fetch access token", error);
    return null;
  }
}

function normalizeQuestion(question: QuestionEvent, viewerId: string | null): LiveQnaQuestion {
  const { author, answeredBy } = question;
  return {
    ...question,
    viewerHasVoted: !!question.viewerHasVoted,
    isMine: Boolean(author && author.id === viewerId),
    author: author
      ? {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          image: author.image ?? null,
        }
      : {
          id: "",
          firstName: "Unknown",
          lastName: "User",
          image: null,
        },
    answeredBy: answeredBy
      ? {
          id: answeredBy.id,
          firstName: answeredBy.firstName,
          lastName: answeredBy.lastName,
          image: answeredBy.image ?? null,
        }
      : null,
    answeredAt: question.answeredAt ?? null,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  };
}

function cloneQuestions(questions: LiveQnaQuestion[]): LiveQnaQuestion[] {
  return questions.map((question) => ({
    ...question,
    author: { ...question.author },
    answeredBy: question.answeredBy ? { ...question.answeredBy } : null,
  }));
}

export function useLiveQna({
  roomId,
  sessionId,
  currentUserId,
  currentUserProfile,
}: UseLiveQnaOptions) {
  const [questions, setQuestions] = useState<LiveQnaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [askingBotFor, setAskingBotFor] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);
  const questionsRef = useRef<LiveQnaQuestion[]>([]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const resetState = useCallback(() => {
    setQuestions([]);
    questionsRef.current = [];
  }, []);

  const loadQuestions = useCallback(async () => {
    if (!roomId || !sessionId || !currentUserId) {
      resetState();
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchLiveQnaQuestions(roomId, sessionId);
      const normalized = data.map((question) => normalizeQuestion(question, currentUserId));
      const enriched = normalized.map((item) =>
        item.answeredBy || item.status !== "answered"
          ? item
          : {
              ...item,
              answeredBy: currentUserProfile
                ? {
                    id: currentUserId ?? "",
                    firstName: currentUserProfile.firstName,
                    lastName: currentUserProfile.lastName,
                    image: currentUserProfile.image ?? null,
                  }
                : null,
            },
      );
      setQuestions(enriched);
      questionsRef.current = enriched;
      setError(null);
    } catch (err: any) {
      console.error("[LiveQna] Failed to load questions", err);
      setError(err?.message || "Failed to load questions");
      toast.error(err?.message || "Failed to load questions");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, currentUserProfile, resetState, roomId, sessionId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    if (!roomId || !sessionId || !currentUserId) {
      return;
    }

    if (!COMMUNICATION_URL) {
      console.error("NEXT_PUBLIC_COMMUNICATION_URL is not configured.");
      return;
    }

    let isMounted = true;
    let socket: Socket | null = null;

    const setupSocket = async () => {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Authentication token not found for live Q&A");
        return;
      }
      if (!isMounted) return;

      socket = io(`${COMMUNICATION_URL}/live-qna`, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        if (!socket) return;
        setIsConnected(true);
        socket.emit("joinSession", { roomId, sessionId });
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.error("[LiveQna] Connection error", err.message);
        setError(`Connection error: ${err.message}`);
        toast.error(`Live Q&A connection error: ${err.message}`);
      });

      socket.on("questionCreated", (question: QuestionEvent) => {
        const normalized = normalizeQuestion(question, currentUserId);
        setQuestions((prev) => {
          const exists = prev.find((item) => item.id === normalized.id);
          if (exists) return prev;

          // If the broadcast arrives before our own ACK, replace any pending
          // optimistic temp we created for the same content.
          if (normalized.author?.id === currentUserId) {
            const tempIdx = prev.findIndex(
              (item) =>
                item.id.startsWith("temp-") &&
                item.author?.id === currentUserId &&
                item.content === normalized.content,
            );
            if (tempIdx >= 0) {
              const next = [...prev];
              next[tempIdx] = normalized;
              questionsRef.current = next;
              return next;
            }
          }

          const next = [...prev, normalized];
          questionsRef.current = next;
          return next;
        });
      });

      socket.on("questionUpdated", (question: QuestionEvent) => {
        const normalized = normalizeQuestion(question, currentUserId);
        setQuestions((prev) => {
          const next = prev.map((item) =>
            item.id === normalized.id
              ? {
                  ...normalized,
                  viewerHasVoted:
                    typeof question.viewerHasVoted === "boolean"
                      ? question.viewerHasVoted
                      : item.viewerHasVoted,
                }
              : item,
          );
          questionsRef.current = next;
          return next;
        });
      });

      socket.on("questionRemoved", ({ id }: { id: string }) => {
        setQuestions((prev) => {
          const next = prev.filter((item) => item.id !== id);
          questionsRef.current = next;
          return next;
        });
      });

      socket.on("error", (payload: { error?: string }) => {
        if (payload?.error) {
          toast.error(payload.error);
        }
      });
    };

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current?.connected) {
        socketRef.current.emit("leaveSession", { roomId, sessionId });
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, roomId, sessionId]);

  const emitWithAck = useCallback(
    <T extends WebSocketResponse<any>>(event: string, payload: object, onSuccess?: (response: T) => void, onError?: (response: T) => void) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        toast.error("Live Q&A connection is not available");
        return;
      }

      socket.emit(event, payload, (response: T) => {
        if (!response?.success) {
          const message = response?.error || `Failed to ${event}`;
          toast.error(message);
          onError?.(response);
          return;
        }
        onSuccess?.(response);
      });
    },
    [],
  );

  const sendQuestion = useCallback(
    (content: string) => {
      if (!roomId || !sessionId) return;
      const trimmed = content.trim();
      if (!trimmed) return;

      // Optimistic insert so the sender sees their own message instantly,
      // without waiting for the server ACK round-trip. The temp ID is
      // replaced with the real one on ACK (or by the broadcast handler if
      // it arrives first).
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const nowIso = new Date().toISOString();

      if (currentUserId && currentUserProfile) {
        const optimistic: LiveQnaQuestion = {
          id: tempId,
          roomId,
          sessionId,
          content: trimmed,
          status: "open",
          votesCount: 0,
          viewerHasVoted: false,
          isMine: true,
          author: {
            id: currentUserId,
            firstName: currentUserProfile.firstName,
            lastName: currentUserProfile.lastName,
            image: currentUserProfile.image ?? null,
          },
          answeredBy: null,
          answeredAt: null,
          aiAnswer: null,
          aiAnswerSources: null,
          aiAnsweredAt: null,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        setQuestions((prev) => {
          const next = [...prev, optimistic];
          questionsRef.current = next;
          return next;
        });
      }

      emitWithAck<WebSocketResponse<QuestionPayload>>(
        "askQuestion",
        { roomId, sessionId, content: trimmed },
        (response) => {
          if (!response.payload?.question) {
            // Defensive: if the server returned no question, still cleanup
            // the optimistic placeholder so we don't leave a phantom.
            setQuestions((prev) => {
              const next = prev.filter((item) => item.id !== tempId);
              questionsRef.current = next;
              return next;
            });
            return;
          }
          const normalized = normalizeQuestion(response.payload.question, currentUserId);
          setQuestions((prev) => {
            const filtered = prev.filter((item) => item.id !== tempId);
            const exists = filtered.find((item) => item.id === normalized.id);
            const next = exists
              ? filtered.map((item) => (item.id === normalized.id ? normalized : item))
              : [...filtered, normalized];
            questionsRef.current = next;
            return next;
          });
        },
        () => {
          // ACK failed — remove the optimistic so the user knows it didn't go.
          setQuestions((prev) => {
            const next = prev.filter((item) => item.id !== tempId);
            questionsRef.current = next;
            return next;
          });
        },
      );
    },
    [currentUserId, currentUserProfile, emitWithAck, roomId, sessionId],
  );

  const toggleVote = useCallback(
    (questionId: string, currentlyVoted: boolean) => {
      if (!roomId || !sessionId) return;

      const previous = cloneQuestions(questionsRef.current);
      const delta = currentlyVoted ? -1 : 1;

      setQuestions((prev) => {
        const next = prev.map((item) =>
          item.id === questionId
            ? {
                ...item,
                viewerHasVoted: !currentlyVoted,
                votesCount: Math.max(0, item.votesCount + delta),
              }
            : item,
        );
        questionsRef.current = next;
        return next;
      });

      emitWithAck<WebSocketResponse<QuestionPayload>>(
        currentlyVoted ? "unvoteQuestion" : "voteQuestion",
        { roomId, sessionId, questionId },
        (response) => {
          if (!response.payload?.question) return;
          const normalized = normalizeQuestion(response.payload.question, currentUserId);
          setQuestions((prev) => {
            const next = prev.map((item) =>
              item.id === normalized.id
                ? {
                    ...normalized,
                    viewerHasVoted: normalized.viewerHasVoted ?? !currentlyVoted,
                  }
                : item,
            );
            questionsRef.current = next;
            return next;
          });
        },
        () => {
          setQuestions(previous);
          questionsRef.current = previous;
        },
      );
    },
    [currentUserId, emitWithAck, roomId, sessionId],
  );

  const removeQuestion = useCallback(
    (questionId: string) => {
      if (!roomId || !sessionId) return;

      const previous = cloneQuestions(questionsRef.current);
      setQuestions((prev) => {
        const next = prev.filter((item) => item.id !== questionId);
        questionsRef.current = next;
        return next;
      });

      emitWithAck<WebSocketResponse<RemovePayload>>(
        "removeQuestion",
        { roomId, sessionId, questionId },
        () => {},
        () => {
          setQuestions(previous);
          questionsRef.current = previous;
        },
      );
    },
    [emitWithAck, roomId, sessionId],
  );

  const updateQuestionStatus = useCallback(
    (questionId: string, status: "open" | "answered") => {
      if (!roomId || !sessionId) return;

      const previous = cloneQuestions(questionsRef.current);

      setQuestions((prev) => {
        const next = prev.map((item) =>
          item.id === questionId
            ? {
                ...item,
                status,
                answeredAt: status === "answered" ? new Date().toISOString() : null,
                answeredBy:
                  status === "answered"
                    ? item.answeredBy ||
                      (currentUserProfile && currentUserId
                        ? {
                            id: currentUserId,
                            firstName: currentUserProfile.firstName,
                            lastName: currentUserProfile.lastName,
                            image: currentUserProfile.image ?? null,
                          }
                        : item.answeredBy)
                    : null,
              }
            : item,
        );
        questionsRef.current = next;
        return next;
      });

      emitWithAck<WebSocketResponse<QuestionPayload>>(
        "updateQuestionStatus",
        { roomId, sessionId, questionId, status },
        (response) => {
          if (!response.payload?.question) return;
          const normalized = normalizeQuestion(response.payload.question, currentUserId);
          setQuestions((prev) => {
            const next = prev.map((item) => (item.id === normalized.id ? normalized : item));
            questionsRef.current = next;
            return next;
          });
        },
        () => {
          setQuestions(previous);
          questionsRef.current = previous;
        },
      );
    },
    [currentUserId, emitWithAck, roomId, sessionId],
  );

  const askAiBot = useCallback(
    async (questionId: string) => {
      if (!roomId || !sessionId) return;
      setAskingBotFor((prev) => new Set(prev).add(questionId));
      try {
        const updated = await askAiBotToAnswer(roomId, sessionId, questionId);
        // Update state directly from REST response so the admin sees the answer
        // immediately, regardless of whether the Socket.IO broadcast arrives.
        if (updated) {
          setQuestions((prev) => {
            const next = prev.map((item) =>
              item.id === questionId ? { ...item, ...updated } : item,
            );
            questionsRef.current = next;
            return next;
          });
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "AI could not answer this question");
      } finally {
        setAskingBotFor((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      }
    },
    [roomId, sessionId],
  );

  const topQuestionId = useMemo(() => {
    if (!questions.length) return null;
    const sorted = [...questions].sort((a, b) => {
      if (b.votesCount !== a.votesCount) return b.votesCount - a.votesCount;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return sorted[0]?.id ?? null;
  }, [questions]);

  return {
    questions,
    isLoading,
    isConnected,
    error,
    topQuestionId,
    sendQuestion,
    toggleVote,
    removeQuestion,
    markAnswered: (questionId: string) => updateQuestionStatus(questionId, "answered"),
    markOpen: (questionId: string) => updateQuestionStatus(questionId, "open"),
    askAiBot,
    askingBotFor,
  };
}

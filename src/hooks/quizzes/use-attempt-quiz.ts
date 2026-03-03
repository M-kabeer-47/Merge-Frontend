import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type {
  AttemptQuizPayload,
  AttemptQuizResponse,
  StudentQuiz,
  Quiz,
} from "@/types/quiz";

interface UseAttemptQuizOptions {
  onSuccess?: (result: AttemptQuizResponse) => void;
}

interface QuizzesResponse {
  quizzes: Quiz[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export default function useAttemptQuiz({
  onSuccess,
}: UseAttemptQuizOptions = {}) {
  const queryClient = useQueryClient();

  // Helper to update quiz in a list cache
  // Handles both array format and object format (with .quizzes property)
  const updateQuizInList = (
    old: QuizzesResponse | Quiz[] | undefined,
    quizId: string,
    attemptData: AttemptQuizResponse
  ): QuizzesResponse | Quiz[] | undefined => {
    if (!old) return old;

    const updateQuiz = (quiz: Quiz): Quiz => {
      if (quiz.id !== quizId) return quiz;

      // Update as StudentQuiz with new attempt data
      return {
        ...quiz,
        submissionStatus: "graded",
        attempt: {
          id: attemptData.id,
          attemptedAt: new Date(attemptData.submittedAt),
          status: "graded",
          score: attemptData.score,
          totalPoints: attemptData.quiz.totalScore,
          answers: attemptData.answers,
        },
      } as StudentQuiz;
    };

    // If it's an array, map directly
    if (Array.isArray(old)) {
      return old.map(updateQuiz);
    }

    // If it's an object with quizzes property
    if (old.quizzes && Array.isArray(old.quizzes)) {
      return {
        ...old,
        quizzes: old.quizzes.map(updateQuiz),
      };
    }

    return old;
  };

  const attemptQuizMutation = useMutation({
    mutationFn: async (payload: AttemptQuizPayload) => {
      const response = await api.post<AttemptQuizResponse>(
        "/quiz/attempts",
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update individual quiz cache
      queryClient.setQueryData(
        ["quiz", variables.quizId, "student"],
        (old: StudentQuiz | undefined) => {
          if (!old) return old;
          return {
            ...old,
            submissionStatus: "graded",
            attempt: {
              id: data.id,
              attemptedAt: new Date(data.submittedAt),
              status: "graded",
              score: data.score,
              totalPoints: data.quiz.totalScore,
              answers: data.answers,
            },
          } as StudentQuiz;
        }
      );

      // Update all quiz list caches (different sort/filter params)
      const queryCache = queryClient.getQueryCache();
      const quizQueries = queryCache.findAll({
        queryKey: ["quizzes", variables.roomId],
      });

      quizQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (old: QuizzesResponse | Quiz[] | undefined) =>
            updateQuizInList(old, variables.quizId, data)
        );
      });

      // Show score in toast
      const percentage = Math.round((data.score / data.quiz.totalScore) * 100);
      toast.success(
        `Quiz submitted! Score: ${data.score}/${data.quiz.totalScore} (${percentage}%)`
      );

      onSuccess?.(data);
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to submit quiz. Please try again.");
    },
  });

  const attemptQuiz = async (payload: AttemptQuizPayload) => {
    return attemptQuizMutation.mutateAsync(payload);
  };

  return {
    attemptQuiz,
    isSubmitting: attemptQuizMutation.isPending,
    isSuccess: attemptQuizMutation.isSuccess,
    result: attemptQuizMutation.data,
  };
}

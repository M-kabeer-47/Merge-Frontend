import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type { AttemptQuizPayload, AttemptQuizResponse } from "@/types/quiz";

interface UseAttemptQuizOptions {
  onSuccess?: (result: AttemptQuizResponse) => void;
}

export default function useAttemptQuiz({
  onSuccess,
}: UseAttemptQuizOptions = {}) {
  const queryClient = useQueryClient();

  const attemptQuizMutation = useMutation({
    mutationFn: async (payload: AttemptQuizPayload) => {
      const response = await api.post<AttemptQuizResponse>(
        "/quiz/attempts",
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate quizzes query to refresh the list with new attempt
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.roomId],
      });

      // Show score in toast
      const percentage = Math.round((data.score / data.totalPoints) * 100);
      toast.success(
        `Quiz submitted! Score: ${data.score}/${data.totalPoints} (${percentage}%)`
      );

      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit quiz. Please try again."
      );
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

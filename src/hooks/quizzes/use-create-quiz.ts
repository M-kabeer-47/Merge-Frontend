import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type { CreateQuizPayload } from "@/types/quiz";

interface UseCreateQuizOptions {
  onSuccess?: () => void;
}

export default function useCreateQuiz({
  onSuccess,
}: UseCreateQuizOptions = {}) {
  const queryClient = useQueryClient();

  const createQuizMutation = useMutation({
    mutationFn: async (payload: CreateQuizPayload) => {
      const response = await api.post("/quiz/create", payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate quizzes query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["quizzes", variables.roomId],
      });

      toast.success("Quiz created successfully!");
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create quiz. Please try again."
      );
    },
  });

  const createQuiz = async (payload: CreateQuizPayload) => {
    return createQuizMutation.mutateAsync(payload);
  };

  return {
    createQuiz,
    isCreating: createQuizMutation.isPending,
    isSuccess: createQuizMutation.isSuccess,
  };
}

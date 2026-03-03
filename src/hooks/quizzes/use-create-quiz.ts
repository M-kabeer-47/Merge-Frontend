import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { CreateQuizPayload } from "@/types/quiz";
import { addQuizToCache } from "@/lib/cache";

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
    onSuccess: (newQuiz, variables) => {
      // Optimistically add quiz to cache + invalidate for background sync
      addQuizToCache(queryClient, variables.roomId, newQuiz);

      toast.success("Quiz created successfully!");
      onSuccess?.();
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to create quiz. Please try again.");
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

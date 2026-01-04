import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Quiz } from "@/types/quiz";

interface UseFetchQuizByIdParams {
  quizId: string;
  roomId: string;
  enabled?: boolean;
}

/**
 * Client-side hook to fetch a single quiz by ID
 */
export default function useFetchQuizById({
  quizId,
  roomId,
  enabled = true,
}: UseFetchQuizByIdParams) {
  return useQuery({
    queryKey: ["quiz", quizId, roomId],
    queryFn: async () => {
      const response = await api.get<Quiz>(`/quiz/${quizId}`, {
        params: { roomId },
      });
      return response.data;
    },
    enabled: enabled && !!quizId && !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

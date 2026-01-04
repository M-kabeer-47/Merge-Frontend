import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

interface QuizAttemptResult {
  id: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> selectedAnswer
  score: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  quiz: {
    id: string;
    title: string;
    totalScore: number;
  };
}

interface UseFetchQuizAttemptParams {
  quizId: string;
  roomId: string;
  enabled?: boolean;
}

/**
 * Client-side hook to fetch student's quiz attempt result
 */
export default function useFetchQuizAttempt({
  quizId,
  roomId,
  enabled = true,
}: UseFetchQuizAttemptParams) {
  return useQuery({
    queryKey: ["quiz-attempt", quizId, roomId],
    queryFn: async () => {
      const response = await api.get<QuizAttemptResult>(
        `/quiz/${quizId}/my-attempt`,
        {
          params: { roomId },
        }
      );
      return response.data;
    },
    enabled: enabled && !!quizId && !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

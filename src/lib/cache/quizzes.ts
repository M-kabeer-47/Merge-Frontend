import type { QueryClient } from "@tanstack/react-query";
import type { Quiz } from "@/types/quiz";

/**
 * Quiz Cache Utilities
 *
 * Provides cache operations for quiz data.
 */

/**
 * Optimistically add a new quiz to instructor cache
 * Used when instructor creates a quiz - item appears immediately
 */
export function addQuizToCache(
  queryClient: QueryClient,
  roomId: string,
  newQuiz: Quiz,
): void {
  console.log(`[Cache] Adding quiz: ${newQuiz.title}`);

  queryClient.setQueriesData<Quiz[]>(
    { queryKey: ["quizzes", roomId, "instructor"] },
    (old) => {
      if (!old) return [newQuiz];
      if (old.some((q) => q.id === newQuiz.id)) return old;
      return [newQuiz, ...old];
    },
  );
}

/**
 * Invalidate student quizzes cache
 * Used when notification is received - triggers background refetch
 */
export function invalidateStudentQuizzesCache(
  queryClient: QueryClient,
  roomId: string,
): void {
  console.log(`[Cache] Invalidating student quizzes for room: ${roomId}`);

  queryClient.invalidateQueries({
    queryKey: ["quizzes", roomId, "student"],
  });
}

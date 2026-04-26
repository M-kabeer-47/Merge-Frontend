import { getWithAuth } from "@/server-api/fetch-with-auth";
import type { Quiz } from "@/types/quiz";
import { API_BASE_URL } from "@/lib/constants/api";
import { buildQueryParams } from "@/utils/query-params";

export interface FetchQuizzesParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

interface QuizzesResponse {
  quizzes?: Quiz[];
}

export interface QuizAnswerKeyItem {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  points: number;
}

export interface QuizAttemptResult {
  id: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> selectedAnswer
  score: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  };
  quiz: {
    id: string;
    title: string;
    totalScore: number;
  };
  answerKey: QuizAnswerKeyItem[];
}

/**
 * Server-side fetch for quizzes with Next.js Data Cache
 * Uses fetchWithAuth for automatic token refresh
 */
export async function getQuizzes(params: FetchQuizzesParams): Promise<Quiz[]> {
  const { roomId, sortBy, sortOrder, search } = params;

  // Build query string
  const queryParams = buildQueryParams({
    roomId,
    sortBy,
    sortOrder: sortOrder?.toUpperCase(),
    search,
  });

  const { data, error } = await getWithAuth<QuizzesResponse | Quiz[]>(
    `${API_BASE_URL}/quiz?${queryParams.toString()}`,
    {
      next: {
        revalidate: 0, // Cache for 60 seconds
        tags: ["quizzes", `quizzes-${roomId}`], // For manual invalidation
      },
    }
  );

  if (error || !data) {
    console.error("Error fetching quizzes:", error);
    return [];
  }

  return Array.isArray(data) ? data : data.quizzes || [];
}

/**
 * Server-side fetch for a single quiz
 */
export async function getQuizById(
  quizId: string,
  roomId: string
): Promise<Quiz | null> {
  const { data, error } = await getWithAuth<Quiz>(
    `${API_BASE_URL}/quiz/${quizId}?roomId=${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: ["quizzes", `quiz-${quizId}`],
      },
    }
  );

  if (error || !data) {
    console.error("Error fetching quiz:", error);
    return null;
  }

  return data;
}

/**
 * 

 
 * Server-side fetch for student's quiz attempt (for review page)
 */
export async function getMyQuizAttempt(
  quizId: string,
  roomId: string
): Promise<QuizAttemptResult | null> {
  const { data, error } = await getWithAuth<QuizAttemptResult>(
    `${API_BASE_URL}/quiz/${quizId}/my-attempt?roomId=${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: ["quiz-attempt", `quiz-attempt-${quizId}`],
      },
    }
  );
  if (error || !data) {
    console.error("Error fetching quiz attempt:", error);
    return null;
  }

  return data;
}

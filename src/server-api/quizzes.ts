import { getWithAuth } from "@/server-api/fetch-with-auth";
import type { Quiz } from "@/types/quiz";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface FetchQuizzesParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

interface QuizzesResponse {
  quizzes?: Quiz[];
}

/**
 * Server-side fetch for quizzes with Next.js Data Cache
 * Uses fetchWithAuth for automatic token refresh
 */
export async function getQuizzes(params: FetchQuizzesParams): Promise<Quiz[]> {
  const { roomId, sortBy, sortOrder, search } = params;

  // Build query string
  const queryParams = new URLSearchParams({ roomId });
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);
  if (search) queryParams.append("search", search);

  const { data, error } = await getWithAuth<QuizzesResponse | Quiz[]>(
    `${API_BASE_URL}/quiz?${queryParams.toString()}`,
    {
      next: {
        revalidate: 60, // Cache for 60 seconds
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
        revalidate: 60,
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

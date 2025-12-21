import { cookies } from "next/headers";
import axios from "axios";
import { tryIt } from "@/utils/try-it";
import type { Quiz } from "@/types/quiz";

// Server-side axios instance (no client interceptors)
const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

interface FetchQuizzesParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

/**
 * Server-side function to fetch quizzes from the API
 * Uses a separate axios instance for server components (no localStorage/client interceptors)
 */
export async function fetchQuizzes(
  params: FetchQuizzesParams
): Promise<Quiz[]> {
  const { roomId, sortBy, sortOrder, search } = params;

  // Build query params
  const queryParams: Record<string, string> = { roomId };
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortOrder) queryParams.sortOrder = sortOrder;
  if (search) queryParams.search = search;

  // Get access token from cookies for server-side auth
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const [response, error] = await tryIt(
    serverApi.get<{ quizzes?: Quiz[] } | Quiz[]>("/quiz", {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })
  );

  if (error) {
    console.error("Failed to fetch quizzes:", error.message);
    return [];
  }

  const data = response.data;
  // Handle both {quizzes: [...]} and [...] response formats
  return Array.isArray(data) ? data : data.quizzes || [];
}

interface FetchQuizByIdParams {
  quizId: string;
  roomId: string;
}

/**
 * Server-side function to fetch a single quiz by ID
 */
export async function fetchQuizById(
  params: FetchQuizByIdParams
): Promise<Quiz | null> {
  const { quizId, roomId } = params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const [response, error] = await tryIt(
    serverApi.get<Quiz>(`/quiz/${quizId}`, {
      params: { roomId },
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })
  );

  if (error) {
    console.error("Failed to fetch quiz:", error.message);
    return null;
  }

  return response.data;
}

import type { Quiz } from "@/types/quiz";
import { API_BASE_URL } from "@/lib/constants/api";

export interface FetchQuizzesParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export async function fetchQuizzesServer(
  params: FetchQuizzesParams,
  accessToken: string
): Promise<Quiz[]> {
  const {
    roomId,
    sortBy = "deadline",
    sortOrder = "asc",
    search = "",
  } = params;

  // Build query string
  const queryParams = new URLSearchParams({ roomId });
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);
  if (search) queryParams.append("search", search);

  // Get access token from cookies

  try {
    const response = await fetch(
      `${API_BASE_URL}/quiz?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        // Next.js Data Cache: revalidate every 60 seconds
        next: { tags: ["quizzes", roomId] },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch quizzes:", response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.quizzes || [];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

/**
 * Client-side fetch using axios (for React Query)
 * This is called when filters change on the client
 */
export async function fetchQuizzesClient(
  params: FetchQuizzesParams
): Promise<Quiz[]> {
  // Dynamic import to avoid server-side issues
  const { default: api } = await import("@/utils/api");

  const { roomId, sortBy, sortOrder, search } = params;

  try {
    const response = await api.get<{ quizzes?: Quiz[] } | Quiz[]>("/quiz", {
      params: {
        roomId,
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(search && { search }),
      },
    });

    const data = response.data;
    return Array.isArray(data) ? data : data.quizzes || [];
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    return [];
  }
}

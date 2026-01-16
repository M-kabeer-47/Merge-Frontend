import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { Quiz } from "@/types/quiz";

interface UseFetchQuizzesParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  enabled?: boolean;
}

interface QuizzesResponse {
  quizzes?: Quiz[];
}

/**
 * Client-side hook to fetch quizzes using React Query
 * Re-fetches automatically when params change
 */
export default function useFetchQuizzes({
  roomId,
  sortBy = "endAt",
  sortOrder = "asc",
  search = "",
  enabled = true,
}: UseFetchQuizzesParams) {
  return useQuery({
    queryKey: ["quizzes", roomId, sortBy, sortOrder, search],
    queryFn: async () => {
      const params: Record<string, string> = { roomId };
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder.toUpperCase();
      if (search) params.search = search;

      const response = await api.get<QuizzesResponse | Quiz[]>("/quiz", {
        params,
      });

      const data = response.data;
      // Handle both {quizzes: [...]} and [...] response formats
      return Array.isArray(data) ? data : data.quizzes || [];
    },
    enabled: enabled && !!roomId,
    staleTime: Infinity, // 30 seconds
  });
}

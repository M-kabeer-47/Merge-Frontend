import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import type { StudentQuiz, InstructorQuiz, Quiz } from "@/types/quiz";

interface FetchQuizzesParams {
  roomId: string;
  isInstructor: boolean;
  search?: string;
  sortBy?: string;
  filter?: string;
  sortOrder?: "asc" | "desc";
}

interface QuizzesResponse<T> {
  quizzes?: T[];
}

/**
 * Client-side hook to fetch quizzes based on user role
 * Uses the role from RoomProvider to determine which endpoint to call
 */
export default function useFetchRoleBasedQuizzes({
  roomId,
  isInstructor,
  search,
  sortBy,
  filter,
  sortOrder,
}: FetchQuizzesParams) {
  const endpoint = isInstructor ? "/quiz/instructor" : "/quiz/student";

  const queryKey = [
    "quizzes",
    roomId,
    isInstructor ? "instructor" : "student",
    search || "",
    sortBy || null,
    filter || null,
    sortOrder || null,
  ];

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Quiz[]> => {
      const params = new URLSearchParams({ roomId });
      if (search) params.append("search", search);
      if (sortBy) params.append("sortBy", sortBy);
      if (filter) params.append("filter", filter);
      if (sortOrder) params.append("sortOrder", sortOrder.toUpperCase());
      console.log("params", params);
      const response = await api.get<
        QuizzesResponse<StudentQuiz | InstructorQuiz> | Quiz[]
      >(`${endpoint}?${params.toString()}`);

      const data = response.data;
      return Array.isArray(data) ? data : data.quizzes || [];
    },
    enabled: !!roomId,
    staleTime: Infinity,
  });
}

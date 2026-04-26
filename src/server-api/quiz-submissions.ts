import { getWithAuth } from "@/server-api/fetch-with-auth";
import type { InstructorQuizDetail } from "@/types/quiz";
import { API_BASE_URL } from "@/lib/constants/api";

export async function getQuizSubmissions(
  roomId: string,
  quizId: string
): Promise<InstructorQuizDetail | null> {
  if (!roomId || !quizId) {
    console.error("getQuizSubmissions: roomId and quizId are required");
    return null;
  }

  const { data, error } = await getWithAuth<InstructorQuizDetail>(
    `${API_BASE_URL}/quiz/instructor/${quizId}?roomId=${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: ["quizzes", `quiz-${quizId}`, `quiz-submissions-${quizId}`],
      },
    }
  );
  console.log("Data:", JSON.stringify(data));
  console.log("Error:", JSON.stringify(error));
  if (error || !data) {
    console.error("Error fetching quiz submissions:", error);
    return null;
  }

  return data;
}

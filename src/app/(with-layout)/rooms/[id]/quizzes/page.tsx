import { getQuizzes } from "@/server-api/quizzes";
import QuizListClient from "@/components/quizzes/QuizListClient";
import type { QuizSortOption, QuizFilterType } from "@/types/quiz";

interface QuizzesPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
    role?: string;
  }>;
}

export default async function QuizzesPage({
  params,
  searchParams,
}: QuizzesPageProps) {
  const { id: roomId } = await params;
  const { search, sortBy, sortOrder, filter, role } = await searchParams;
  const isInstructor = role === "instructor";

  // Direct server-side fetch with Next.js Data Cache (revalidate: 60)
  const quizzes = await getQuizzes({
    roomId,
    sortBy,
    sortOrder,
    search,
  });

  return (
    <QuizListClient
      quizzes={quizzes}
      roomId={roomId}
      isInstructor={isInstructor}
      initialSearch={search || ""}
      initialSort={(sortBy as QuizSortOption) || "deadline"}
      initialFilter={(filter as QuizFilterType) || "all"}
    />
  );
}

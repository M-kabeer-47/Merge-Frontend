import { Suspense } from "react";
import { getQuizzes } from "@/server-api/quizzes";
import QuizListClient from "@/components/quizzes/QuizListClient";
import QuizzesSkeleton from "@/components/quizzes/QuizzesSkeleton";
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

// Async component for data fetching with Suspense
async function QuizzesContent({
  roomId,
  search,
  sortBy,
  sortOrder,
  filter,
  isInstructor,
}: {
  roomId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filter?: string;
  isInstructor: boolean;
}) {
  // Fetch quizzes using server API (with Next.js Data Cache)
  const quizzes = await getQuizzes({
    roomId,
    sortBy,
    sortOrder,
    search,
  });

  return (
    <QuizListClient
      roomId={roomId}
      quizzes={quizzes}
      isInstructor={isInstructor}
      initialSearch={search}
      initialSort={sortBy as QuizSortOption}
      initialFilter={filter as QuizFilterType}
    />
  );
}

export default async function QuizzesPage({
  params,
  searchParams,
}: QuizzesPageProps) {
  const { id: roomId } = await params;
  const { search, sortBy, sortOrder, filter, role } = await searchParams;
  const isInstructor = role === "instructor";

  return (
    <Suspense fallback={<QuizzesSkeleton />}>
      <QuizzesContent
        roomId={roomId}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        filter={filter}
        isInstructor={isInstructor}
      />
    </Suspense>
  );
}

import { Suspense } from "react";
import QuizListHeader from "@/components/quizzes/QuizListHeader";
import QuizCards from "@/components/quizzes/QuizCards";
import QuizCardsSkeleton from "@/components/quizzes/QuizCardsSkeleton";
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

  // Create a key that changes when search params change
  // This forces Suspense to re-trigger and show the fallback
  const suspenseKey = `${search}-${sortBy}-${sortOrder}-${filter}`;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header - always visible */}
      <QuizListHeader
        roomId={roomId}
        isInstructor={isInstructor}
        initialSearch={search}
        initialSort={sortBy as QuizSortOption}
        initialFilter={filter as QuizFilterType}
      />

      {/* Quiz Cards - shows skeleton during loading */}
      <Suspense key={suspenseKey} fallback={<QuizCardsSkeleton />}>
        <QuizCards
          roomId={roomId}
          isInstructor={isInstructor}
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          filter={filter}
        />
      </Suspense>
    </div>
  );
}

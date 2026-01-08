import QuizListHeader from "@/components/quizzes/QuizListHeader";
import QuizzesList from "@/components/quizzes/QuizzesList";
import type { QuizSortOption, QuizFilterType } from "@/types/quiz";

interface QuizzesPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }>;
}

export default async function QuizzesPage({
  params,
  searchParams,
}: QuizzesPageProps) {
  const { id: roomId } = await params;
  const { search, sortBy, filter } = await searchParams;

  return (
    <div className="h-full flex flex-col bg-main-background">
      <QuizListHeader
        roomId={roomId}
        initialSearch={search}
        initialSort={sortBy as QuizSortOption}
        initialFilter={filter as QuizFilterType}
      />
      {/* QuizzesList is now a client component that:
          - Uses useRoom() to get user role (already fetched in layout)
          - Uses useSearchParams() to read URL filters
          - Fetches quizzes via React Query based on role
      */}
      <QuizzesList roomId={roomId} />
    </div>
  );
}

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
  const { search, sortBy, filter, sortOrder } = await searchParams;

  return (
    <div className="h-full flex flex-col bg-main-background">
      <QuizListHeader
        roomId={roomId}
        initialSearch={search}
        initialSort={sortBy as QuizSortOption}
        initialFilter={filter as QuizFilterType}
        initialSortOrder={sortOrder as "asc" | "desc"}
      />
      <QuizzesList
        roomId={roomId}
        search={search}
        sortBy={sortBy}
        filter={filter}
        sortOrder={sortOrder as "asc" | "desc"}
      />
    </div>
  );
}

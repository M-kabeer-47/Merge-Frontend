import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchQuizzesServer } from "@/utils/quiz-api";
import QuizListClient from "@/components/quizzes/QuizListClient";
import QuizzesSkeleton from "@/components/quizzes/QuizzesSkeleton";
import type { QuizSortOption, QuizFilterType } from "@/types/quiz";
import { cookies } from "next/headers";

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

// Separate async component for data fetching with Suspense
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
  // Create QueryClient and prefetch using server-side function (with Data Cache)
  const queryClient = new QueryClient();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  await queryClient.prefetchQuery({
    queryKey: ["quizzes", roomId, { sortBy, sortOrder, search }],
    queryFn: () =>
      fetchQuizzesServer({ roomId, sortBy, sortOrder, search }, accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizListClient
        roomId={roomId}
        isInstructor={isInstructor}
        initialSearch={search || ""}
        initialSort={(sortBy as QuizSortOption) || "deadline"}
        initialFilter={(filter as QuizFilterType) || "all"}
      />
    </HydrationBoundary>
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

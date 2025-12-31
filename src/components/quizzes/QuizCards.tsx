import { getQuizzes } from "@/server-api/quizzes";
import QuizCardsClient from "./QuizCardsClient";

interface QuizCardsProps {
  roomId: string;
  isInstructor: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filter?: string;
}

// Server component that fetches quiz data
export default async function QuizCards({
  roomId,
  isInstructor,
  search,
  sortBy,
  sortOrder,
  filter,
}: QuizCardsProps) {
  // Server-side fetch with Next.js caching
  const quizzes = await getQuizzes({
    roomId,
    sortBy,
    sortOrder,
    search,
  });

  return (
    <QuizCardsClient
      quizzes={quizzes}
      roomId={roomId}
      isInstructor={isInstructor}
      filter={filter}
      searchTerm={search || ""}
    />
  );
}

import { Suspense } from "react";
import { getQuizById } from "@/server-api/quizzes";
import QuizAttemptClient from "@/components/quizzes/QuizAttemptClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface QuizAttemptPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizAttemptPage({
  params,
}: QuizAttemptPageProps) {
  const { id: roomId, quizId } = await params;

  // Fetch quiz data on server
  const quiz = await getQuizById(quizId, roomId);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-para-muted mb-4">Quiz not found</p>
          <Link href={`/rooms/${roomId}/quizzes`}>
            <Button>Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-main-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <QuizAttemptClient quiz={quiz} />
    </Suspense>
  );
}

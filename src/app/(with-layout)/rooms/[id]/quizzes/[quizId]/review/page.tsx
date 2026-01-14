import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getMyQuizAttempt } from "@/server-api/quizzes";
import QuizReviewClient from "@/components/quizzes/QuizReviewClient";

interface QuizReviewPageProps {
  params: Promise<{
    id: string;
    quizId: string;
  }>;
}

export default async function QuizReviewPage({ params }: QuizReviewPageProps) {
  const { id: roomId, quizId } = await params;

  // Fetch attempt data server-side (includes answerKey with questions)
  const attemptData = await getMyQuizAttempt(quizId, roomId);

  if (!attemptData) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-para-muted">Quiz attempt not found</p>
          <Link href={`/rooms/${roomId}/quizzes`}>
            <Button className="mt-4">Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <QuizReviewClient attemptData={attemptData} roomId={roomId} />;
}

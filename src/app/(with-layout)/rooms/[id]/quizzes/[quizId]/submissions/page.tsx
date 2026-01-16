import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getQuizSubmissions } from "@/server-api/quiz-submissions";
import QuizHorizontalStats from "@/components/quizzes/submissions/QuizHorizontalStats";
import QuizSubmissionsTable from "@/components/quizzes/submissions/QuizSubmissionsTable";

interface QuizSubmissionsPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default async function QuizSubmissionsPage({
  params,
}: QuizSubmissionsPageProps) {
  const { id: roomId, quizId } = await params;

  const quiz = await getQuizSubmissions(roomId, quizId);

  if (!quiz) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-main-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-light-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/rooms/${roomId}/quizzes`}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-heading" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-heading font-raleway">
                {quiz.title}
              </h1>
              <p className="text-xs text-para-muted">Submission Overview</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Cards */}
          <QuizHorizontalStats
            totalAttempts={quiz.attempts.total}
            totalQuestions={quiz.questions.length}
            totalPoints={quiz.totalPoints}
            averageScore={quiz.averageScore}
          />

          {/* Submissions Table */}
          <QuizSubmissionsTable
            attempts={quiz.attempts.data}
            questions={quiz.questions}
            totalPoints={quiz.totalPoints}
          />
        </div>
      </main>
    </div>
  );
}

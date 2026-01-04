"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Users, Trophy, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useFetchQuizzes from "@/hooks/quizzes/use-fetch-quizzes";
import type { Quiz, InstructorQuiz } from "@/types/quiz";
import { isInstructorQuiz } from "@/types/quiz";
import Image from "next/image";

export default function QuizSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  const quizId = params?.quizId as string;

  // Fetch quiz data
  const { data: quizzes, isLoading } = useFetchQuizzes({
    roomId,
    enabled: !!roomId,
  });

  const quiz = quizzes?.find((q) => q.id === quizId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quiz || !isInstructorQuiz(quiz)) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-para-muted">Quiz not found or not accessible</p>
          <Button
            onClick={() => router.push(`/rooms/${roomId}/quizzes`)}
            className="mt-4"
          >
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const instructorQuiz = quiz as InstructorQuiz;
  const { submissionStats } = instructorQuiz;

  const formatDeadline = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-main-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-light-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/rooms/${roomId}/quizzes`)}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-heading" />
            </button>
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
          {/* Quiz Info Card */}
          <div className="bg-background border border-light-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Quiz Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Image
                    src="/icons/trophy.jpg"
                    alt="Points"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <div className="text-xs text-para-muted">Total Points</div>
                  <div className="text-lg font-semibold text-heading">
                    {quiz.totalPoints}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Image
                    src="/icons/timer.png"
                    alt="Time"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <div className="text-xs text-para-muted">Time Limit</div>
                  <div className="text-lg font-semibold text-heading">
                    {quiz.timeLimitMin} min
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Image
                    src="/icons/question.png"
                    alt="Questions"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <div className="text-xs text-para-muted">Questions</div>
                  <div className="text-lg font-semibold text-heading">
                    {quiz.questions.length}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-para-muted">Deadline</div>
                  <div className="text-sm font-semibold text-heading">
                    {formatDeadline(quiz.deadline)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-background border border-light-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Submission Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-secondary mb-1">
                  {submissionStats.attempted}/{submissionStats.total}
                </div>
                <div className="text-sm text-para-muted">
                  Students Attempted
                </div>
                <div className="text-xs text-para-muted mt-1">
                  {Math.round(
                    (submissionStats.attempted / submissionStats.total) * 100
                  )}
                  % participation
                </div>
              </div>

              <div className="text-center p-6 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div className="text-3xl font-bold text-success mb-1">
                  {Math.round(submissionStats.averageScore)}%
                </div>
                <div className="text-sm text-para-muted">Average Score</div>
              </div>

              <div className="text-center p-6 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-1">
                  {quiz.totalPoints}
                </div>
                <div className="text-sm text-para-muted">Max Possible</div>
              </div>
            </div>
          </div>

          {/* Student Submissions List */}
          <div className="bg-background border border-light-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Student Submissions
            </h2>

            {submissionStats.attempted === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-para-muted mx-auto mb-3" />
                <p className="text-para-muted">
                  No submissions yet. Check back later when students have
                  attempted the quiz.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-para-muted mb-2">
                  {submissionStats.attempted} student(s) have attempted this
                  quiz.
                </p>
                <p className="text-sm text-para-muted">
                  Detailed submission list and individual student results coming
                  soon.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => router.push(`/rooms/${roomId}/quizzes`)}
              size="lg"
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

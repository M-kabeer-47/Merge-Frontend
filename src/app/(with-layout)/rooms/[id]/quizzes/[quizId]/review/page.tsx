"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useFetchQuizzes from "@/hooks/quizzes/use-fetch-quizzes";
import useFetchQuizAttempt from "@/hooks/quizzes/use-fetch-quiz-attempt";

export default function QuizReviewPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  const quizId = params?.quizId as string;

  // Fetch quiz data (for questions)
  const { data: quizzes, isLoading: isLoadingQuiz } = useFetchQuizzes({
    roomId,
    enabled: !!roomId,
  });

  // Fetch student's attempt data
  const { data: attemptData, isLoading: isLoadingAttempt } =
    useFetchQuizAttempt({
      quizId,
      roomId,
      enabled: !!quizId && !!roomId,
    });

  const quiz = quizzes?.find((q) => q.id === quizId);
  const isLoading = isLoadingQuiz || isLoadingAttempt;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quiz || !attemptData) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-para-muted">Quiz attempt not found</p>
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

  const percentage = Math.round(
    (attemptData.score / attemptData.quiz.totalScore) * 100
  );

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
              <p className="text-xs text-para-muted">Quiz Review</p>
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-secondary">
                {percentage}%
              </div>
              <div className="text-xs text-para-muted">
                {attemptData.score}/{attemptData.quiz.totalScore} points
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary Card */}
          <div className="bg-background border border-light-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-heading mb-4">
              Quiz Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {attemptData.score}
                </div>
                <div className="text-xs text-para-muted">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-heading">
                  {attemptData.quiz.totalScore}
                </div>
                <div className="text-xs text-para-muted">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-heading">
                  {quiz.questions.length}
                </div>
                <div className="text-xs text-para-muted">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {percentage}%
                </div>
                <div className="text-xs text-para-muted">Percentage</div>
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-heading">
              Question Review
            </h2>

            {quiz.questions.map((question, index) => {
              const userAnswer = attemptData.answers?.[question.id];
              const isCorrect = userAnswer === question.correctOption;

              return (
                <div
                  key={question.id}
                  className="bg-background border border-light-border rounded-xl p-6"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
                          Question {index + 1}
                        </span>
                        <span className="text-xs font-medium text-para-muted">
                          {question.points}{" "}
                          {question.points === 1 ? "point" : "points"}
                        </span>
                      </div>
                      <h3 className="text-base font-medium text-heading">
                        {question.text}
                      </h3>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === option;
                      const isCorrectAnswer = option === question.correctOption;
                      const optionLetter = String.fromCharCode(
                        65 + optionIndex
                      );

                      let borderColor = "border-light-border";
                      let bgColor = "bg-background";
                      let textColor = "text-heading";

                      if (isCorrectAnswer) {
                        borderColor = "border-success";
                        bgColor = "bg-success/10";
                        textColor = "text-success";
                      } else if (isUserAnswer && !isCorrect) {
                        borderColor = "border-destructive";
                        bgColor = "bg-destructive/10";
                        textColor = "text-destructive";
                      }

                      return (
                        <div
                          key={optionIndex}
                          className={`border-2 rounded-lg p-3 ${borderColor} ${bgColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                isCorrectAnswer
                                  ? "bg-success text-white"
                                  : isUserAnswer
                                  ? "bg-destructive text-white"
                                  : "bg-secondary/10 text-secondary"
                              }`}
                            >
                              {optionLetter}
                            </span>
                            <span className={`flex-1 font-medium ${textColor}`}>
                              {option}
                            </span>
                            {isCorrectAnswer && (
                              <span className="text-xs font-medium text-success">
                                Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-xs font-medium text-destructive">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Result */}
                  <div className="mt-4 pt-4 border-t border-light-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-para-muted">
                        {isCorrect
                          ? "You answered correctly"
                          : userAnswer
                          ? "You answered incorrectly"
                          : "You did not answer this question"}
                      </span>
                      <span className="text-sm font-medium text-heading">
                        {isCorrect ? question.points : 0} / {question.points}{" "}
                        points
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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

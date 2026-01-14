import Link from "next/link";
import { ChevronLeft, Clock } from "lucide-react";

interface QuizAttemptHeaderProps {
  quizTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  backHref: string;
  // Attempt mode props
  timeRemaining?: number;
  // Review mode props
  isReviewMode?: boolean;
  score?: number;
  totalScore?: number;
}

export default function QuizAttemptHeader({
  quizTitle,
  currentQuestionIndex,
  totalQuestions,
  backHref,
  timeRemaining = 0,
  isReviewMode = false,
  score,
  totalScore,
}: QuizAttemptHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 60) return "text-destructive";
    if (timeRemaining <= 300) return "text-warning";
    return "text-heading";
  };

  const percentage =
    isReviewMode && totalScore ? Math.round((score! / totalScore) * 100) : 0;

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-light-border">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-heading" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-heading font-raleway line-clamp-1">
              {quizTitle}
            </h1>
            <p className="text-xs text-para-muted">
              Question {currentQuestionIndex + 1} of {totalQuestions}
              {isReviewMode && " • Quiz Review"}
            </p>
          </div>
        </div>

        {/* Timer (attempt mode) or Score (review mode) */}
        {isReviewMode ? (
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary">
              {percentage}%
            </div>
            <div className="text-xs text-para-muted">
              {score}/{totalScore} points
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-light-border ${getTimerColor()}`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary/10">
        <div
          className="h-full bg-secondary transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>
    </header>
  );
}

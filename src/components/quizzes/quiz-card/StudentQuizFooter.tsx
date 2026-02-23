import { Clock, Eye, XCircle, FileText } from "lucide-react";
import type { Quiz } from "@/types/quiz";
import { isStudentQuiz } from "@/types/quiz";
import { Button } from "@/components/ui/Button";
import { formatDeadline } from "./utils";

interface StudentQuizFooterProps {
  quiz: Quiz;
  isOverdue: boolean;
  onStartQuiz?: (id: string) => void;
  onReviewQuiz?: (id: string) => void;
}

export default function StudentQuizFooter({
  quiz,
  isOverdue,
  onStartQuiz,
  onReviewQuiz,
}: StudentQuizFooterProps) {
  const isGraded =
    isStudentQuiz(quiz) && quiz.submissionStatus === "graded";
  const isMissed =
    isStudentQuiz(quiz) &&
    (quiz.submissionStatus === "missed" ||
      (isOverdue && quiz.submissionStatus === "pending"));

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
      {/* Left side - Deadline */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm text-para-muted">
          <Clock className="w-4 h-4" />
          {formatDeadline(quiz.deadline)}
        </span>
      </div>

      {/* Right side - Action button */}
      <div>
        {isGraded ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => onReviewQuiz?.(quiz.id)}
            className="text-xs px-3 py-1.5"
          >
            <Eye className="w-4 h-4" />
            Review Quiz
          </Button>
        ) : isMissed ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs px-3 py-1.5 opacity-50 cursor-not-allowed"
          >
            <XCircle className="w-4 h-4" />
            Missed
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => onStartQuiz?.(quiz.id)}
            className="text-xs px-3 py-1.5"
          >
            <FileText className="w-4 h-4" />
            Attempt Quiz
          </Button>
        )}
      </div>
    </div>
  );
}

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Generic question type for both attempt and review modes
interface QuestionItem {
  id: string;
  correctOption: string;
}

interface QuizNavigatorSidebarProps {
  questions: QuestionItem[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isSubmitting?: boolean;
  onQuestionSelect: (index: number) => void;
  onSubmit?: () => void;
  // Review mode props
  isReviewMode?: boolean;
}

export default function QuizNavigatorSidebar({
  questions,
  currentQuestionIndex,
  answers,
  isSubmitting = false,
  onQuestionSelect,
  onSubmit,
  isReviewMode = false,
}: QuizNavigatorSidebarProps) {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  // Calculate correct answers for review mode
  const correctCount = isReviewMode
    ? questions.filter((q) => answers[q.id] === q.correctOption).length
    : 0;

  return (
    <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-light-border bg-background p-4">
      <h3 className="text-sm font-semibold text-heading mb-4">
        {isReviewMode
          ? `Results (${correctCount}/${totalQuestions} correct)`
          : `Questions (${answeredCount}/${totalQuestions} answered)`}
      </h3>
      <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
        {questions.map((q, index) => {
          const isCurrent = index === currentQuestionIndex;
          const userAnswer = answers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isReviewMode && userAnswer === q.correctOption;
          const isWrong = isReviewMode && isAnswered && !isCorrect;

          // Determine button styling
          let buttonClass = "";
          if (isCurrent) {
            buttonClass = "bg-secondary text-white ring-2 ring-secondary/30";
          } else if (isReviewMode) {
            if (isCorrect) {
              buttonClass =
                "bg-success/20 text-success border-2 border-success/30";
            } else if (isWrong) {
              buttonClass =
                "bg-destructive/20 text-destructive border-2 border-destructive/30";
            } else {
              buttonClass = "bg-gray-100 text-para-muted";
            }
          } else {
            if (isAnswered) {
              buttonClass = "bg-secondary/20 text-secondary";
            } else {
              buttonClass =
                "bg-secondary/5 text-para-muted hover:bg-secondary/10";
            }
          }

          return (
            <button
              key={q.id}
              onClick={() => onQuestionSelect(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${buttonClass}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Submit Button - only show in attempt mode */}
      {!isReviewMode && onSubmit && (
        <div className="mt-6 pt-4 border-t border-light-border">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full"
            variant={answeredCount === totalQuestions ? "default" : "outline"}
          >
            Submit Quiz
          </Button>
          {answeredCount < totalQuestions && (
            <p className="text-xs text-para-muted mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {totalQuestions - answeredCount} unanswered
            </p>
          )}
        </div>
      )}

      {/* Review mode summary */}
      {isReviewMode && (
        <div className="mt-6 pt-4 border-t border-light-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-para-muted">{correctCount} correct</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-para-muted">
                {answeredCount - correctCount} incorrect
              </span>
            </div>
            {answeredCount < totalQuestions && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-para-muted" />
                <span className="text-para-muted">
                  {totalQuestions - answeredCount} unanswered
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

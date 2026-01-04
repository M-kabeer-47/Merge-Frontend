import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { QuizQuestion } from "@/types/quiz";

interface QuizNavigatorSidebarProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isSubmitting: boolean;
  onQuestionSelect: (index: number) => void;
  onSubmit: () => void;
}

export default function QuizNavigatorSidebar({
  questions,
  currentQuestionIndex,
  answers,
  isSubmitting,
  onQuestionSelect,
  onSubmit,
}: QuizNavigatorSidebarProps) {
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <aside className="lg:w-72 border-t lg:border-t-0 lg:border-l border-light-border bg-background p-4">
      <h3 className="text-sm font-semibold text-heading mb-4">
        Questions ({answeredCount}/{totalQuestions} answered)
      </h3>
      <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => onQuestionSelect(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                isCurrent
                  ? "bg-secondary text-white ring-2 ring-secondary/30"
                  : isAnswered
                  ? "bg-secondary/20 text-secondary"
                  : "bg-secondary/5 text-para-muted hover:bg-secondary/10"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Submit Button in Sidebar */}
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
    </aside>
  );
}

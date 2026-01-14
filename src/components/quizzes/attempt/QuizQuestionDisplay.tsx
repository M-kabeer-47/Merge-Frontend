import { CheckCircle2, XCircle } from "lucide-react";

// Generic question type for both attempt and review modes
interface QuestionItem {
  text: string;
  points: number;
  correctOption: string;
}

interface QuizQuestionDisplayProps {
  question: QuestionItem;
  questionNumber?: number;
  // Review mode props
  isReviewMode?: boolean;
  userAnswer?: string;
}

export default function QuizQuestionDisplay({
  question,
  questionNumber,
  isReviewMode = false,
  userAnswer,
}: QuizQuestionDisplayProps) {
  const isCorrect = isReviewMode && userAnswer === question.correctOption;

  return (
    <div className="bg-background border border-light-border rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {questionNumber && (
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
              Question {questionNumber}
            </span>
          )}
          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>

        {/* Review mode result indicator */}
        {isReviewMode &&
          (isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
          ))}
      </div>
      <h2 className="text-xl font-medium text-heading leading-relaxed">
        {question.text}
      </h2>

      {/* Review mode result text */}
      {isReviewMode && (
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
              {isCorrect ? question.points : 0} / {question.points} points
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

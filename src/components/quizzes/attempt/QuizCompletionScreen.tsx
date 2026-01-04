import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AttemptQuizResponse } from "@/types/quiz";

interface QuizCompletionScreenProps {
  result: AttemptQuizResponse;
  quizTitle: string;
  onExit: () => void;
}

export default function QuizCompletionScreen({
  result,
  quizTitle,
  onExit,
}: QuizCompletionScreenProps) {
  const percentage = Math.round((result.score / result.quiz.totalScore) * 100);

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <div className="bg-background border border-light-border rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-secondary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-heading font-raleway mb-2">
            Quiz Completed!
          </h1>
          <p className="text-para-muted">{quizTitle}</p>
        </div>

        <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6">
          <div className="text-4xl font-bold text-secondary mb-2">
            {percentage}%
          </div>
          <div className="text-sm text-para-muted">
            {result.score} / {result.quiz.totalScore} points
          </div>
          <div className="text-sm text-para-muted mt-1">
            Submitted on {new Date(result.submittedAt).toLocaleString()}
          </div>
        </div>

        <Button onClick={onExit} className="w-full" size="lg">
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}

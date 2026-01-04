import type { QuizQuestion } from "@/types/quiz";

interface QuizQuestionDisplayProps {
  question: QuizQuestion;
}

export default function QuizQuestionDisplay({
  question,
}: QuizQuestionDisplayProps) {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded">
          {question.points} {question.points === 1 ? "point" : "points"}
        </span>
      </div>
      <h2 className="text-xl font-medium text-heading leading-relaxed">
        {question.text}
      </h2>
    </div>
  );
}

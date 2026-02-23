import type { Quiz } from "@/types/quiz";
import QuizCardHeader from "./quiz-card/QuizCardHeader";
import InstructorQuizFooter from "./quiz-card/InstructorQuizFooter";
import StudentQuizFooter from "./quiz-card/StudentQuizFooter";

interface QuizCardProps {
  quiz: Quiz;
  isInstructor?: boolean;
  bgColor?: string;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStartQuiz?: (id: string) => void;
  onReviewQuiz?: (id: string) => void;
}

export default function QuizCard({
  quiz,
  isInstructor = false,
  bgColor,
  onViewDetails,
  onEdit,
  onDelete,
  onStartQuiz,
  onReviewQuiz,
}: QuizCardProps) {
  const isClosed = quiz.isClosed;
  const isOverdue = new Date() > new Date(quiz.deadline);
  const cardBgColor = bgColor || "bg-background";

  return (
    <div
      className={`relative border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden ${cardBgColor} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary via-secondary to-accent" />

      <div className="relative p-6">
        <QuizCardHeader
          quiz={quiz}
          isInstructor={isInstructor}
          isOverdue={isOverdue}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {isInstructor ? (
          <InstructorQuizFooter
            quiz={quiz}
            isClosed={isClosed}
            onViewDetails={onViewDetails}
          />
        ) : (
          <StudentQuizFooter
            quiz={quiz}
            isOverdue={isOverdue}
            onStartQuiz={onStartQuiz}
            onReviewQuiz={onReviewQuiz}
          />
        )}
      </div>
    </div>
  );
}

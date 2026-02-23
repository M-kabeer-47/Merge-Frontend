import { Users, XCircle, Eye } from "lucide-react";
import type { Quiz } from "@/types/quiz";
import { isInstructorQuiz } from "@/types/quiz";
import { Button } from "@/components/ui/Button";

interface InstructorQuizFooterProps {
  quiz: Quiz;
  isClosed: boolean;
  onViewDetails?: (id: string) => void;
}

export default function InstructorQuizFooter({
  quiz,
  isClosed,
  onViewDetails,
}: InstructorQuizFooterProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
      {/* Left side - Status info */}
      <div className="flex items-center gap-3 flex-wrap">
        {isInstructorQuiz(quiz) && (
          <>
            {/* Submission stats */}
            <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
              <Users className="w-4 h-4" />
              <span>
                {quiz.attempts}/{quiz.totalAttempts} attempted
              </span>
            </div>
            {isClosed && (
              <div className="flex items-center gap-1.5 text-para-muted font-medium text-sm">
                <XCircle className="w-4 h-4" />
                <span>Closed</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right side - Action button */}
      <div>
        <Button
          variant="default"
          size="sm"
          onClick={() => onViewDetails?.(quiz.id)}
          className="text-xs px-3 py-1.5"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}

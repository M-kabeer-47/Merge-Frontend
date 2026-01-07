import { CheckCircle2 } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { formatDueDate } from "@/utils/assignment-helpers";

interface AssignmentMetaInfoProps {
  totalScore: number;
  endAt: Date;
  isInstructor: boolean;
  submissionStatus?: string;
  grade?: number;
}

export default function AssignmentMetaInfo({
  totalScore,
  endAt,
  isInstructor,
  submissionStatus,
  grade,
}: AssignmentMetaInfoProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted">
      <span className="flex items-center gap-1">
        <Icon src="/icons/trophy.jpg" alt="Points" />
        {totalScore} points
      </span>

      <span className="flex items-center gap-1">
        <Icon src="/icons/timer.png" alt="Due date" />
        {formatDueDate(endAt)}
      </span>

      {/* Show grade for student if graded */}
      {!isInstructor &&
        submissionStatus === "graded" &&
        grade !== undefined && (
          <span className="flex items-center gap-1 text-secondary font-semibold">
            <CheckCircle2 className="w-4 h-4 text-white" fill="#8668c0" />
            {grade}/{totalScore}
          </span>
        )}
    </div>
  );
}

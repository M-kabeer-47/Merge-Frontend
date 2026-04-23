import { CheckCircle2, Trophy, Clock } from "lucide-react";
import { formatDueDate } from "@/utils/assignment-helpers";

interface AssignmentMetaInfoProps {
  totalScore: number;
  endAt: Date;
  createdAt?: Date;
  isInstructor: boolean;
  submissionStatus?: string;
  grade?: number;
}

export default function AssignmentMetaInfo({
  totalScore,
  endAt,
  createdAt,
  isInstructor,
  submissionStatus,
  grade,
}: AssignmentMetaInfoProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap text-sm text-para-muted">
      <span className="flex items-center gap-1">
        <Trophy className="w-4 h-4 text-accent" />
        {totalScore} points
      </span>
      {(submissionStatus === "pending" || submissionStatus === "missed") && (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-warning" />
          {formatDueDate(endAt)}
        </span>
      )}

      {createdAt && (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-para-muted" />
          Uploaded:{" "}
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      )}

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

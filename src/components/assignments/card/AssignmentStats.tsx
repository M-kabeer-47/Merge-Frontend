import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatSubmissionDate } from "@/utils/assignment-helpers";

interface InstructorStatsProps {
  submissionStats: {
    submitted: number;
    total: number;
    graded: number;
  };
  isClosed: boolean;
}

export function InstructorStats({
  submissionStats,
  isClosed,
}: InstructorStatsProps) {
  return (
    <>
      <div className="flex items-center gap-1.5 text-primary font-medium text-sm">
        <FileText className="w-4 h-4" />
        <span>
          {submissionStats.submitted}/{submissionStats.total} submitted
        </span>
      </div>

      {submissionStats.graded > 0 && (
        <div className="flex items-center gap-1 font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 text-white" fill="#10b981" />
          <span className="text-success">{submissionStats.graded} graded</span>
        </div>
      )}

      {isClosed && (
        <div className="flex items-center gap-1.5 text-para-muted font-medium text-sm">
          <XCircle className="w-4 h-4" />
          <span>Closed</span>
        </div>
      )}
    </>
  );
}

interface StudentStatsProps {
  submissionStatus?: string;
  submittedAt?: Date;
}

export function StudentStats({
  submissionStatus,
  submittedAt,
}: StudentStatsProps) {
  if (submissionStatus !== "submitted") return null;

  return (
    <span className="flex items-center gap-1.5 text-sm text-para-muted">
      <Clock className="w-4 h-4" />
      Submitted {formatSubmissionDate(submittedAt)}
    </span>
  );
}

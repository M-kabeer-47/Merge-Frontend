import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import type { SubmissionStatus } from "@/types/assignment";

interface SubmissionStatusBadgeProps {
  status?: SubmissionStatus;
}

export default function SubmissionStatusBadge({
  status,
}: SubmissionStatusBadgeProps) {
  if (!status) return null;

  if (status === "graded") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-success/20 text-success min-w-[100px]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Graded
      </span>
    );
  }

  if (status === "submitted") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-info/20 text-info min-w-[100px]">
        <Clock className="w-3.5 h-3.5" />
        Submitted
      </span>
    );
  }

  if (status === "missed") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-destructive/20 text-destructive min-w-[100px]">
        <XCircle className="w-3.5 h-3.5" />
        Missed
      </span>
    );
  }

  // Pending
  return (
    <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent min-w-[100px]">
      <AlertCircle className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { SubmissionStatus } from "@/types/assignment";
import { getStudentStatusConfig } from "@/utils/assignment-helpers";

interface AssignmentStatusBadgeProps {
  status: SubmissionStatus;
}

const iconMap = {
  check: CheckCircle2,
  x: XCircle,
  alert: AlertCircle,
};

export default function AssignmentStatusBadge({
  status,
}: AssignmentStatusBadgeProps) {
  const config = getStudentStatusConfig(status);
  const StatusIcon = iconMap[config.icon];

  return (
    <div
      className={`flex items-center gap-1 w-[110px] rounded-full py-1.5 ${config.bgColor} justify-center`}
    >
      <StatusIcon className="w-5 h-5 text-white" fill={config.iconFill} />
      <span
        className={`${config.textColor} font-medium text-sm whitespace-nowrap`}
      >
        {config.text}
      </span>
    </div>
  );
}

import { FileText } from "lucide-react";
import type { AssignmentAttachment } from "@/types/assignment";
import { formatFileSize } from "@/utils/file-helpers";
import { formatSubmissionDate } from "@/utils/assignment-helpers";

interface SubmittedFilesSectionProps {
  attachments?: AssignmentAttachment[];
  submittedAt?: Date;
}

export default function SubmittedFilesSection({
  attachments,
  submittedAt,
}: SubmittedFilesSectionProps) {
  if (!submittedAt || !attachments || attachments.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-secondary uppercase mb-2">
        Submitted Files
      </p>
      <div className="space-y-2">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 p-2.5 bg-secondary/25 rounded-lg"
          >
            <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-para truncate">
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-para">{formatFileSize(file.size)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {submittedAt && (
        <p className="text-xs text-para mt-3">
          Submitted {formatSubmissionDate(submittedAt)}
        </p>
      )}
    </div>
  );
}

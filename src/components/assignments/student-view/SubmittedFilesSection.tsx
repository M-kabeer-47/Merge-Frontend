import { FileText, Download, X } from "lucide-react";
import { downloadFile } from "@/utils/download-file";
import { formatSubmissionDate } from "@/utils/date-helpers";

interface SubmittedFilesSectionProps {
  files?: { name: string; url: string }[];
  submittedAt?: Date;
  canRemove?: boolean;
  onRemoveFile?: (index: number) => void;
}

export default function SubmittedFilesSection({
  files,
  submittedAt,
  canRemove = false,
  onRemoveFile,
}: SubmittedFilesSectionProps) {
  if (!files || files.length === 0) return null;

  const handleDownload = (
    e: React.MouseEvent,
    file: { name: string; url: string }
  ) => {
    e.stopPropagation();
    downloadFile(file.url, file.name);
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemoveFile?.(index);
  };

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-secondary uppercase mb-2">
        {submittedAt ? "Submitted Files" : "Previous Files"}
      </p>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2.5 bg-secondary/25 rounded-lg w-full text-left group"
          >
            <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-para truncate">
                {file.name}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleDownload(e, file)}
                className="p-1.5 rounded hover:bg-secondary/20 transition-colors"
                aria-label="Download file"
              >
                <Download className="w-3.5 h-3.5 text-para-muted hover:text-secondary transition-colors" />
              </button>
              {canRemove && onRemoveFile && (
                <button
                  onClick={(e) => handleRemove(e, index)}
                  className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-3.5 h-3.5 text-para-muted hover:text-destructive transition-colors" />
                </button>
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

import { FileText, Download } from "lucide-react";
import type { AssignmentAttachment } from "@/types/assignment";
import { formatFileSize } from "@/utils/file-helpers";

interface ResourcesSectionProps {
  attachments?: AssignmentAttachment[];
}

export default function ResourcesSection({
  attachments,
}: ResourcesSectionProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-heading mb-3">Resources</h2>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-secondary/5 border border-light-border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-heading text-sm truncate">
                  {attachment.name}
                </p>
                {attachment.size && (
                  <p className="text-xs text-para-muted">
                    {formatFileSize(attachment.size)}
                  </p>
                )}
              </div>
            </div>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary rounded transition-colors flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

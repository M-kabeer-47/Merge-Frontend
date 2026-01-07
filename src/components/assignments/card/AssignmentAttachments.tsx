import { FileText, File as FileIcon } from "lucide-react";

interface Attachment {
  name: string;
  url: string;
  size?: number;
}

interface AssignmentAttachmentsProps {
  attachments: Attachment[];
  isInstructor: boolean;
}

export default function AssignmentAttachments({
  attachments,
  isInstructor,
}: AssignmentAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-light-border">
      {isInstructor ? (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <a
              key={index}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-secondary/10 hover:bg-gray-100 border border-light-border rounded-lg text-xs transition-colors"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-para font-medium max-w-[200px] truncate">
                {attachment.name}
              </span>
              {attachment.size && (
                <span className="text-para-muted">
                  ({Math.round(attachment.size / 1024)} KB)
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-para-muted">
          <FileIcon className="w-4 h-4" />
          <span>
            {attachments.length} attachment{attachments.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

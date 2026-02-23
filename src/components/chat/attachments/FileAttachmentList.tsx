import { useState } from "react";
import { Download, FileText, File } from "lucide-react";
import type { MessageAttachment } from "@/types/general-chat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { downloadFile } from "@/utils/download-file";
import CircularProgress from "./CircularProgress";
import { formatFileSize } from "./utils";

interface FileAttachmentListProps {
  attachments: MessageAttachment[];
  isOwnMessage: boolean;
}

export default function FileAttachmentList({
  attachments,
  isOwnMessage,
}: FileAttachmentListProps) {
  const [isHovering, setIsHovering] = useState(false);
  if (!attachments) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-destructive" />;
    if (["doc", "docx"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-blue-400" />;
    if (["xls", "xlsx"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-green-400" />;
    return <File className="h-5 w-5 text-para-muted" />;
  };

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        const isNameTooLong = attachment.name.length > 25;

        return (
          <div
            key={attachment.url}
            className={`flex items-center gap-3 p-3 rounded-lg w-80 ${
              isOwnMessage ? "bg-white/10 border-white/20" : "bg-secondary/10"
            }`}
          >
            {/* File Icon or Loader */}
            <div className="flex-shrink-0">
              {attachment.isUploading ? (
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <CircularProgress
                    progress={attachment.uploadProgress || 0}
                    size={28}
                    strokeWidth={3}
                  />
                </div>
              ) : (
                getFileIcon(attachment.name)
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              {isNameTooLong ? (
                <Popover open={isHovering} onOpenChange={setIsHovering}>
                  <PopoverTrigger asChild>
                    <div
                      className={`text-sm font-medium truncate cursor-pointer hover:underline ${
                        isOwnMessage ? "text-white" : "text-heading"
                      }`}
                    >
                      {attachment.name}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto max-w-md p-2">
                    <p className="text-sm break-all">{attachment.name}</p>
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  className={`text-sm font-medium truncate ${
                    isOwnMessage ? "text-white" : "text-heading"
                  }`}
                >
                  {attachment.name}
                </div>
              )}
              {attachment.size && !attachment.isUploading && (
                <div
                  className={`text-xs ${
                    isOwnMessage ? "text-white/70" : "text-para-muted"
                  }`}
                >
                  {formatFileSize(attachment.size)}
                </div>
              )}
              {attachment.isUploading && (
                <div className="text-xs text-white/70 animate-pulse">
                  Uploading...
                </div>
              )}
            </div>

            {/* Download Button */}
            {!attachment.isUploading && (
              <button
                onClick={() => downloadFile(attachment.url, attachment.name)}
                className="p-1 rounded transition-colors hover:bg-black/10"
                title="Download"
              >
                <Download
                  className={`h-4 w-4 ${
                    isOwnMessage ? "text-white/80" : "text-para-muted"
                  }`}
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { Download, FileText, File } from "lucide-react";
import { ChatMessage } from "@/lib/constants/mock-chat-data";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface MessageAttachmentsProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export default function MessageAttachments({
  message,
  isOwnMessage,
}: MessageAttachmentsProps) {
  if (!message.attachments || message.attachments.length === 0) return null;

  const hasImages = message.attachments.some((att) => att.type === "image");
  const hasFiles = message.attachments.some((att) => att.type === "file");

  return (
    <div className="mb-2">
      {/* Image Attachments - WhatsApp-like grid */}
      {hasImages && (
        <ImageAttachmentGrid
          attachments={message.attachments.filter(
            (att) => att.type === "image"
          )}
          isOwnMessage={isOwnMessage}
        />
      )}

      {/* File Attachments */}
      {hasFiles && (
        <FileAttachmentList
          attachments={message.attachments.filter((att) => att.type === "file")}
          isOwnMessage={isOwnMessage}
        />
      )}
    </div>
  );
}

const ImageAttachmentGrid: React.FC<{
  attachments: ChatMessage["attachments"];
  isOwnMessage: boolean;
}> = ({ attachments, isOwnMessage }) => {
  if (!attachments) return null;

  const count = attachments.length;

  const getGridLayout = () => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  const getImageHeight = () => {
    if (count === 1) return "h-64 max-w-md";
    if (count === 2) return "h-48";
    return "h-40";
  };

  return (
    <div className={`grid ${getGridLayout()} gap-1 mb-2 max-w-lg`}>
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={`relative ${getImageHeight()} rounded-lg overflow-hidden group cursor-pointer`}
        >
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
          <button
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Download"
          >
            <Download className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

const FileAttachmentList: React.FC<{
  attachments: ChatMessage["attachments"];
  isOwnMessage: boolean;
}> = ({ attachments, isOwnMessage }) => {
  if (!attachments) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) return <FileText className="h-5 w-5 text-red-500" />;
    if (["doc", "docx"].includes(ext || "")) return <FileText className="h-5 w-5 text-blue-500" />;
    if (["xls", "xlsx"].includes(ext || "")) return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-para-muted" />;
  };

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={`flex items-center gap-3 p-3 rounded-lg w-fit max-w-sm ${
            isOwnMessage ? "bg-white/10 border-white/20" : "bg-secondary/15"
          }`}
        >
          <div className="flex-shrink-0">{getFileIcon(attachment.name)}</div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm font-medium truncate ${
                isOwnMessage ? "text-white" : "text-heading"
              }`}
            >
              {attachment.name}
            </div>
            {attachment.size && (
              <div
                className={`text-xs ${
                  isOwnMessage ? "text-white/70" : "text-para-muted"
                }`}
              >
                {formatFileSize(attachment.size)}
              </div>
            )}
          </div>
          <button className="p-1 rounded transition-colors hover:bg-black/10">
            <Download
              className={`h-4 w-4 ${
                isOwnMessage ? "text-white/80" : "text-para-muted"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

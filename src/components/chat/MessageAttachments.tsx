import { Download, FileText } from "lucide-react";
import { ChatMessage, User } from "@/lib/constants/mock-chat-data";
import { Message } from "react-hook-form";

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
  return (
    <>
      {message.attachments && message.attachments.length > 0 && (
        <div
          className={`mb-2 space-y-2 ${
            isOwnMessage ? "flex flex-col items-end" : ""
          }`}
        >
          {message.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={`flex items-center gap-3 p-3 rounded-lg  w-fit ${
                isOwnMessage ? "bg-white/10 border-white/20" : "bg-secondary/15"
              }`}
            >
              <FileText
                className={`h-5 w-5 ${
                  isOwnMessage ? "text-white" : "text-primary"
                }`}
              />
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
              <button className="p-1 rounded transition-colors">
                <Download
                  className={`h-4 w-4 ${
                    isOwnMessage ? "text-white/80" : "text-para-muted"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

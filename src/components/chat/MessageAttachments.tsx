import type { ChatMessage } from "@/types/general-chat";
import { isImage } from "./attachments/utils";
import ImageAttachmentGrid from "./attachments/ImageAttachmentGrid";
import FileAttachmentList from "./attachments/FileAttachmentList";

interface MessageAttachmentsProps {
  message: ChatMessage;
  isOwnMessage: boolean;
}

export default function MessageAttachments({
  message,
  isOwnMessage,
}: MessageAttachmentsProps) {
  if (!message.attachments || message.attachments.length === 0) return null;

  const imageAttachments = message.attachments.filter((att) => isImage(att));
  const fileAttachments = message.attachments.filter((att) => !isImage(att));

  return (
    <div className="mb-2">
      {/* Image Attachments - WhatsApp-like grid */}
      {imageAttachments.length > 0 && (
        <ImageAttachmentGrid
          attachments={imageAttachments}
          isOwnMessage={isOwnMessage}
        />
      )}

      {/* File Attachments */}
      {fileAttachments.length > 0 && (
        <FileAttachmentList
          attachments={fileAttachments}
          isOwnMessage={isOwnMessage}
        />
      )}
    </div>
  );
}

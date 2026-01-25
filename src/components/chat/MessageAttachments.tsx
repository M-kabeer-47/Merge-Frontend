import { Download, FileText, File } from "lucide-react";
import type { ChatMessage, MessageAttachment } from "@/types/general-chat";
import { useState } from "react";
import ImageCarouselModal from "./ImageCarouselModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { downloadFile } from "@/utils/download-file";
import LoadingSpinner from "../ui/LoadingSpinner";

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

  const isImage = (att: MessageAttachment) => {
    if (att.type === "image") return true;
    const ext = att.name.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "");
  };

  const hasImages = message.attachments.some((att) => isImage(att));
  const hasFiles = message.attachments.some((att) => !isImage(att));

  return (
    <div className="mb-2">
      {/* Image Attachments - WhatsApp-like grid */}
      {hasImages && (
        <ImageAttachmentGrid
          attachments={message.attachments.filter((att) => {
            if (att.type === "image") return true;
            const ext = att.name.split(".").pop()?.toLowerCase();
            return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
              ext || "",
            );
          })}
          isOwnMessage={isOwnMessage}
        />
      )}

      {/* File Attachments */}
      {hasFiles && (
        <FileAttachmentList
          attachments={message.attachments.filter((att) => {
            const isImg =
              att.type === "image" ||
              ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                att.name.split(".").pop()?.toLowerCase() || "",
              );
            return !isImg;
          })}
          isOwnMessage={isOwnMessage}
        />
      )}
    </div>
  );
}

const CircularProgress = ({
  progress,
  size = 48,
  strokeWidth = 4,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-white/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-white drop-shadow-md transition-all duration-300 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Optional: Add X icon for cancel here if needed */}
    </div>
  );
};

const ImageAttachmentGrid: React.FC<{
  attachments: MessageAttachment[];
  isOwnMessage: boolean;
}> = ({ attachments, isOwnMessage }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const handleImageClick = (index: number) => {
    if (!attachments[index].isUploading) {
      setSelectedImageIndex(index);
      setModalOpen(true);
    }
  };

  const images = attachments.map((att) => ({
    id: att.id,
    url: att.url || att.preview || "",
    name: att.name,
  }));

  return (
    <>
      <div className={`grid ${getGridLayout()} gap-1 mb-2 max-w-lg relative`}>
        {attachments.map((attachment, index) => (
          <div
            key={attachment.url}
            className={`relative ${getImageHeight()} rounded-lg overflow-hidden group ${
              !attachment.isUploading ? "cursor-pointer" : ""
            }`}
            onClick={() => handleImageClick(index)}
          >
            {/* Image with blur effect when uploading */}
            <img
              src={attachment.url || attachment.preview}
              alt={attachment.name}
              className={`w-full h-full object-cover transition-all ${
                attachment.isUploading ? "blur-sm scale-105" : ""
              }`}
            />

            {/* Overlay */}
            {!attachment.isUploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            )}

            {/* Upload Progress Overlay - Individual */}
            {attachment.isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                <CircularProgress progress={attachment.uploadProgress || 0} />
              </div>
            )}

            {/* Download Button */}
            {!attachment.isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile(attachment.url, attachment.name);
                }}
                className="absolute top-2 right-2 p-1.5 bg-background  rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Download"
              >
                <Download className="h-3.5 w-3.5 text-heading" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

const FileAttachmentList: React.FC<{
  attachments: MessageAttachment[];
  isOwnMessage: boolean;
}> = ({ attachments, isOwnMessage }) => {
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
};

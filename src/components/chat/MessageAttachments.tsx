import { Download, FileText, File, Loader2 } from "lucide-react";
import { ChatMessage } from "@/lib/constants/mock-chat-data";
import { useState } from "react";
import ImageCarouselModal from "./ImageCarouselModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { downloadFile } from "@/utils/download-file";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!attachments) return null;

  const count = attachments.length;
  const isUploading = attachments.some((att) => att.isUploading);
  const overallProgress = isUploading
    ? Math.round(
        attachments.reduce((sum, att) => sum + (att.uploadProgress || 0), 0) /
          attachments.length
      )
    : 100;

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
    if (!isUploading) {
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
            key={attachment.id}
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
                attachment.isUploading ? "blur-sm" : ""
              }`}
            />

            {/* Overlay */}
            {!attachment.isUploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            )}

            {/* Upload Progress Overlay for Single Image */}
            {attachment.isUploading && count === 1 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-background animate-spin mx-auto mb-2" />
                  <div className="text-background text-sm font-medium">
                    {attachment.uploadProgress || 0}%
                  </div>
                </div>
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

        {/* Combined Progress Loader for Multiple Images */}
        {isUploading && count > 1 && (
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-background animate-spin mx-auto mb-2" />
              <div className="text-background text-base font-medium">
                Uploading {overallProgress}%
              </div>
            </div>
          </div>
        )}
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
  attachments: ChatMessage["attachments"];
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
            key={attachment.id}
            className={`flex items-center gap-3 p-3 rounded-lg w-80 ${
              isOwnMessage ? "bg-white/10 border-white/20" : "bg-secondary/10"
            }`}
          >
            {/* File Icon or Loader */}
            <div className="flex-shrink-0">
              {attachment.isUploading ? (
                <div className="relative">
                  <Loader2 className="h-5 w-5 text-background animate-spin" />
                  {attachment.uploadProgress !== undefined && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-para-muted whitespace-nowrap">
                      {attachment.uploadProgress}%
                    </div>
                  )}
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

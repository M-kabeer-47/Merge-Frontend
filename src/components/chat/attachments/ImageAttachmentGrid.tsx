import { useState } from "react";
import { Download } from "lucide-react";
import type { MessageAttachment } from "@/types/general-chat";
import ImageCarouselModal from "../ImageCarouselModal";
import CircularProgress from "./CircularProgress";
import { downloadFile } from "@/utils/download-file";

interface ImageAttachmentGridProps {
  attachments: MessageAttachment[];
  isOwnMessage: boolean;
}

export default function ImageAttachmentGrid({
  attachments,
  isOwnMessage,
}: ImageAttachmentGridProps) {
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
}

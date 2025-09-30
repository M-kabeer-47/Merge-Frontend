"use client";
import React from "react";
import { X, File, FileText } from "lucide-react";

export interface AttachmentFile {
  file: File;
  preview: string;
  type: "image" | "file";
}

interface AttachmentPreviewProps {
  attachments: AttachmentFile[];
  onRemove: (index: number) => void;
  onRemoveAll: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  onRemove,
  onRemoveAll,
}) => {
  if (attachments.length === 0) return null;

  const isImageType = attachments[0]?.type === "image";

  return (
    <div className="px-6 py-3 border-b border-light-border relative">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs text-para-muted">
          {isImageType
            ? `${attachments.length} image${
                attachments.length > 1 ? "s" : ""
              } selected`
            : `${attachments.length} file${
                attachments.length > 1 ? "s" : ""
              } selected`}
        </div>
        <button
          onClick={onRemoveAll}
          className="p-1 hover:bg-secondary/10 rounded transition-colors"
          title="Remove all"
        >
          <X className="h-4 w-4 text-heading" />
        </button>
      </div>

      {isImageType ? (
        <ImagePreviewGrid attachments={attachments} onRemove={onRemove} />
      ) : (
        <FilePreviewList attachments={attachments} onRemove={onRemove} />
      )}
    </div>
  );
};

const ImagePreviewGrid: React.FC<{
  attachments: AttachmentFile[];
  onRemove: (index: number) => void;
}> = ({ attachments, onRemove }) => {
  const count = attachments.length;

  // WhatsApp-like grid layout logic

  return (
    <div className={`flex items-center gap-2 max-w-md`}>
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className={`relative h-20 rounded-lg overflow-hidden bg-secondary/10 group`}
        >
          <img
            src={attachment.preview}
            alt={attachment.file.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Remove image"
          >
            <X className="h-3 w-3 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-white truncate">
              {attachment.file.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const FilePreviewList: React.FC<{
  attachments: AttachmentFile[];
  onRemove: (index: number) => void;
}> = ({ attachments, onRemove }) => {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-red-500" />;
    if (["doc", "docx"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (["xls", "xlsx"].includes(ext || ""))
      return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-para-muted" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors group"
        >
          <div className="flex-shrink-0">
            {getFileIcon(attachment.file.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-heading truncate">
              {attachment.file.name}
            </p>
            <p className="text-xs text-para-muted">
              {formatFileSize(attachment.file.size)}
            </p>
          </div>
          <button
            onClick={() => onRemove(index)}
            className="p-1 hover:bg-secondary/20 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Remove file"
          >
            <X className="h-4 w-4 text-heading" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentPreview;

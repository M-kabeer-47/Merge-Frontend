"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";

interface AttachmentProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

interface AttachmentsSectionProps {
  attachments: File[];
  onAttachmentsChange: (files: File[]) => void;
  attachmentProgress: AttachmentProgress[];
  isDisabled?: boolean;
  maxFileSizeMB?: number;
}

export default function AttachmentsSection({
  attachments,
  onAttachmentsChange,
  attachmentProgress,
  isDisabled = false,
  maxFileSizeMB = 50,
}: AttachmentsSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSizeBytes) {
        console.warn(`File ${file.name} exceeds ${maxFileSizeMB}MB limit`);
        return false;
      }
      return true;
    });

    onAttachmentsChange([...attachments, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-main-background border border-light-border rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-heading font-raleway">
        Attachments
      </h2>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${
            isDragging
              ? "border-secondary bg-secondary/5"
              : "border-light-border bg-background hover:border-secondary/50"
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={isDisabled}
        />
        <Upload className="w-10 h-10 text-para-muted mx-auto mb-3" />
        <p className="text-heading font-medium mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-para-muted">
          Max {maxFileSizeMB}MB per file. Support for all file types.
        </p>
      </div>

      {/* Attached Files List */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-heading">
            {attachments.length} file{attachments.length > 1 ? "s" : ""}{" "}
            attached
          </p>
          {attachments.map((file, index) => {
            const progress = attachmentProgress.find(
              (p) => p.fileName === file.name
            );
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-background border border-light-border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-heading truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-para-muted">
                      {formatFileSize(file.size)}
                      {progress && progress.status === "uploading" && (
                        <span className="ml-2 text-secondary">
                          Uploading... {progress.progress}%
                        </span>
                      )}
                      {progress && progress.status === "completed" && (
                        <span className="ml-2 text-green-600">✓ Uploaded</span>
                      )}
                      {progress && progress.status === "error" && (
                        <span className="ml-2 text-red-500">✕ Failed</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(index);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                  aria-label={`Remove ${file.name}`}
                  disabled={isDisabled}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

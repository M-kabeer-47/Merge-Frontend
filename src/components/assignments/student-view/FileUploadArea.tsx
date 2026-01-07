"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatFileSize } from "@/utils/file-helpers";

interface FileUploadAreaProps {
  selectedFiles: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  isUploading?: boolean;
}

export default function FileUploadArea({
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
  onSubmit,
  isSubmitted,
  isUploading = false,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ""; // Reset input
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="pt-4 border-t border-light-border">
      {isSubmitted && (
        <p className="text-xs text-para-muted mb-3">
          You can update your submission before the due date
        </p>
      )}

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-5 sm:p-6 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-para-muted hover:border-primary/50 bg-white/5"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-para-muted mb-2 mx-auto" />
        <p className="text-sm font-medium text-para-muted mb-1">
          Add or create
        </p>
        <p className="text-xs text-para-muted">Upload files or folders</p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 p-2.5 bg-secondary/10 border border-light-border rounded-lg"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-para truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-para-muted">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-para-muted" />
              </button>
            </div>
          ))}

          <Button
            onClick={onSubmit}
            disabled={isUploading}
            className="w-full mt-2"
            size="sm"
          >
            {isUploading
              ? "Uploading..."
              : isSubmitted
              ? "Update submission"
              : "Turn in"}
          </Button>
        </div>
      )}
    </div>
  );
}

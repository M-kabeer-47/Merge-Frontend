"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudUpload, X } from "lucide-react";

interface UploadDropzoneProps {
  isActive: boolean;
  onDrop?: (files: FileList) => void;
}

export default function UploadDropzone({ isActive, onDrop }: UploadDropzoneProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop?.(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-main-background rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 border-4 border-dashed border-secondary"
          >
            {/* Upload Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <CloudUpload className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-heading text-center mb-3">
              Drop files to upload
            </h3>

            {/* Description */}
            <p className="text-para-muted text-center text-sm">
              Files will be stored in this room only. All team members with access
              can view and download them.
            </p>

            {/* Hint */}
            <div className="mt-6 p-3 bg-secondary/10 rounded-lg">
              <p className="text-xs text-para text-center">
                Supported formats: PDF, DOCX, PPTX, XLSX, Images, Videos, Audio, ZIP
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

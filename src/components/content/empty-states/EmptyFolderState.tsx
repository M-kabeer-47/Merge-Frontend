"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Upload, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyFolderStateProps {
  onUpload?: () => void;
  onCreateFolder?: () => void;
}

export function EmptyFolderState({
  onUpload,
  onCreateFolder,
}: EmptyFolderStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 bg-main-background"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-2"
      >
        <Image
          src="/illustrations/empty-folder.png"
          alt="Empty folder"
          width={120}
          height={120}
          className="object-contain"
        />
      </motion.div>

      {/* Heading */}
      <h3 className="text-lg font-bold text-heading mb-2">
        This folder is empty
      </h3>

      {/* Description */}
      <p className="text-para-muted text-base text-center max-w-md mb-6">
        Get started by uploading your files or creating a new folder to organize
        your content.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onUpload && (
          <Button
            className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 flex items-center gap-2"
            onClick={onUpload}
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        )}
        {onCreateFolder && (
          <Button
            variant="outline"
            className="px-6 py-2.5 flex items-center gap-2"
            onClick={onCreateFolder}
          >
            <FolderPlus className="h-4 w-4" />
            Create Folder
          </Button>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-para-muted mt-6 text-center">
        You can also drag and drop files directly onto this area
      </p>
    </motion.div>
  );
}

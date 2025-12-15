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
        className="mb-6"
      >
        <Image
          src="/illustrations/empty-folder.png"
          alt="Empty folder"
          width={160}
          height={160}
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

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch?: () => void;
}

export function NoSearchResults({
  searchTerm,
  onClearSearch,
}: NoSearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src="/illustrations/no-search-results.png"
          alt="No search results"
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">
        No items match your search
      </h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md mb-1">
        We couldn't find any files or folders matching{" "}
        <span className="font-semibold text-para">"{searchTerm}"</span>
      </p>

      <p className="text-sm text-para-muted text-center max-w-md mb-6">
        Try adjusting your search terms or clearing filters.
      </p>

      {/* Action Button */}
      {onClearSearch && (
        <Button
          variant="outline"
          className="px-6 py-2.5"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      )}
    </motion.div>
  );
}

interface NoContentStateProps {
  message?: string;
  description?: string;
}

export function NoContentState({
  message = "No content available",
  description = "There are no items to display at this time.",
}: NoContentStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src="/illustrations/empty-folder.png"
          alt="No content"
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">{message}</h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md">{description}</p>
    </motion.div>
  );
}

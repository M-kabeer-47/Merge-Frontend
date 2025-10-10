"use client";

import React from "react";
import { motion } from "motion/react";
import { FolderOpen, Upload, FolderPlus, Search, FileX } from "lucide-react";
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
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center mb-6"
      >
        <FolderOpen className="h-16 w-16 text-secondary" />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">This folder is empty</h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md mb-6">
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
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 bg-gradient-to-br from-para/10 to-para-muted/10 rounded-full flex items-center justify-center mb-6"
      >
        <Search className="h-16 w-16 text-para-muted" />
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
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 bg-gradient-to-br from-para/10 to-para-muted/10 rounded-full flex items-center justify-center mb-6"
      >
        <FileX className="h-16 w-16 text-para-muted" />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">{message}</h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md">{description}</p>
    </motion.div>
  );
}

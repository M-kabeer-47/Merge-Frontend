"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { uploadToS3 } from "@/utils/s3-upload";

export interface AttachmentUploadProgress {
  id: string;
  file: File;
  status: "uploading" | "completed" | "failed";
  progress: number;
}

export interface UploadedAttachment {
  s3Url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

/**
 * Hook to upload files for AI assistant conversations
 * Follows the presigned URL pattern used in course content
 */
export default function useUploadAttachment() {
  const [uploadProgress, setUploadProgress] = useState<
    AttachmentUploadProgress | null
  >(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<UploadedAttachment> => {
      const uploadId = `upload-${Date.now()}`;
      const contentType = file.type || "application/octet-stream";

      // Initialize upload progress
      setUploadProgress({
        id: uploadId,
        file,
        status: "uploading",
        progress: 0,
      });

      try {
        // Step 1: Get presigned URL from backend
        const presignedResponse = await api.post(
          "/files/presigned-url",
          {
            originalName: file.name,
            contentType,
            size: file.size,
          }
        );

        const { uploadUrl, fileUrl } = presignedResponse.data;

        // Step 2: Upload directly to S3 with progress tracking
        await uploadToS3(uploadUrl, file, contentType, (percent) => {
          setUploadProgress((prev) =>
            prev
              ? { ...prev, progress: Math.min(percent, 95) }
              : null
          );
        });

        // Step 3: Complete upload
        setUploadProgress((prev) =>
          prev ? { ...prev, progress: 100, status: "completed" } : null
        );

        return {
          s3Url: fileUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: contentType,
        };
      } catch (error) {
        setUploadProgress((prev) =>
          prev ? { ...prev, status: "failed" } : null
        );
        throw error;
      }
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to upload attachment. Please try again.");
    },
    onSuccess: () => {
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(null);
      }, 1000);
    },
  });

  const clearProgress = () => setUploadProgress(null);

  return {
    uploadAttachment: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    clearProgress,
  };
}

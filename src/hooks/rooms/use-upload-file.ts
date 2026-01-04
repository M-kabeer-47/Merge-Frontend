import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { uploadToS3 } from "@/utils/s3-upload";
import type { UploadProgress } from "@/types/content";
import { refreshFolderCache } from "@/server-actions/room-content";
import { tryIt } from "@/utils/try-it";

interface UseUploadFileOptions {
  roomId: string;
  folderId?: string | null;
  onSuccess?: () => void;
}

interface UploadResult {
  file: File;
  uploadId: string;
  result: any;
}

export default function useUploadFile({
  roomId,
  folderId,
  onSuccess,
}: UseUploadFileOptions) {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const queryKey = [
    "room-content",
    roomId,
    folderId || null,
    "", // searchQuery - default empty
    null, // sortBy - default null
    null, // sortOrder - default null
  ];

  // Helper to update a specific upload's progress (not a useCallback - only used inside mutation)
  const updateUpload = (id: string, updates: Partial<UploadProgress>) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, ...updates } : upload
      )
    );
  };

  // Single mutation that handles the complete 3-step upload flow
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      uploadId,
    }: {
      file: File;
      uploadId: string;
    }): Promise<UploadResult> => {
      const contentType = file.type || "application/octet-stream";

      // Step 1: Get pre-signed URL from backend
      updateUpload(uploadId, { progress: 0 });

      const presignedResponse = await api.post(
        `/files/presigned-url/room/${roomId}`,
        {
          originalName: file.name,
          contentType,
          size: file.size,
          folderId: folderId || undefined,
        }
      );

      const { uploadUrl, fileKey, fileUrl } = presignedResponse.data;

      // Step 2: Upload directly to S3 with progress tracking
      await uploadToS3(uploadUrl, file, contentType, (percent) => {
        // Reserve last 5% for confirmation step
        updateUpload(uploadId, { progress: Math.min(percent, 95) });
      });

      // Step 3: Confirm upload to backend (saves metadata to DB)
      updateUpload(uploadId, { progress: 98 });

      const confirmResponse = await api.post(
        `/files/confirm-upload/room/${roomId}`,
        {
          fileKey,
          fileUrl,
          originalName: file.name,
          contentType,
          size: file.size,
          folderId: folderId || undefined,
        }
      );

      return { file, uploadId, result: confirmResponse.data };
    },

    onSuccess: ({ uploadId }) => {
      updateUpload(uploadId, { status: "completed", progress: 100 });
      refreshFolderCache(roomId, folderId);
    },

    onError: (error: any, { uploadId }) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Upload failed. Please try again.";
      updateUpload(uploadId, { status: "error", error: errorMessage });
    },
  });

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const uploadPromises: Promise<UploadResult>[] = [];

    for (const file of fileArray) {
      const uploadId = `upload-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      setUploads((prev) => [
        ...prev,
        {
          id: uploadId,
          fileName: file.name,
          progress: 0,
          size: file.size,
          status: "uploading",
        },
      ]);

      uploadPromises.push(uploadMutation.mutateAsync({ file, uploadId }));
    }

    // Update React Query cache with new files

    // Call onSuccess callback to reset UI state (search, sort, etc.)

    const [results, error] = await tryIt(Promise.all(uploadPromises));
    if (results) {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        // Extract the actual file data from the API response and add timestamp
        const filesWithTimestamp = results.map(
          (uploadResult: UploadResult) => ({
            ...uploadResult.result, // result contains the file metadata from confirmResponse.data
            updatedAt: "Just now",
          })
        );
        return {
          ...old,
          files: [...(old.files || []), ...filesWithTimestamp],
          total: {
            ...old.total,
            files: (old.total?.files || 0) + results.length,
            combined: (old.total?.combined || 0) + results.length,
          },
        };
      });

      toast.success(
        fileArray.length === 1
          ? "File uploaded successfully!"
          : `${fileArray.length} files uploaded successfully!`
      );

      // Auto-dismiss the upload tray after 1 second
      setTimeout(() => {
        setUploads([]);
      }, 1000);
    } else if (error) {
      toast.error(error?.response?.data?.message || "Failed to upload file.");
    }
  };

  // Public API: Remove an upload from the list
  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  // Public API: Clear all uploads
  const clearAll = () => {
    setUploads([]);
  };

  return {
    uploads,
    uploadFiles,
    removeUpload,
    clearAll,
    isUploading: uploads.some((u) => u.status === "uploading"),
  };
}

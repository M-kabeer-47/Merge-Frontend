import { useState, useCallback } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useRotateToken from "@/utils/rotate-token";
import type { UploadProgress } from "@/types/content";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

const isClient = typeof window !== "undefined";

interface UseUploadFileOptions {
  roomId: string;
  folderId?: string | null;
  searchQuery?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  fileUrl: string;
}

export default function useUploadFile({
  roomId,
  folderId,
  searchQuery = "",
  sortBy,
  sortOrder,
}: UseUploadFileOptions) {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const { rotateToken, isRotationPending } = useRotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  // Update a specific upload's progress
  const updateUpload = useCallback(
    (id: string, updates: Partial<UploadProgress>) => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === id ? { ...upload, ...updates } : upload
        )
      );
    },
    []
  );

  // Remove an upload from the list
  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  }, []);

  // Clear all completed/error uploads
  const clearCompleted = useCallback(() => {
    setUploads((prev) =>
      prev.filter((upload) => upload.status === "uploading")
    );
  }, []);

  // Clear all uploads
  const clearAll = useCallback(() => {
    setUploads([]);
  }, []);

  // Step 1: Get pre-signed URL from backend
  const getPresignedUrl = useCallback(
    async (file: File): Promise<PresignedUrlResponse> => {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/presigned-url/room/${roomId}`,
        {
          originalName: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          folderId: folderId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    [roomId, folderId]
  );

  // Step 2: Upload directly to S3 using XMLHttpRequest for real progress
  const uploadToS3 = useCallback(
    (
      uploadUrl: string,
      file: File,
      contentType: string,
      onProgress: (percent: number) => void
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            console.error("S3 upload failed:", xhr.status, xhr.responseText);
            reject(new Error(`S3 upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error("S3 upload network error - check CORS configuration");
          reject(
            new Error(
              "Network error during S3 upload. Check S3 CORS configuration."
            )
          );
        };

        xhr.open("PUT", uploadUrl);
        // Set the Content-Type to match what the pre-signed URL was created with
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.send(file);
      });
    },
    []
  );

  // Step 3: Confirm upload to backend (save file metadata to DB)
  const confirmUpload = useCallback(
    async (file: File, fileKey: string, fileUrl: string): Promise<any> => {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/confirm-upload/room/${roomId}`,
        {
          fileKey,
          fileUrl,
          originalName: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          folderId: folderId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    [roomId, folderId]
  );

  // Upload a single file with pre-signed URL flow
  const uploadFile = useCallback(
    async (file: File, uploadId: string) => {
      const contentType = file.type || "application/octet-stream";

      try {
        // Step 1: Get pre-signed URL
        updateUpload(uploadId, { progress: 0 });
        const { uploadUrl, fileKey, fileUrl } = await getPresignedUrl(file);

        // Step 2: Upload to S3 with real progress
        await uploadToS3(uploadUrl, file, contentType, (percent) => {
          // Reserve last 5% for confirmation step
          updateUpload(uploadId, { progress: Math.min(percent, 95) });
        });

        // Step 3: Confirm upload to backend
        updateUpload(uploadId, { progress: 98 });
        const result = await confirmUpload(file, fileKey, fileUrl);

        // Mark as completed
        updateUpload(uploadId, { status: "completed", progress: 100 });

        return result;
      } catch (error: any) {
        // Handle 401 - try token rotation
        if (error?.response?.status === 401) {
          try {
            await rotateToken();
            // Retry upload after token rotation
            return uploadFile(file, uploadId);
          } catch (rotationError) {
            updateUpload(uploadId, {
              status: "error",
              error: "Session expired. Please sign in again.",
            });
            throw rotationError;
          }
        }

        // Handle other errors
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Upload failed. Please try again.";
        updateUpload(uploadId, { status: "error", error: errorMessage });
        throw error;
      }
    },
    [getPresignedUrl, uploadToS3, confirmUpload, updateUpload, rotateToken]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const uploadPromises: Promise<any>[] = [];
      const uploadedFiles: any[] = [];

      for (const file of fileArray) {
        const uploadId = `upload-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Add to uploads state
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

        // Start upload and collect results
        const uploadPromise = uploadFile(file, uploadId).then((result) => {
          uploadedFiles.push(result);
          return result;
        });
        uploadPromises.push(uploadPromise);
      }

      // Wait for all uploads to complete
      try {
        await Promise.all(uploadPromises);

        // Add uploaded files to cache using setQueryData
        queryClient.setQueryData(
          [
            "room-content",
            roomId,
            folderId || null,
            searchQuery,
            sortBy,
            sortOrder,
          ],
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              files: [...(old.files || []), ...uploadedFiles],
              total: {
                ...old.total,
                files: (old.total?.files || 0) + uploadedFiles.length,
                combined: (old.total?.combined || 0) + uploadedFiles.length,
              },
            };
          }
        );

        toast.success(
          fileArray.length === 1
            ? "File uploaded successfully!"
            : `${fileArray.length} files uploaded successfully!`
        );
      } catch (error) {
        // Individual errors are already handled in uploadFile
        console.error("Some uploads failed:", error);
      }
    },
    [uploadFile, queryClient, roomId, folderId, searchQuery, sortBy, sortOrder]
  );

  return {
    uploads,
    uploadFiles,
    removeUpload,
    clearCompleted,
    clearAll,
    isUploading:
      uploads.some((u) => u.status === "uploading") || isRotationPending,
  };
}

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

  // Upload a single file with progress tracking
  const uploadFile = useCallback(
    async (file: File, uploadId: string) => {
      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("file", file);

      // Add folderId if present
      if (folderId) {
        formData.append("folderId", folderId);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/files/upload/course-content/${roomId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                updateUpload(uploadId, { progress: percentCompleted });
              }
            },
          }
        );

        // Mark as completed
        updateUpload(uploadId, { status: "completed", progress: 100 });

        return response.data;
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
          error?.response?.data?.message || "Upload failed. Please try again.";
        updateUpload(uploadId, { status: "error", error: errorMessage });
        throw error;
      }
    },
    [roomId, folderId, updateUpload, rotateToken]
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

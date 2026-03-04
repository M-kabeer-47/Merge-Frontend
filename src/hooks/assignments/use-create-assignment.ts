import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { uploadToS3 } from "@/utils/s3-upload";
import { addAssignmentToCache } from "@/lib/cache";

export interface CreateAssignmentData {
  roomId: string;
  title: string;
  description?: string;
  totalScore: number;
  scheduledAt?: string; // ISO 8601 format
  endAt: string; // ISO 8601 format (due date)
  isTurnInLateEnabled: boolean;
}

export interface AttachmentUploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

interface UseCreateAssignmentOptions {
  onSuccess?: () => void;
}

export default function useCreateAssignment({
  onSuccess,
}: UseCreateAssignmentOptions = {}) {
  const queryClient = useQueryClient();
  const [attachmentProgress, setAttachmentProgress] = useState<
    AttachmentUploadProgress[]
  >([]);

  // Helper to update attachment progress
  const updateProgress = (
    id: string,
    updates: Partial<AttachmentUploadProgress>,
  ) => {
    setAttachmentProgress((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  // Upload a single attachment and return its URL
  const uploadAttachment = async (
    file: File,
    roomId: string,
    progressId: string,
  ): Promise<string> => {
    const contentType = file.type || "application/octet-stream";

    // Get pre-signed URL for assignment attachment
    const presignedResponse = await api.post(
      `/files/presigned-url/assignment/${roomId}`,
      {
        originalName: file.name,
        contentType,
        size: file.size,
      },
    );

    const { uploadUrl, fileUrl } = presignedResponse.data;

    // Upload to S3
    await uploadToS3(uploadUrl, file, contentType, (percent) => {
      updateProgress(progressId, { progress: percent, status: "uploading" });
    });

    return fileUrl;
  };

  // Main mutation for creating assignment
  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async ({
      data,
      attachments,
    }: {
      data: CreateAssignmentData;
      attachments: File[];
    }) => {
      // Initialize progress tracking for all attachments
      const progressItems: AttachmentUploadProgress[] = attachments.map(
        (file, index) => ({
          id: `attachment-${index}-${Date.now()}`,
          fileName: file.name,
          progress: 0,
          status: "pending" as const,
        }),
      );
      setAttachmentProgress(progressItems);

      // Upload all attachments and build assignmentFiles array
      const assignmentFiles: { name: string; url: string }[] = [];

      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        const progressId = progressItems[i].id;

        try {
          const fileUrl = await uploadAttachment(file, data.roomId, progressId);
          assignmentFiles.push({
            name: file.name,
            url: fileUrl,
          });
          updateProgress(progressId, { status: "completed", progress: 100 });
        } catch (error) {
          updateProgress(progressId, {
            status: "error",
            error: "Upload failed",
          });
          throw error;
        }
      }

      // Create assignment with uploaded files
      const response = await api.post("/assignments/create", {
        ...data,
        assignmentFiles,
      });
      return response.data;
    },
    onSuccess: (newAssignment, { data: assignmentData }) => {
      // Optimistically add assignment to cache + invalidate for background sync
      addAssignmentToCache(queryClient, assignmentData.roomId, newAssignment);

      toast.success("Assignment created successfully!");
      setAttachmentProgress([]);
      onSuccess?.();
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to create assignment. Please try again.");
      setAttachmentProgress([]);
    },
  });

  return {
    createAssignment: mutateAsync,
    isCreating: isPending,
    isSuccess: isSuccess,
    attachmentProgress,
  };
}

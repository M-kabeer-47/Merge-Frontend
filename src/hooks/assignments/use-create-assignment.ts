import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { uploadToS3 } from "@/utils/s3-upload";

export interface CreateAssignmentData {
  roomId: string;
  title: string;
  description?: string;
  points: number;
  startAt?: string; // ISO 8601 format
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
    updates: Partial<AttachmentUploadProgress>
  ) => {
    setAttachmentProgress((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Upload a single attachment and return its URL
  const uploadAttachment = async (
    file: File,
    roomId: string,
    progressId: string
  ): Promise<string> => {
    const contentType = file.type || "application/octet-stream";

    // Get pre-signed URL for assignment attachment
    const presignedResponse = await api.post(
      `/files/presigned-url/assignment/${roomId}`,
      {
        originalName: file.name,
        contentType,
        size: file.size,
      }
    );

    const { uploadUrl, fileUrl } = presignedResponse.data;

    // Upload to S3
    await uploadToS3(uploadUrl, file, contentType, (percent) => {
      updateProgress(progressId, { progress: percent, status: "uploading" });
    });

    return fileUrl;
  };

  // Main mutation for creating assignment
  const createAssignmentMutation = useMutation({
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
        })
      );
      setAttachmentProgress(progressItems);

      // Upload all attachments in parallel
      const uploadedUrls: string[] = [];

      if (attachments.length > 0) {
        const uploadPromises = attachments.map(async (file, index) => {
          const progressId = progressItems[index].id;
          try {
            const url = await uploadAttachment(file, data.roomId, progressId);
            updateProgress(progressId, { status: "completed", progress: 100 });
            return url;
          } catch (error) {
            updateProgress(progressId, {
              status: "error",
              error: "Upload failed",
            });
            throw error;
          }
        });

        const results = await Promise.all(uploadPromises);
        uploadedUrls.push(...results);
      }

      // Create assignment with uploaded URLs
      const payload = {
        roomId: data.roomId,
        title: data.title,
        description: data.description || undefined,
        assignmentUrls: uploadedUrls, // Array of S3 URLs
        points: data.points,
        startAt: data.startAt || undefined,
        endAt: data.endAt,
        isTurnInLateEnabled: data.isTurnInLateEnabled,
      };

      const response = await api.post("/assignments/create", payload);
      return response.data;
    },
    onSuccess: (data, { data: assignmentData }) => {
      // Invalidate assignments query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["assignments", assignmentData.roomId],
      });

      toast.success("Assignment created successfully!");
      setAttachmentProgress([]);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create assignment. Please try again."
      );
      setAttachmentProgress([]);
    },
  });

  const createAssignment = async (
    data: CreateAssignmentData,
    attachments: File[]
  ) => {
    return createAssignmentMutation.mutateAsync({ data, attachments });
  };

  return {
    createAssignment,
    isCreating: createAssignmentMutation.isPending,
    isSuccess: createAssignmentMutation.isSuccess,
    attachmentProgress,
  };
}

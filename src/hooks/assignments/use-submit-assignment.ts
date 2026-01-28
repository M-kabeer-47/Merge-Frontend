import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { uploadToS3 } from "@/utils/s3-upload";
import type { Assignment, SubmissionStatus } from "@/types/assignment";
import { useRouter } from "next/navigation";
import { refreshStudentAssignmentCache } from "@/server-actions/assignments";
import { studentAssignmentQueryKey } from "./use-student-assignment";

export interface SubmitAssignmentData {
  assignmentId: string;
  roomId: string;
  files: File[];
  filesAlreadyUploaded?: { name: string; url: string }[];
  note?: string;
}

interface SubmitAssignmentPayload {
  assignmentId: string;
  roomId: string;
  files: { name: string; url: string }[];
  note?: string;
}

interface AssignmentsResponse {
  assignments: Assignment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Hook to submit an assignment with file uploads and optimistic updates
 */
export default function useSubmitAssignment() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Upload a single file and return its URL
  const uploadFile = async (
    file: File,
    assignmentId: string,
    onProgress?: (percent: number) => void,
  ): Promise<{ name: string; url: string }> => {
    const contentType = file.type || "application/octet-stream";

    // Get pre-signed URL for submission
    const presignedResponse = await api.post(
      `/files/presigned-url/attempt/${assignmentId}`,
      {
        originalName: file.name,
        contentType,
        size: file.size,
      },
    );

    const { uploadUrl, fileUrl } = presignedResponse.data;

    // Upload to S3
    await uploadToS3(uploadUrl, file, contentType, onProgress);

    return {
      name: file.name,
      url: fileUrl,
    };
  };

  // Helper to update assignment in a list cache
  // Handles both array format and object format (with .assignments property)
  const updateAssignmentInList = (
    old: AssignmentsResponse | Assignment[] | undefined,
    assignmentId: string,
  ): AssignmentsResponse | Assignment[] | undefined => {
    if (!old) return old;

    // If it's an array, map directly
    if (Array.isArray(old)) {
      return old.map((a) =>
        a.id === assignmentId
          ? { ...a, submissionStatus: "submitted" as SubmissionStatus }
          : a,
      );
    }

    // If it's an object with assignments property
    if (old.assignments && Array.isArray(old.assignments)) {
      return {
        ...old,
        assignments: old.assignments.map((a) =>
          a.id === assignmentId
            ? { ...a, submissionStatus: "submitted" as SubmissionStatus }
            : a,
        ),
      };
    }

    return old;
  };

  const { isPending, isSuccess, mutateAsync } = useMutation({
    mutationFn: async (data: SubmitAssignmentData) => {
      // Upload all files first
      const uploadedFiles: { name: string; url: string }[] = [];
      if (data.files.length > 0) {
        for (const file of data.files) {
          const uploaded = await uploadFile(file, data.assignmentId);
          uploadedFiles.push(uploaded);
        }
      }

      // Submit assignment with uploaded file URLs
      const payload: SubmitAssignmentPayload = {
        assignmentId: data.assignmentId,
        roomId: data.roomId,
        files: [...uploadedFiles, ...(data.filesAlreadyUploaded ?? [])],
        note: data.note,
      };

      const response = await api.post("/assignments/attempts", payload);
      return response.data;
    },
    onSuccess: (attemptData, data) => {
      // Update assignment detail cache with new attempt data
      // Query key includes "student" for student view
      queryClient.setQueryData(
        studentAssignmentQueryKey(data.assignmentId),
        (old: Assignment | undefined) => {
          if (!old) return old;
          return {
            ...old,
            submissionStatus: "submitted" as SubmissionStatus,
            attempt: {
              id: attemptData.id,
              files: attemptData.files,
              submitAt: attemptData.submitAt,
              score: attemptData.score,
              note: data.note || null,
            },
          };
        },
      );

      // Update all assignment list caches (different sort params)
      // Get all active queries that match assignments pattern
      const queryCache = queryClient.getQueryCache();
      const assignmentQueries = queryCache.findAll({
        queryKey: ["assignments", data.roomId],
      });

      // Update each matching query
      assignmentQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (old: AssignmentsResponse | Assignment[] | undefined) =>
            updateAssignmentInList(old, data.assignmentId),
        );
      });

      // Invalidate Next.js server cache for this assignment
      refreshStudentAssignmentCache(data.roomId, data.assignmentId);

      toast.success("Assignment submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to submit assignment",
      );
    },
  });

  return {
    submitAssignment: mutateAsync,
    isSubmitting: isPending,
    isSuccess,
  };
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { StudentAssignment } from "@/types/assignment";
import {
  isStudentAssignment,
  isInstructorAssignment,
} from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import AssignmentDetailSkeleton from "@/components/ui/skeletons/AssignmentDetailSkeleton";
import StudentAssignmentView from "@/components/assignments/StudentAssignmentView";
import InstructorAssignmentView from "@/components/assignments/InstructorAssignmentView";
import AssignmentHeader from "@/components/assignments/AssignmentHeader";
import { useAuth } from "@/providers/AuthProvider";
import useFetchAssignmentById from "@/hooks/assignments/use-fetch-assignment-by-id";
import useSubmitAssignment from "@/hooks/assignments/use-submit-assignment";
import useDeleteAssignmentAttempt from "@/hooks/assignments/use-delete-assignment-attempt";
import { useRoom } from "@/providers/RoomProvider";

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const assignmentId = params ? (params.assignmentId as string) : "";
  const roomId = params ? (params.id as string) : "";

  // File selection state (lifted from sidebar)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");

  // State for previously submitted files (can be edited after undo turn in)
  const [submittedFiles, setSubmittedFiles] = useState<
    { name: string; url: string }[]
  >([]);

  const { user, isLoading: isAuthLoading } = useAuth();
  const { userRole } = useRoom();
  const isInstructor = userRole === "instructor" || userRole === "moderator";

  // Fetch assignment data from API based on role
  const { data: assignment, isLoading: isAssignmentLoading } =
    useFetchAssignmentById({
      assignmentId,
      roomId,
      isInstructor,
      enabled: !!assignmentId,
    });
  const { submitAssignment, isSubmitting } = useSubmitAssignment();
  const { deleteAttempt, isDeleting } = useDeleteAssignmentAttempt();
  const isLoading = isAuthLoading || isAssignmentLoading;

  // Sync submitted files and comment from loaded assignment data
  useEffect(() => {
    if (assignment && isStudentAssignment(assignment)) {
      // Set comment from attempt note
      if (assignment.attempt?.note) {
        setComment(assignment.attempt.note);
      }
      // Set submitted files from attempt
      if (assignment.attempt?.files) {
        setSubmittedFiles(assignment.attempt.files);
      } else {
        setSubmittedFiles([]);
      }
    }
  }, [assignment]);

  if (isLoading) {
    return <AssignmentDetailSkeleton isInstructor={isInstructor} />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/sign-in");
    return null;
  }
  if (!assignment) {
    return (
      <div className="h-full flex items-center justify-center bg-main-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">
            Assignment Not Found
          </h1>
          <p className="text-para-muted">
            The assignment you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push(`/rooms/${roomId}/assignments`)}
            className="mt-4"
          >
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  // Delete attempt hook (undo turn in)

  // Calculate submission-related states
  const isPastDue = new Date() > new Date(assignment.endAt);
  const isClosed = assignment.isClosed;

  // canSubmit: not closed AND (not past due OR can turn in late)
  const canSubmit =
    !isClosed && (!isPastDue || (isPastDue && assignment.isTurnInLateEnabled));

  const submissionStatus = isStudentAssignment(assignment)
    ? assignment.submissionStatus
    : undefined;

  const attempt = isStudentAssignment(assignment) ? assignment.attempt : null;

  const handleBack = () => {
    router.push(`/rooms/${roomId}/assignments`);
  };

  // Submit with files from state (files are optional)
  const handleTurnIn = async () => {
    if (selectedFiles.length === 0 && assignment.attempt?.files.length === 0) {
      document
        .querySelector('[data-sidebar="your-work"]')
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    await submitAssignment({
      assignmentId,
      roomId,
      files: selectedFiles,
      filesAlreadyUploaded: assignment?.attempt.files,
      note: comment,
    });
  };

  // Undo turn in (delete attempt)
  const handleUndoTurnIn = async () => {
    if (!attempt) return;

    await deleteAttempt({
      assignmentId,
      attemptId: attempt.id,
      roomId,
    });
  };

  // File handlers for sidebar
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler to remove previously submitted files (after undo turn in)
  const handleRemoveSubmittedFile = (index: number) => {
    setSubmittedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header */}
      <AssignmentHeader
        assignment={assignment}
        isInstructor={isInstructor}
        submissionStatus={submissionStatus}
        canSubmit={canSubmit}
        onBack={handleBack}
        onTurnIn={isInstructor ? undefined : handleTurnIn}
        onUndoTurnIn={isInstructor ? undefined : handleUndoTurnIn}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        hasFiles={selectedFiles.length > 0 || submittedFiles.length > 0}
        isPastDue={isPastDue}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-4">
          {isInstructorAssignment(assignment) ? (
            <InstructorAssignmentView assignment={assignment} />
          ) : (
            <StudentAssignmentView
              assignment={assignment as StudentAssignment}
              canSubmit={canSubmit}
              selectedFiles={selectedFiles}
              comment={comment}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveFile}
              onCommentChange={setComment}
              submittedFiles={submittedFiles}
              onRemoveSubmittedFile={handleRemoveSubmittedFile}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { StudentAssignment } from "@/types/assignment";
import { isStudentAssignment } from "@/types/assignment";
import AssignmentHeader from "./AssignmentHeader";
import StudentAssignmentView from "./StudentAssignmentView";
import useSubmitAssignment from "@/hooks/assignments/use-submit-assignment";
import useDeleteAssignmentAttempt from "@/hooks/assignments/use-delete-assignment-attempt";

interface StudentAssignmentClientProps {
  assignment: StudentAssignment;
  roomId: string;
}

export default function StudentAssignmentClient({
  assignment,
  roomId,
}: StudentAssignmentClientProps) {
  const router = useRouter();
  const assignmentId = assignment.id;

  // File selection state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");

  // State for previously submitted files (can be edited after undo turn in)
  const [submittedFiles, setSubmittedFiles] = useState<
    { name: string; url: string }[]
  >([]);

  const { submitAssignment, isSubmitting } = useSubmitAssignment();
  const { deleteAttempt, isDeleting } = useDeleteAssignmentAttempt();

  // Sync submitted files and comment from assignment data
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
    console.log("Inside handleTurnIn");

    if (
      selectedFiles.length === 0 ||
      (attempt && attempt.files?.length === 0)
    ) {
      document
        .querySelector('[data-sidebar="your-work"]')
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    await submitAssignment({
      assignmentId,
      roomId,
      files: selectedFiles,
      filesAlreadyUploaded: attempt?.files,
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
        isInstructor={false}
        submissionStatus={submissionStatus}
        canSubmit={canSubmit}
        onBack={handleBack}
        onTurnIn={handleTurnIn}
        onUndoTurnIn={handleUndoTurnIn}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        hasFiles={selectedFiles.length > 0 || submittedFiles.length > 0}
        isPastDue={isPastDue}
      />

      {/* Main Content - Student View */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-4">
          <StudentAssignmentView
            assignment={assignment}
            canSubmit={canSubmit}
            selectedFiles={selectedFiles}
            comment={comment}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={handleRemoveFile}
            onCommentChange={setComment}
            submittedFiles={submittedFiles}
            onRemoveSubmittedFile={handleRemoveSubmittedFile}
          />
        </div>
      </div>
    </div>
  );
}

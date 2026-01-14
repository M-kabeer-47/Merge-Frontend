import type { StudentAssignment } from "@/types/assignment";
import InstructionsSection from "./student-view/InstructionsSection";
import FeedbackSection from "./student-view/FeedbackSection";
import YourWorkSidebar from "./student-view/YourWorkSidebar";

interface StudentAssignmentViewProps {
  assignment: StudentAssignment;
  canSubmit: boolean;
  selectedFiles: File[];
  comment: string;
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onCommentChange: (comment: string) => void;
  // For managing submitted files after undo turn in
  submittedFiles?: { name: string; url: string }[];
  onRemoveSubmittedFile?: (index: number) => void;
}

export default function StudentAssignmentView({
  assignment,
  canSubmit,
  selectedFiles,
  comment,
  onFilesSelected,
  onRemoveFile,
  onCommentChange,
  submittedFiles,
  onRemoveSubmittedFile,
}: StudentAssignmentViewProps) {
  const attempt = assignment.attempt;
  const submissionStatus = assignment.submissionStatus;
  const isGraded = submissionStatus === "graded";

  return (
    <>
      {/* Left Column - Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        <InstructionsSection
          description={assignment.description}
          assignmentFiles={assignment.assignmentFiles}
        />

        <FeedbackSection feedback={attempt?.feedback} isGraded={isGraded} />
      </div>

      {/* Right Column - Your Work Sidebar */}
      <YourWorkSidebar
        attempt={attempt}
        submissionStatus={submissionStatus}
        canSubmit={canSubmit}
        selectedFiles={selectedFiles}
        comment={comment}
        onFilesSelected={onFilesSelected}
        onRemoveFile={onRemoveFile}
        onCommentChange={onCommentChange}
        submittedFiles={submittedFiles}
        onRemoveSubmittedFile={onRemoveSubmittedFile}
      />
    </>
  );
}

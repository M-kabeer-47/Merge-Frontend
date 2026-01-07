import type { StudentAssignment } from "@/types/assignment";
import InstructionsSection from "./student-view/InstructionsSection";
import ResourcesSection from "./student-view/ResourcesSection";
import FeedbackSection from "./student-view/FeedbackSection";
import YourWorkSidebar from "./student-view/YourWorkSidebar";

interface StudentAssignmentViewProps {
  assignment: StudentAssignment;
  isOverdue: boolean;
  onSubmit: (files: File[], comment: string) => void;
  isUploading?: boolean;
}

export default function StudentAssignmentView({
  assignment,
  isOverdue,
  onSubmit,
  isUploading = false,
}: StudentAssignmentViewProps) {
  const submission = assignment.submission;
  const submissionStatus = assignment.submissionStatus;
  const isGraded = submission?.status === "graded";

  return (
    <>
      {/* Left Column - Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        <InstructionsSection description={assignment.description} />

        <ResourcesSection attachments={assignment.attachments} />

        <FeedbackSection feedback={submission?.feedback} isGraded={isGraded} />
      </div>

      {/* Right Column - Your Work Sidebar */}
      <YourWorkSidebar
        submission={submission}
        submissionStatus={submissionStatus}
        isOverdue={isOverdue}
        onSubmit={onSubmit}
        isUploading={isUploading}
      />
    </>
  );
}

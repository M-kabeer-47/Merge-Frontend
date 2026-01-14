"use client";

import type { InstructorAssignment } from "@/types/assignment";
import InstructionsSection from "./student-view/InstructionsSection";
import HorizontalStats from "./instructor-view/HorizontalStats";
import SubmissionsTable from "./instructor-view/SubmissionsTable";

interface InstructorAssignmentViewProps {
  assignment: InstructorAssignment;
}

/**
 * Main instructor view for an assignment.
 * Layout: Instructions -> Horizontal Stats -> Submissions Table
 */
export default function InstructorAssignmentView({
  assignment,
}: InstructorAssignmentViewProps) {
  const { attempts, totalAttempts, gradedAttempts, ungradedAttempts } =
    assignment;

  return (
    <div className="w-full space-y-6">
      {/* Instructions & Files */}
      <InstructionsSection
        description={assignment.description}
        assignmentFiles={assignment.assignmentFiles}
      />

      {/* Horizontal Stats Row */}
      <HorizontalStats
        totalAttempts={totalAttempts}
        gradedAttempts={gradedAttempts}
        ungradedAttempts={ungradedAttempts}
        totalScore={assignment.totalScore}
        dueDate={assignment.endAt}
        isClosed={assignment.isClosed}
      />

      {/* Submissions Table */}
      <SubmissionsTable
        attempts={attempts.data}
        totalScore={assignment.totalScore}
      />
    </div>
  );
}

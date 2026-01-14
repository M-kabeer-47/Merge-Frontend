import { FileText } from "lucide-react";
import {
  Assignment,
  isStudentAssignment,
  isInstructorAssignment,
} from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import AssignmentStatusBadge from "./card/AssignmentStatusBadge";
import AssignmentCardMenu from "./card/AssignmentCardMenu";
import AssignmentMetaInfo from "./card/AssignmentMetaInfo";
import AssignmentAttachments from "./card/AssignmentAttachments";
import { InstructorStats, StudentStats } from "./card/AssignmentStats";

interface AssignmentCardProps {
  assignment: Assignment;
  isInstructor?: boolean;
  bgColor?: string;
  onViewDetails?: (id: string) => void;
  onViewResponses?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AssignmentCard({
  assignment,
  isInstructor = false,
  bgColor,
  onViewDetails,
  onViewResponses,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const isClosed = assignment.isClosed;
  const cardBgColor = bgColor || "bg-background";

  // Type-safe access to student-specific fields
  const studentAssignment = isStudentAssignment(assignment) ? assignment : null;
  console.log("Student Assignment: " + isStudentAssignment(assignment));

  return (
    <div
      className={`relative border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden ${cardBgColor} hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent opacity-80" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-xl font-bold text-heading truncate flex-1 mb-2">
                {assignment.title}
              </h3>

              {/* Status Badge for Student */}
              {!isInstructor && studentAssignment && (
                <AssignmentStatusBadge
                  status={studentAssignment.submissionStatus}
                />
              )}

              {/* Menu for Instructor */}
              {isInstructor && (
                <AssignmentCardMenu
                  assignmentId={assignment.id}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )}
            </div>

            <AssignmentMetaInfo
              totalScore={assignment.totalScore}
              endAt={assignment.endAt}
              isInstructor={isInstructor}
              submissionStatus={studentAssignment?.submissionStatus}
              grade={studentAssignment?.score}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-para mb-4 line-clamp-2">
          {assignment.description}
        </p>

        {/* Status & Info Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left side - Status info */}
          <div className="flex items-center gap-3 flex-wrap">
            {isInstructor && isInstructorAssignment(assignment) && (
              <InstructorStats
                totalAttempts={assignment.totalAttempts}
                gradedAttempts={assignment.gradedAttempts}
                ungradedAttempts={assignment.ungradedAttempts}
                isClosed={isClosed}
              />
            )}

            {!isInstructor && studentAssignment && (
              <StudentStats
                submissionStatus={studentAssignment.submissionStatus}
                submittedAt={studentAssignment?.submittedAt}
              />
            )}
          </div>

          {/* Right side - Action button */}
          <div>
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                isInstructor
                  ? onViewResponses?.(assignment.id)
                  : onViewDetails?.(assignment.id)
              }
              className="text-xs px-3 py-1.5"
            >
              <FileText className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

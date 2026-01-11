"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { StudentAssignment } from "@/types/assignment";
import { isStudentAssignment } from "@/types/assignment";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StudentAssignmentView from "@/components/assignments/StudentAssignmentView";
import InstructorAssignmentView from "@/components/assignments/InstructorAssignmentView";
import { useAuth } from "@/providers/AuthProvider";
import useFetchAssignmentById from "@/hooks/assignments/use-fetch-assignment-by-id";
import { useRoom } from "@/providers/RoomProvider";

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const assignmentId = params ? (params.assignmentId as string) : "";
  const roomId = params ? (params.id as string) : "";

  // Get role from authenticated user
  const { userRole } = useRoom();
  const isInstructor = userRole === "instructor" || userRole === "moderator";
  console.log("userRole", userRole);

  // Fetch assignment data from API
  const { data: assignment, isLoading: isAssignmentLoading } =
    useFetchAssignmentById(assignmentId, !!assignmentId);
  console.log("submissionStatus", assignment?.submissionStatus);
  const isLoading = isAuthLoading || isAssignmentLoading;

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-main-background">
        <LoadingSpinner size="lg" />
      </div>
    );
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

  const isOverdue = new Date() > new Date(assignment.endAt);
  const submission = isStudentAssignment(assignment)
    ? assignment.submissionStatus
    : null;

  // Format dates
  const formatDueDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSubmit = (files: File[], comment: string) => {
    console.log("Submitting files:", files, "with comment:", comment);
    // TODO: Implement actual submission logic using upload utility
  };

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-light-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/rooms/${roomId}/assignments`)}
          className="flex items-center gap-2 text-para hover:text-heading -ml-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Button>

        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
              {assignment.title}
            </h1>
            <p className="text-para text-sm">
              {assignment.author.firstName} {assignment.author.lastName} •{" "}
              {assignment.totalScore} points
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-xs text-para-muted mb-1">Due</p>
              <p
                className={`text-sm font-semibold ${
                  isOverdue ? "text-destructive" : "text-heading"
                }`}
              >
                {formatDueDate(assignment.endAt)}
              </p>
            </div>

            {!isInstructor &&
              assignment.submissionStatus === "graded" &&
              assignment.grade !== undefined && (
                <div className="text-right">
                  <p className="text-xs text-para-muted mb-1">Your Grade</p>
                  <p className="text-sm font-semibold text-heading">
                    {assignment.grade}/{assignment.totalScore}
                  </p>
                </div>
              )}

            {/* Turn In Button for Students */}
            {!isInstructor &&
              (assignment.submissionStatus === "pending" ||
                (assignment.submissionStatus === "missed" &&
                  assignment.isTurnInLateEnabled)) && (
                <Button
                  className="w-[300px]"
                  onClick={() => {
                    // Scroll to submission area
                    document
                      .querySelector('[data-sidebar="your-work"]')
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Turn In
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-4">
          {isInstructor ? (
            <InstructorAssignmentView assignment={assignment} />
          ) : (
            <StudentAssignmentView
              assignment={assignment as StudentAssignment}
              isOverdue={isOverdue}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

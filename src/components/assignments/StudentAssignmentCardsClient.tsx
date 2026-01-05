"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import AssignmentCard from "./AssignmentCard";
import {
  EmptyAssignments,
  NoSearchResults,
  EmptyFilterResults,
} from "./EmptyStates";
import type { StudentAssignment } from "@/types/assignment";

interface StudentAssignmentCardsClientProps {
  assignments: StudentAssignment[];
  roomId: string;
  filter?: string;
  searchTerm: string;
}

export default function StudentAssignmentCardsClient({
  assignments,
  roomId,
  filter = "all",
  searchTerm,
}: StudentAssignmentCardsClientProps) {
  const router = useRouter();

  // Apply client-side filter
  const filteredAssignments = useMemo(() => {
    if (filter === "all") return assignments;

    return assignments.filter((assignment) => {
      const submission = assignment.submission;
      const isOverdue = new Date() > new Date(assignment.dueDate);
      const isSubmitted =
        submission.status === "submitted" || submission.status === "graded";

      switch (filter) {
        case "pending":
          // Pending: Not submitted and not overdue
          return !isSubmitted && !isOverdue;
        case "missed":
          // Missed: Overdue and not submitted
          return !isSubmitted && isOverdue;
        case "submitted":
          // Submitted: Either submitted or graded
          return isSubmitted;
        default:
          return true;
      }
    });
  }, [assignments, filter]);

  const handleViewDetails = (id: string) => {
    router.push(`/rooms/${roomId}/assignments/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("Edit assignment:", id);
    // TODO: Implement edit assignment functionality
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      console.log("Delete assignment:", id);
      // TODO: Implement delete assignment functionality
    }
  };

  const isEmpty = filteredAssignments.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasActiveFilter = filter !== "all";

  return (
    <div className="flex-1 overflow-y-auto">
      {isEmpty ? (
        <div className="h-full flex items-center justify-center">
          {hasSearchTerm ? (
            <NoSearchResults
              searchTerm={searchTerm}
              onClearSearch={() => router.push(`/rooms/${roomId}/assignments`)}
            />
          ) : hasActiveFilter ? (
            <EmptyFilterResults
              filterType={filter}
              onClearFilter={() => router.push(`/rooms/${roomId}/assignments`)}
            />
          ) : (
            <EmptyAssignments isInstructor={false} />
          )}
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-4 space-y-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

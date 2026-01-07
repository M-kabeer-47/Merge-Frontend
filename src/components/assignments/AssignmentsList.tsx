"use client";

import { useRouter } from "next/navigation";
import { useRoom } from "@/providers/RoomProvider";
import AssignmentCard from "./AssignmentCard";
import {
  EmptyAssignments,
  NoSearchResults,
  EmptyFilterResults,
} from "./EmptyStates";
import AssignmentCardsSkeleton from "./AssignmentCardsSkeleton";
import type {
  InstructorAssignment,
  StudentAssignment,
} from "@/types/assignment";

interface AssignmentsListProps {
  instructorAssignments: InstructorAssignment[];
  studentAssignments: StudentAssignment[];
  roomId: string;
  filter?: string;
  searchTerm: string;
}

export default function AssignmentsList({
  instructorAssignments,
  studentAssignments,
  roomId,
  filter = "all",
  searchTerm,
}: AssignmentsListProps) {
  const router = useRouter();
  const { userRole } = useRoom();

  const isInstructor = userRole === "instructor" || userRole === "moderator";

  // Show skeleton while role is being determined
  if (!userRole) {
    return <AssignmentCardsSkeleton />;
  }

  // Use appropriate assignments based on role
  const assignments = isInstructor ? instructorAssignments : studentAssignments;

  const handleViewDetails = (id: string) => {
    router.push(`/rooms/${roomId}/assignments/${id}`);
  };

  const handleViewResponses = (id: string) => {
    router.push(`/rooms/${roomId}/assignments/${id}/submissions`);
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

  const handleClearFilters = () => {
    router.push(`/rooms/${roomId}/assignments`);
  };

  const handleCreateFirst = () => {
    router.push(`/rooms/${roomId}/assignments/create`);
  };

  const isEmpty = assignments.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasActiveFilter = filter !== "all";

  // Empty state
  if (isEmpty) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          {hasSearchTerm ? (
            <NoSearchResults
              searchTerm={searchTerm}
              onClearSearch={handleClearFilters}
            />
          ) : hasActiveFilter ? (
            <EmptyFilterResults
              filterType={filter}
              onClearFilter={handleClearFilters}
            />
          ) : (
            <EmptyAssignments
              isInstructor={isInstructor}
              onCreateFirst={isInstructor ? handleCreateFirst : undefined}
            />
          )}
        </div>
      </div>
    );
  }

  // Instructor view - grid layout
  if (isInstructor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
          {instructorAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewResponses={handleViewResponses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  // Student view - list layout
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 py-4 space-y-4">
        {studentAssignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isInstructor={false}
          />
        ))}
      </div>
    </div>
  );
}

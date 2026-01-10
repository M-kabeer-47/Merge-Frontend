"use client";

import { useRouter } from "next/navigation";
import { useRoom } from "@/providers/RoomProvider";
import useFetchRoleBasedAssignments from "@/hooks/assignments/use-fetch-role-based-assignments";
import AssignmentCard from "./AssignmentCard";
import AssignmentCardsSkeleton from "./AssignmentCardsSkeleton";
import {
  EmptyAssignments,
  NoSearchResults,
  EmptyFilterResults,
} from "./EmptyStates";
import type {
  InstructorAssignment,
  StudentAssignment,
} from "@/types/assignment";

interface AssignmentsListProps {
  roomId: string;
  search: string | undefined;
  sortBy: string | undefined;
  filter: string | undefined;
  sortOrder: "asc" | "desc";
}

export default function AssignmentsList({
  roomId,
  search,
  sortBy,
  filter,
  sortOrder,
}: AssignmentsListProps) {
  const router = useRouter();
  const { userRole } = useRoom();

  const isInstructor = userRole === "instructor" || userRole === "moderator";

  // Fetch assignments based on role
  const { data: assignments = [], isLoading } = useFetchRoleBasedAssignments({
    roomId,
    isInstructor,
    search,
    sortBy,
    filter,
    sortOrder,
  });

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

  // Show skeleton while loading or role is not yet determined
  if (isLoading || !userRole) {
    return <AssignmentCardsSkeleton />;
  }

  const isEmpty = assignments.length === 0;
  const hasSearchTerm = search && search.trim().length > 0;
  const hasActiveFilter = filter !== "all";

  // Empty state
  if (isEmpty) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          {hasSearchTerm ? (
            <NoSearchResults
              searchTerm={search}
              onClearSearch={handleClearFilters}
            />
          ) : hasActiveFilter && filter ? (
            <EmptyFilterResults filterType={filter} />
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
          {(assignments as InstructorAssignment[]).map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              isInstructor={true}
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
        {(assignments as StudentAssignment[]).map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            isInstructor={false}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

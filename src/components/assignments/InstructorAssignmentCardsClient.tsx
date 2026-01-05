"use client";

import { useRouter } from "next/navigation";
import AssignmentCard from "./AssignmentCard";
import {
  EmptyAssignments,
  NoSearchResults,
  EmptyFilterResults,
} from "./EmptyStates";
import type { InstructorAssignment } from "@/types/assignment";

interface InstructorAssignmentCardsClientProps {
  assignments: InstructorAssignment[];
  roomId: string;
  filter?: string;
  searchTerm: string;
}

export default function InstructorAssignmentCardsClient({
  assignments,
  roomId,
  filter = "all",
  searchTerm,
}: InstructorAssignmentCardsClientProps) {
  const router = useRouter();

  // Apply client-side filter

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

  const isEmpty = assignments.length === 0;
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
            <EmptyAssignments
              isInstructor={true}
              onCreateFirst={() =>
                router.push(`/rooms/${roomId}/assignments/create`)
              }
            />
          )}
        </div>
      ) : (
        <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewResponses={handleViewResponses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

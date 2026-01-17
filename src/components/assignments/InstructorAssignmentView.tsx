"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import type { InstructorAssignment } from "@/types/assignment";
import InstructionsSection from "./student-view/InstructionsSection";
import HorizontalStats from "./instructor-view/HorizontalStats";
import SubmissionsTable from "./instructor-view/SubmissionsTable";
import Tabs from "@/components/ui/Tabs";
import useFetchSubmissions from "@/hooks/assignments/use-fetch-submissions";
import SubmissionsTableSkeleton from "@/components/ui/skeletons/SubmissionsTableSkeleton";

interface InstructorAssignmentViewProps {
  assignment: InstructorAssignment;
}

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "graded", label: "Graded" },
  { key: "ungraded", label: "Ungraded" },
];

const SUB_FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "late", label: "Late" },
  { key: "onTime", label: "On Time" },
];

export default function InstructorAssignmentView({
  assignment,
}: InstructorAssignmentViewProps) {
  const params = useParams();
  const roomId = params?.id as string;

  // Filter state managed internally for isolated re-renders
  const [filter, setFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { totalAttempts, gradedAttempts, ungradedAttempts } = assignment;

  // Check if we're on default filters (for using initialData)
  const isDefaultFilters =
    filter === "all" && subFilter === "all" && page === 1;

  // Fetch submissions separately with filters - only table reloads on filter change
  // Use server-fetched attempts as initialData for default filters to prevent double fetch
  const {
    data: submissions,
    isLoading: isLoadingSubmissions,
    isFetching,
  } = useFetchSubmissions({
    assignmentId: assignment.id,
    roomId,
    filter,
    subFilter: filter === "ungraded" ? subFilter : undefined,
    page,
    initialData: isDefaultFilters ? assignment.attempts : undefined,
  });

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
    if (newFilter !== "ungraded") {
      setSubFilter("all");
    }
  };

  const handleSubFilterChange = (newSubFilter: string) => {
    setSubFilter(newSubFilter);
    setPage(1); // Reset to first page when sub-filter changes
  };

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

      {/* Filter Tabs */}
      <div className="space-y-3">
        <Tabs
          options={FILTER_OPTIONS}
          activeKey={filter}
          onChange={handleFilterChange}
          className="max-w-sm"
        />

        {/* Sub-filters for ungraded */}
        {filter === "ungraded" && (
          <Tabs
            options={SUB_FILTER_OPTIONS}
            activeKey={subFilter}
            onChange={handleSubFilterChange}
            className="max-w-md"
          />
        )}
      </div>

      {/* Submissions Table */}
      {isLoadingSubmissions && !submissions ? (
        <SubmissionsTableSkeleton />
      ) : (
        <div className={isFetching ? "opacity-60 pointer-events-none" : ""}>
          <SubmissionsTable
            attempts={submissions?.data || []}
            totalScore={assignment.totalScore}
            currentPage={submissions?.currentPage ?? page}
            totalPages={submissions?.totalPages ?? 1}
            totalItems={submissions?.total ?? 0}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

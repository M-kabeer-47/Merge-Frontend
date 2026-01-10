"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import SortDropdown from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import { useRoom } from "@/providers/RoomProvider";
import { useUrlParams } from "@/hooks/common/use-url-params";
import type { AssignmentFilterType } from "@/types/assignment";
import type { SortOption, SortField } from "@/types/content";

interface AssignmentListHeaderProps {
  roomId: string;
  initialSearch?: string;
  initialSort?: string;
  initialFilter?: AssignmentFilterType;
  initialSortOrder: "asc" | "desc";
}

export default function AssignmentListHeader({
  roomId,
  initialSearch = "",
  initialSort = "endAt",
  initialFilter = "all",
  initialSortOrder = "desc",
}: AssignmentListHeaderProps) {
  const { userRole } = useRoom();
  const router = useRouter();
  const isInstructor = userRole === "instructor" || userRole === "moderator";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<AssignmentFilterType>(initialFilter);
  const [sortValue, setSortValue] = useState<SortOption>(
    initialSort
      ? { field: initialSort as SortField, order: initialSortOrder }
      : null
  );

  // Use the reusable URL params hook
  const { updateParams } = useUrlParams({
    basePath: `/rooms/${roomId}/assignments`,
    defaultValues: { filter: "all" },
  });

  const tabs = isInstructor
    ? [
        { key: "all", label: "All" },
        { key: "needs_grading", label: "Needs Grading" },
        { key: "graded", label: "Graded" },
      ]
    : [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "missed", label: "Missed" },
        { key: "completed", label: "Completed" },
      ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateParams({ search: value });
  };
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as AssignmentFilterType);
    updateParams({ filter });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortValue(sort);
    updateParams({
      sortBy: sort?.field || "",
      sortOrder: sort?.order || "",
    });
  };

  const handleCreateAssignment = () => {
    router.push(`/rooms/${roomId}/assignments/create`);
  };

  const sortOptions = [
    {
      field: "endAt" as SortField,
      label: "Due Date",
      descLabel: "Latest first",
      ascLabel: "Earliest first",
    },
    {
      field: "createdAt" as SortField,
      label: "Upload Date",
      descLabel: "Newest first",
      ascLabel: "Oldest first",
    },
    {
      field: "totalScore" as SortField,
      label: "Points",
      descLabel: "Highest first",
      ascLabel: "Lowest first",
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 border-b border-light-border space-y-4">
      {/* Top Row: Search and Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search assignments..."
            defaultValue={searchTerm}
          />
        </div>
        <div className="flex items-center gap-3">
          <SortDropdown
            options={sortOptions}
            value={sortValue}
            onChange={handleSortChange}
            placeholder="Sort by"
          />
          {isInstructor && (
            <Button
              onClick={handleCreateAssignment}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Assignment</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={isInstructor ? "max-w-[600px]" : "max-w-[800px]"}>
        <Tabs
          options={tabs}
          activeKey={activeFilter}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import SortDropdown from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import type { AssignmentFilterType } from "@/types/assignment";
import type { SortOption, SortField } from "@/types/content";

interface AssignmentListHeaderProps {
  roomId: string;
  isInstructor: boolean;
  initialSearch?: string;
  initialSort?: string;
  initialFilter?: AssignmentFilterType;
}

export default function AssignmentListHeader({
  roomId,
  isInstructor,
  initialSearch = "",
  initialSort = "dueDate",
  initialFilter = "all",
}: AssignmentListHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<AssignmentFilterType>(initialFilter);
  const [sortValue, setSortValue] = useState<SortOption>(
    initialSort ? { field: initialSort as SortField, order: "desc" } : null
  );

  const tabs = isInstructor
    ? [
        { key: "all", label: "All" },
        { key: "needs-grading", label: "Needs Grading" },
        { key: "graded", label: "Graded" },
      ]
    : [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "missed", label: "Missed" },
        { key: "submitted", label: "Submitted" },
      ];

  // Update URL params for shareable links
  const updateUrlParams = (params: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }) => {
    const current = new URLSearchParams(searchParams.toString());

    if (params.search !== undefined) {
      if (params.search) {
        current.set("search", params.search);
      } else {
        current.delete("search");
      }
    }

    if (params.sortBy !== undefined) {
      if (params.sortBy) {
        current.set("sortBy", params.sortBy);
      } else {
        current.delete("sortBy");
      }
    }

    if (params.sortOrder !== undefined) {
      if (params.sortOrder) {
        current.set("sortOrder", params.sortOrder);
      } else {
        current.delete("sortOrder");
      }
    }

    if (params.filter) {
      if (params.filter === "all") {
        current.delete("filter");
      } else {
        current.set("filter", params.filter);
      }
    }

    router.push(`/rooms/${roomId}/assignments?${current.toString()}`, {
      scroll: false,
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateUrlParams({ search: value });
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as AssignmentFilterType);
    updateUrlParams({ filter });
  };

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortValue(sort);
    updateUrlParams({
      sortBy: sort?.field || "",
      sortOrder: sort?.order || "",
    });
  };

  const handleCreateAssignment = () => {
    router.push(`/rooms/${roomId}/assignments/create`);
  };

  // Sort options for the dropdown
  const sortOptions = [
    {
      field: "dueDate" as SortField,
      label: "Due Date",
      descLabel: "Latest first",
      ascLabel: "Earliest first",
    },
    {
      field: "points" as SortField,
      label: "Points",
      descLabel: "Highest first",
      ascLabel: "Lowest first",
    },
    {
      field: "title" as SortField,
      label: "Title",
      descLabel: "Z to A",
      ascLabel: "A to Z",
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
      <div className={isInstructor ? "max-w-[600px]" : "max-w-[700px]"}>
        <Tabs
          options={tabs}
          activeKey={activeFilter}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

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
import type { QuizSortOption, QuizFilterType } from "@/types/quiz";
import type { SortOption, SortField } from "@/types/content";

interface QuizListHeaderProps {
  roomId: string;
  initialSearch?: string;
  initialSort?: QuizSortOption;
  initialSortOrder?: "asc" | "desc";
  initialFilter?: QuizFilterType;
}

export default function QuizListHeader({
  roomId,
  initialSearch = "",
  initialSort = "endAt",
  initialFilter = "all",
  initialSortOrder = "desc",
}: QuizListHeaderProps) {
  const { userRole } = useRoom();
  const isInstructor = userRole === "instructor";
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<QuizFilterType>(initialFilter);
  const [sortValue, setSortValue] = useState<SortOption>(
    initialSort
      ? { field: initialSort as SortField, order: initialSortOrder }
      : null
  );

  // Use the reusable URL params hook
  const { updateParams } = useUrlParams({
    basePath: `/rooms/${roomId}/quizzes`,
    defaultValues: { filter: "all" },
  });

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateParams({ search: value });
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as QuizFilterType);
    updateParams({ filter });
  };

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortValue(sort);
    updateParams({
      sortBy: sort?.field,
      sortOrder: sort?.order,
    });
  };

  const handleCreateQuiz = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  // Sort options for the dropdown (same for both students and instructors)
  // Backend accepts: createdAt, endAt, totalScore
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
      {/* Top Row: Search and Create Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search quizzes..."
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
              onClick={handleCreateQuiz}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Quiz</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-[500px]">
        <Tabs
          options={
            isInstructor
              ? [
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "closed", label: "Closed" },
                ]
              : [
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "completed", label: "Completed" },
                  { key: "missed", label: "Missed" },
                ]
          }
          activeKey={activeFilter}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

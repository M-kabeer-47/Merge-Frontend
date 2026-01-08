"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import SortDropdown from "@/components/ui/SortDropdown";
import { Button } from "@/components/ui/Button";
import { useRoom } from "@/providers/RoomProvider";
import type { QuizSortOption, QuizFilterType } from "@/types/quiz";
import type { SortOption, SortField } from "@/types/content";

interface QuizListHeaderProps {
  roomId: string;
  initialSearch?: string;
  initialSort?: QuizSortOption;
  initialFilter?: QuizFilterType;
}

export default function QuizListHeader({
  roomId,
  initialSearch = "",
  initialSort = "deadline",
  initialFilter = "all",
}: QuizListHeaderProps) {
  const { userRole } = useRoom();
  const isInstructor = userRole === "instructor" || userRole === "moderator";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<QuizFilterType>(initialFilter);
  const [sortValue, setSortValue] = useState<SortOption>(
    initialSort ? { field: initialSort as SortField, order: "desc" } : null
  );

  // Update URL params for shareable links
  const updateUrlParams = useCallback(
    (params: {
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

      router.push(`/rooms/${roomId}/quizzes?${current.toString()}`, {
        scroll: false,
      });
    },
    [router, roomId, searchParams]
  );

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateUrlParams({ search: value });
  };

  // Handle filter change
  const handleFilterChange = useCallback(
    (filter: string) => {
      setActiveFilter(filter as QuizFilterType);
      updateUrlParams({ filter });
    },
    [updateUrlParams]
  );

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortValue(sort);
    updateUrlParams({
      sortBy: sort?.field || "",
      sortOrder: sort?.order || "",
    });
  };

  const handleCreateQuiz = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  // Sort options for the dropdown
  const sortOptions = useMemo(() => {
    const baseOptions = [
      {
        field: "deadline" as SortField,
        label: "Deadline",
        descLabel: "Deadline",
        ascLabel: "Deadline",
      },
      {
        field: "upload-date" as SortField,
        label: "Upload Date" as SortField,
        descLabel: "Upload Date",
        ascLabel: "Upload Date",
      },
      {
        field: "title" as SortField,
        label: "Title",
        descLabel: "Z to A",
        ascLabel: "A to Z",
      },
    ];

    return baseOptions;
  }, [isInstructor]);

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

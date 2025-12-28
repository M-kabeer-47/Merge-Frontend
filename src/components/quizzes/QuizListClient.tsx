"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, SlidersHorizontal } from "lucide-react";
import QuizCard from "@/components/quizzes/QuizCard";
import {
  EmptyQuizzes,
  NoSearchResults,
  EmptyFilterResults,
} from "@/components/quizzes/EmptyStates";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/Dropdown";
import type {
  Quiz,
  QuizSortOption,
  QuizFilterType,
  StudentQuiz,
} from "@/types/quiz";

interface QuizListClientProps {
  roomId: string;
  quizzes: Quiz[];
  isInstructor: boolean;
  initialSearch?: string;
  initialSort?: QuizSortOption;
  initialFilter?: QuizFilterType;
}

export default function QuizListClient({
  roomId,
  quizzes,
  isInstructor,
  initialSearch = "",
  initialSort = "deadline",
  initialFilter = "all",
}: QuizListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for immediate UI feedback
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<QuizFilterType>(initialFilter);
  const [sortBy, setSortBy] = useState<QuizSortOption>(initialSort);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Update URL params (triggers server refetch via Next.js)
  const updateUrlParams = useCallback(
    (params: { search?: string; sortBy?: string; filter?: string }) => {
      const current = new URLSearchParams(searchParams.toString());

      if (params.search !== undefined) {
        if (params.search) {
          current.set("search", params.search);
        } else {
          current.delete("search");
        }
      }

      if (params.sortBy) {
        current.set("sortBy", params.sortBy);
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

  // Debounced search - update URL after typing stops
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateUrlParams({ search: value });
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as QuizFilterType);
    updateUrlParams({ filter });
  };

  // Handle sort change
  const handleSortChange = (sort: QuizSortOption) => {
    setSortBy(sort);
    setShowSortMenu(false);
    updateUrlParams({ sortBy: sort });
  };

  // Client-side filtering for status tabs (not sent to API)
  const filteredQuizzes = useMemo(() => {
    if (activeFilter === "all") return quizzes;

    return quizzes.filter((item: Quiz) => {
      if (isInstructor) {
        switch (activeFilter) {
          case "active":
            return item.status === "published";
          case "closed":
            return item.status === "closed";
          default:
            return true;
        }
      } else {
        const studentItem = item as StudentQuiz;
        const attempt = studentItem.attempt;
        const isOverdue = new Date() > new Date(item.deadline);

        switch (activeFilter) {
          case "pending":
            return attempt?.status === "pending" && !isOverdue;
          case "completed":
            return attempt?.status === "completed";
          case "missed":
            return (
              attempt?.status === "missed" ||
              (attempt?.status === "pending" && isOverdue)
            );
          default:
            return true;
        }
      }
    });
  }, [quizzes, activeFilter, isInstructor]);

  // Navigation handlers
  const handleViewDetails = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      console.log("Delete quiz:", id);
      // TODO: Call delete mutation
    }
  };

  const handleStartQuiz = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/attempt`);
  };

  const handleCreateQuiz = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  // Sort options
  const sortOptions = [
    { title: "Deadline", action: () => handleSortChange("deadline") },
    { title: "Title", action: () => handleSortChange("title") },
    ...(isInstructor
      ? []
      : [{ title: "Status", action: () => handleSortChange("status") }]),
  ];

  const getSortLabel = () => {
    switch (sortBy) {
      case "deadline":
        return "Deadline";
      case "title":
        return "Title";
      case "status":
        return "Status";
      default:
        return "Sort";
    }
  };

  const isEmpty = filteredQuizzes.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;
  const hasActiveFilter = activeFilter !== "all";

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header with Search and Controls */}
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
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 min-w-[140px] justify-center"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {getSortLabel()}
                </span>
              </Button>

              {showSortMenu && (
                <div className="absolute right-0 top-full z-10">
                  <DropdownMenu
                    options={sortOptions}
                    onClose={() => setShowSortMenu(false)}
                    align="right"
                  />
                </div>
              )}
            </div>
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

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            {hasSearchTerm ? (
              <NoSearchResults
                searchTerm={searchTerm}
                onClearSearch={() => handleSearch("")}
              />
            ) : hasActiveFilter ? (
              <EmptyFilterResults
                filterType={activeFilter}
                onClearFilter={() => handleFilterChange("all")}
              />
            ) : (
              <EmptyQuizzes
                isInstructor={isInstructor}
                onCreateFirst={isInstructor ? handleCreateQuiz : undefined}
              />
            )}
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 space-y-4">
            {filteredQuizzes.map((quiz: Quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStartQuiz={handleStartQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

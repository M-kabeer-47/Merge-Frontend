"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fetchQuizzesClient } from "@/utils/quiz-api";
import type {
  Quiz,
  QuizSortOption,
  QuizFilterType,
  StudentQuiz,
} from "@/types/quiz";

interface QuizListClientProps {
  roomId: string;
  isInstructor: boolean;
  initialSearch?: string;
  initialSort?: QuizSortOption;
  initialFilter?: QuizFilterType;
}
export default function QuizListClient({
  roomId,
  isInstructor,
  initialSearch = "",
  initialSort = "deadline",
  initialFilter = "all",
}: QuizListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [activeFilter, setActiveFilter] =
    useState<QuizFilterType>(initialFilter);
  const [sortBy, setSortBy] = useState<QuizSortOption>(initialSort);
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch quizzes - SAME queryKey as server prefetch for hydration to work
  const {
    data: quizzes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "quizzes",
      roomId,
      { sortBy, sortOrder, search: debouncedSearch },
    ],
    queryFn: () =>
      fetchQuizzesClient({
        roomId,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      }),
  });

  // Update URL params for shareable links
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

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filter: string) => {
      setActiveFilter(filter as QuizFilterType);
      updateUrlParams({ filter });
    },
    [updateUrlParams]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sort: QuizSortOption) => {
      setSortBy(sort);
      setShowSortMenu(false);
      updateUrlParams({ sortBy: sort });
    },
    [updateUrlParams]
  );

  // Client-side filtering for status (not sent to API)
  const filteredQuizzes = React.useMemo(() => {
    if (activeFilter === "all") return quizzes;

    return quizzes.filter((item) => {
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

  // Handlers
  const handleViewDetails = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      console.log("Delete quiz:", id);
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
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading quizzes..." />
          </div>
        ) : isError ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-para-muted">
              <p>Failed to load quizzes</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
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
            {filteredQuizzes.map((quiz) => (
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

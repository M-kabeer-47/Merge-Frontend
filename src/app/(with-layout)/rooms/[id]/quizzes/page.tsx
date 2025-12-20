"use client";

import React, { useState, useMemo } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import QuizCard from "@/components/quizzes/QuizCard";
import {
  EmptyQuizzes,
  NoSearchResults,
  EmptyFilterResults,
} from "@/components/quizzes/EmptyStates";
import {
  sampleInstructorQuizzes,
  sampleStudentQuizzes,
} from "@/lib/constants/quiz-mock-data";
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
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function QuizzesPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<QuizFilterType>("all");
  const [sortBy, setSortBy] = useState<QuizSortOption>("deadline");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userRole = user?.role;
  const isInstructor = searchParams.get("role") === "instructor";

  // Load appropriate data based on role
  const quizzes: Quiz[] = isInstructor
    ? sampleInstructorQuizzes
    : sampleStudentQuizzes;

  // Filter and sort quizzes
  const filteredAndSortedQuizzes = useMemo(() => {
    let items = [...quizzes];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      items = items.filter((item) => item.title.toLowerCase().includes(search));
    }

    // Apply status filter
    if (activeFilter !== "all") {
      items = items.filter((item) => {
        if (isInstructor) {
          // Instructor filters
          switch (activeFilter) {
            case "active":
              return item.status === "published";
            case "closed":
              return item.status === "closed";
            default:
              return true;
          }
        } else {
          // Student filters
          const studentItem = item as StudentQuiz;
          const attempt = studentItem.attempt;
          const isOverdue = new Date() > new Date(item.deadline);

          switch (activeFilter) {
            case "pending":
              return attempt.status === "pending" && !isOverdue;
            case "completed":
              return attempt.status === "completed";
            case "missed":
              return (
                attempt.status === "missed" ||
                (attempt.status === "pending" && isOverdue)
              );
            default:
              return true;
          }
        }
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          if (!isInstructor) {
            const statusOrder = { pending: 0, completed: 1, missed: 2 };
            const statusA = (a as StudentQuiz).attempt.status;
            const statusB = (b as StudentQuiz).attempt.status;
            return statusOrder[statusA] - statusOrder[statusB];
          }
          return 0;
        default:
          return 0;
      }
    });

    return items;
  }, [quizzes, searchTerm, activeFilter, sortBy, isInstructor]);

  // Handlers
  const handleViewDetails = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("Edit quiz:", id);
    // TODO: Implement edit quiz functionality
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      console.log("Delete quiz:", id);
      // TODO: Implement delete quiz functionality
    }
  };

  const handleStartQuiz = (id: string) => {
    router.push(`/rooms/${roomId}/quizzes/${id}/attempt`);
  };

  const handleCreateQuiz = () => {
    router.push(`/rooms/${roomId}/quizzes/create`);
  };

  // Sort options for dropdown
  const sortOptions = [
    {
      title: "Deadline",
      action: () => {
        setSortBy("deadline");
        setShowSortMenu(false);
      },
    },
    {
      title: "Title",
      action: () => {
        setSortBy("title");
        setShowSortMenu(false);
      },
    },
    ...(isInstructor
      ? []
      : [
          {
            title: "Status",
            action: () => {
              setSortBy("status");
              setShowSortMenu(false);
            },
          },
        ]),
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

  const isEmpty = filteredAndSortedQuizzes.length === 0;
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
              onSearch={setSearchTerm}
              placeholder="Search quizzes..."
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

        {/* Filter Tabs (For Students) */}
        {!isInstructor && (
          <div className="max-w-[500px]">
            <Tabs
              options={[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
                { key: "missed", label: "Missed" },
              ]}
              activeKey={activeFilter}
              onChange={(key) => setActiveFilter(key as QuizFilterType)}
            />
          </div>
        )}

        {/* Filter Tabs (For Instructors) */}
        {isInstructor && (
          <div className="max-w-[400px]">
            <Tabs
              options={[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "closed", label: "Closed" },
              ]}
              activeKey={activeFilter}
              onChange={(key) => setActiveFilter(key as QuizFilterType)}
            />
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            {hasSearchTerm ? (
              <NoSearchResults
                searchTerm={searchTerm}
                onClearSearch={() => setSearchTerm("")}
              />
            ) : hasActiveFilter ? (
              <EmptyFilterResults
                filterType={activeFilter}
                onClearFilter={() => setActiveFilter("all")}
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
            {filteredAndSortedQuizzes.map((quiz) => (
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

"use client";

import React, { useState, useMemo } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import AssignmentCard from "@/components/assignments/AssignmentCard";
import {
  EmptyAssignments,
  NoSearchResults,
  EmptyFilterResults,
} from "@/components/assignments/EmptyStates";
import {
  sampleInstructorAssignments,
  sampleStudentAssignments,
} from "@/lib/constants/assignment-mock-data";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import DropdownMenu from "@/components/ui/Dropdown";
import type {
  Assignment,
  AssignmentSortOption,
  AssignmentFilterType,
  StudentAssignment,
} from "@/types/assignment";
import CreateAssignmentModal from "@/components/assignments/CreateAssignmentModal";
import { useAuth } from "@/providers/AuthProvider";
export default function AssignmentsTab() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<AssignmentFilterType>("all");
  const [sortBy, setSortBy] = useState<AssignmentSortOption>("dueDate");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] =
    useState(false);
  const { user } = useAuth();
  const userRole = user?.role;
  const isInstructor = userRole === "instructor";
  // Load appropriate data based on role
  const assignments: Assignment[] = isInstructor
    ? sampleInstructorAssignments
    : sampleStudentAssignments;

  // Filter and sort assignments
  const filteredAndSortedAssignments = useMemo(() => {
    let items = [...assignments];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
      );
    }

    // Apply status filter (for students)
    if (!isInstructor && activeFilter !== "all") {
      items = items.filter((item) => {
        const studentItem = item as StudentAssignment;
        const submission = studentItem.submission;
        const isOverdue = new Date() > new Date(item.dueDate);

        switch (activeFilter) {
          case "completed":
            return (
              submission.status === "submitted" ||
              submission.status === "graded"
            );
          case "pending":
            // Pending means not submitted and not overdue
            return submission.status === "pending" && !isOverdue;
          case "graded":
            return submission.status === "graded";
          case "overdue":
            // Overdue means either marked as overdue OR pending but past due date
            return (
              submission.status === "overdue" ||
              (submission.status === "pending" && isOverdue)
            );
          default:
            return true;
        }
      });
    }

    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "points":
          return b.points - a.points;
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          if (!isInstructor) {
            const statusOrder = {
              overdue: 0,
              pending: 1,
              submitted: 2,
              graded: 3,
            };
            const statusA = (a as StudentAssignment).submission.status;
            const statusB = (b as StudentAssignment).submission.status;
            return statusOrder[statusA] - statusOrder[statusB];
          }
          return 0;
        default:
          return 0;
      }
    });

    return items;
  }, [assignments, searchTerm, activeFilter, sortBy, isInstructor]);

  // Handlers
  const handleViewDetails = (id: string) => {
    window.location.href = `/rooms/${
      window.location.pathname.split("/")[2]
    }/assignments/${id}`;
  };

  const handleViewResponses = (id: string) => {
    window.location.href = `/rooms/${
      window.location.pathname.split("/")[2]
    }/assignments/${id}`;
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

  const handleCreateAssignment = () => {
    setIsCreateAssignmentModalOpen(true);
  };

  // Sort options for dropdown
  const sortOptions = [
    {
      title: "Due Date",
      action: () => {
        setSortBy("dueDate");
        setShowSortMenu(false);
      },
    },
    {
      title: "Points",
      action: () => {
        setSortBy("points");
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
      case "dueDate":
        return "Due Date";
      case "points":
        return "Points";
      case "title":
        return "Title";
      case "status":
        return "Status";
      default:
        return "Sort";
    }
  };

  const isEmpty = filteredAndSortedAssignments.length === 0;
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
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search assignments..."
              className=""
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2  min-w-[140px] justify-center"
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
                onClick={handleCreateAssignment}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Assignment</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs (For Students) */}
        {!isInstructor && (
          <div className="max-w-[700px]">
            <Tabs
              options={[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
                { key: "graded", label: "Graded" },
                { key: "overdue", label: "Overdue" },
              ]}
              activeKey={activeFilter}
              onChange={(key) => setActiveFilter(key as AssignmentFilterType)}
            />
          </div>
        )}

        {/* Filter Tabs (For Instructors) */}
        {isInstructor && (
          <div className="max-w-[800px]">
            <Tabs
              options={[
                { key: "all", label: "All" },
                { key: "needs-grading", label: "Needs grading" },
                { key: "graded", label: "Graded" },
              ]}
              activeKey={activeFilter}
              onChange={(key) => setActiveFilter(key as AssignmentFilterType)}
            />
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto ">
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
              <EmptyAssignments
                isInstructor={isInstructor}
                onCreateFirst={
                  isInstructor ? handleCreateAssignment : undefined
                }
              />
            )}
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 space-y-4 ">
            {filteredAndSortedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={handleViewDetails}
                onViewResponses={handleViewResponses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      {/* Create Assignment Modal */}
      {isCreateAssignmentModalOpen && (
        <CreateAssignmentModal
          isOpen={isCreateAssignmentModalOpen}
          onClose={() => setIsCreateAssignmentModalOpen(false)}
          onSubmit={handleCreateAssignment}
          roomId={"roomId"}
        />
      )}
    </div>
  );
}

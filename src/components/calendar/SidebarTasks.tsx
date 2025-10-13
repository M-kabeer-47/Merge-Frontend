"use client";

import { useState } from "react";
import { CalendarTask, TaskCategory } from "@/app/(with-layout)/calendar/page";
import { format } from "date-fns";
import TaskList from "./TaskList";
import EmptyState from "./EmptyState";
import CategoryChips from "./CategoryChips";
import { List } from "lucide-react";

interface SidebarTasksProps {
  selectedDate: Date | null;
  selectedDateTasks: CalendarTask[];
  upcomingTasks: CalendarTask[];
  activeFilters: TaskCategory[];
  onFilterToggle: (category: TaskCategory) => void;
  onTaskClick: (task: CalendarTask) => void;
  onMarkDone: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function SidebarTasks({
  selectedDate,
  selectedDateTasks,
  upcomingTasks,
  activeFilters,
  onFilterToggle,
  onTaskClick,
  onMarkDone,
  onEdit,
  onDelete,
}: SidebarTasksProps) {
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const showingSelectedDate = selectedDate !== null && !showAllUpcoming;

  // Determine which tasks to display
  const displayTasks = showingSelectedDate ? selectedDateTasks : upcomingTasks;
  const taskCount = displayTasks.length;

  return (
    <div className="bg-background border border-light-border rounded-xl shadow-sm h-fit  top-6">
      <div className="p-5">
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-heading mb-1">
              {showingSelectedDate
                ? `Tasks for ${format(selectedDate, "MMM d")}`
                : "Upcoming Tasks"}
            </h2>
            <p className="text-sm text-para-muted">
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </p>
          </div>

          {/* Show All Upcoming Button */}
          {selectedDate && (
            <button
              onClick={() => setShowAllUpcoming(!showAllUpcoming)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${
                  showAllUpcoming
                    ? "bg-primary text-white"
                    : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                }
              `}
              title={showAllUpcoming ? "Show selected date" : "Show all upcoming"}
            >
              <List className="w-3.5 h-3.5" />
              {showAllUpcoming ? "Selected Date" : "All Upcoming"}
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-4 pb-4 border-b border-light-border">
          <CategoryChips
            activeFilters={activeFilters}
            onToggle={onFilterToggle}
          />
        </div>

        {/* Task List */}
        <div className="max-h-[815px] overflow-y-auto scrollbar-hide">
          {displayTasks.length > 0 ? (
            <TaskList
              tasks={displayTasks}
              onTaskClick={onTaskClick}
              onMarkDone={onMarkDone}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <EmptyState
              title="No tasks found"
              description={
                showingSelectedDate
                  ? "No tasks scheduled for this date"
                  : "No upcoming tasks"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
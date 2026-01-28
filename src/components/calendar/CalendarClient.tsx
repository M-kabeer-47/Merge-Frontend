"use client";

import { useState } from "react";
import {
  isSameDay,
  format,
  isToday,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import TodayTasksBar from "@/components/calendar/TodayTasksBar";
import CalendarWrapper from "@/components/calendar/CalendarWrapper";
import SidebarTasks from "@/components/calendar/SidebarTasks";
import AddTaskModal from "@/components/calendar/AddTaskModal";
import TaskDetailsModal from "@/components/calendar/TaskDetailsModal";
import useCalendarTasks from "@/hooks/calendar/use-calendar-tasks";
import { CalendarTask, TaskCategory, TaskStatus } from "@/types/calendar";

import useDeleteTask from "@/hooks/calendar/use-delete-task";

export default function CalendarClient() {
  const { tasks } = useCalendarTasks();
  const { deleteTask } = useDeleteTask();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<CalendarTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);
  const [activeFilters, setActiveFilters] = useState<TaskCategory[]>([]);

  // ═══════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.date);
      return isSameDay(taskDate, date);
    });
  };

  const getTodayTasks = () => {
    return tasks.filter((task) => {
      const taskDate = parseISO(task.date);
      return isToday(taskDate);
    });
  };

  const getUpcomingTasks = () => {
    const today = startOfDay(new Date());
    return tasks
      .filter((task) => {
        const taskDate = parseISO(task.date);
        return !isBefore(taskDate, today);
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 10); // Show next 10 upcoming tasks
  };

  const getFilteredTasks = (taskList: CalendarTask[]) => {
    if (activeFilters.length === 0) return taskList;
    return taskList.filter((task) => activeFilters.includes(task.category));
  };

  // ═══════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task);
  };

  const handleMarkDone = (taskId: string) => {
    console.log("markTaskDone", { taskId });
    // TODO: Implement optimistic update or mutation
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskToEdit(task);
      setIsModalOpen(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    }
  };

  const handleFilterToggle = (category: TaskCategory) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      return newFilters;
    });
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  const todayTasks = getFilteredTasks(getTodayTasks());
  const upcomingTasks = getFilteredTasks(getUpcomingTasks());
  const selectedDateTasks = selectedDate
    ? getFilteredTasks(getTasksForDate(selectedDate))
    : [];

  return (
    <div className="min-h-screen bg-main-background">
      <div className="sm:px-6 px-4 sm:py-6 py-4">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-raleway font-bold text-heading mb-2">
            Calendar
          </h1>
          <p className="text-para-muted">
            Manage your assignments, quizzes, sessions, and personal tasks
          </p>
        </div>

        {/* Today's Tasks Bar */}
        <TodayTasksBar
          tasks={todayTasks}
          onAddTask={handleOpenAddModal}
          onTaskClick={handleTaskClick}
        />

        {/* Main Content: Calendar + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Calendar (70%) */}
          <div className="flex-1 lg:w-[70%]">
            <CalendarWrapper
              tasks={getFilteredTasks(tasks)}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Right Column: Sidebar (30%) */}
          <div className="lg:w-[30%]">
            <SidebarTasks
              selectedDate={selectedDate}
              selectedDateTasks={selectedDateTasks}
              upcomingTasks={upcomingTasks}
              activeFilters={activeFilters}
              onFilterToggle={handleFilterToggle}
              onTaskClick={handleTaskClick}
              onMarkDone={handleMarkDone}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onMarkDone={handleMarkDone}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

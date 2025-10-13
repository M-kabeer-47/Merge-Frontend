"use client";

import { useState } from "react";
import { isSameDay, format, parseISO, isToday, isBefore, startOfDay } from "date-fns";
import TodayTasksBar from "@/components/calendar/TodayTasksBar";
import CalendarWrapper from "@/components/calendar/CalendarWrapper";
import SidebarTasks from "@/components/calendar/SidebarTasks";
import AddTaskModal from "@/components/calendar/AddTaskModal";
import TaskDetailsModal from "@/components/calendar/TaskDetailsModal";

// ═══════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════

export type TaskCategory = "assignment" | "quiz" | "video-session" | "personal";
export type TaskStatus = "pending" | "completed" | "overdue";

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  date: string; // ISO date YYYY-MM-DD
  time?: string; // HH:mm format
  roomId?: string;
  roomName?: string;
  status?: TaskStatus;
}

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════

const mockTasks: CalendarTask[] = [
  {
    id: "t1",
    title: "React Components Assignment",
    description: "Build reusable components for the dashboard",
    category: "assignment",
    date: "2025-10-14",
    time: "23:59",
    roomId: "r1",
    roomName: "Web Development",
    status: "pending",
  },
  {
    id: "t2",
    title: "Machine Learning Quiz 1",
    description: "Covers linear regression and decision trees",
    category: "quiz",
    date: "2025-10-15",
    time: "10:00",
    roomId: "r2",
    roomName: "ML Fundamentals",
    status: "pending",
  },
  {
    id: "t3",
    title: "Group Study Session",
    description: "Discuss project requirements and planning",
    category: "video-session",
    date: "2025-10-14",
    time: "19:00",
    roomId: "r3",
    roomName: "Project Team Alpha",
    status: "pending",
  },
  {
    id: "t4",
    title: "Morning Pomodoro Session",
    description: "Focus time for personal study",
    category: "personal",
    date: "2025-10-14",
    time: "07:30",
    status: "pending",
  },
  {
    id: "t5",
    title: "Database Design Assignment",
    description: "Create ER diagrams for the e-commerce system",
    category: "assignment",
    date: "2025-10-16",
    time: "18:00",
    roomId: "r4",
    roomName: "Database Systems",
    status: "pending",
  },
  {
    id: "t6",
    title: "UI/UX Workshop",
    description: "Learn about design principles and prototyping",
    category: "video-session",
    date: "2025-10-17",
    time: "14:00",
    roomId: "r5",
    roomName: "Design Thinking",
    status: "pending",
  },
  {
    id: "t7",
    title: "Algorithms Quiz 2",
    description: "Sorting and searching algorithms",
    category: "quiz",
    date: "2025-10-18",
    time: "11:00",
    roomId: "r6",
    roomName: "Data Structures",
    status: "pending",
  },
  {
    id: "t8",
    title: "Evening Reading",
    description: "Read chapters 5-7 of Clean Code",
    category: "personal",
    date: "2025-10-16",
    time: "20:00",
    status: "pending",
  },
  {
    id: "t9",
    title: "Project Presentation",
    description: "Present final project to class",
    category: "video-session",
    date: "2025-10-20",
    time: "15:00",
    roomId: "r7",
    roomName: "Software Engineering",
    status: "pending",
  },
  {
    id: "t10",
    title: "TypeScript Deep Dive",
    description: "Advanced types and generics",
    category: "assignment",
    date: "2025-10-19",
    time: "23:59",
    roomId: "r1",
    roomName: "Web Development",
    status: "pending",
  },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN CALENDAR PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function CalendarPage() {
  const [tasks, setTasks] = useState<CalendarTask[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
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
    console.log("dateSelected", { date: format(date, "yyyy-MM-dd") });
  };

  const handleAddTask = (task: Omit<CalendarTask, "id">) => {
    const newTask: CalendarTask = {
      ...task,
      id: `t${Date.now()}`,
      status: "pending",
    };
    
    console.log("addTask", newTask);
    setTasks([...tasks, newTask]);
    setIsAddTaskOpen(false);
  };

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task);
    console.log("openTask", task);
  };

  const handleMarkDone = (taskId: string) => {
    console.log("markTaskDone", { taskId });
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, status: "completed" as TaskStatus } : t
      )
    );
  };

  const handleEditTask = (taskId: string) => {
    console.log("editTask", { taskId });
    // TODO: Implement edit modal
  };

  const handleDeleteTask = (taskId: string) => {
    console.log("deleteTask", { taskId });
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleFilterToggle = (category: TaskCategory) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      
      console.log("filterToggle", { category, activeFilters: newFilters });
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
          onAddTask={() => setIsAddTaskOpen(true)}
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
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
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
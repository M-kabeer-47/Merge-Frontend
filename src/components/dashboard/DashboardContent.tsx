"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PendingAssignments from "@/components/dashboard/PendingAssignments";
import Announcements from "@/components/dashboard/Announcements";
import MyRooms from "@/components/dashboard/MyRooms";
import TasksToday from "@/components/dashboard/TasksToday";
import StreakCounter from "@/components/dashboard/StreakCounter";
import RewardsWidget from "@/components/dashboard/RewardsWidget";
import { isSameDay, format } from "date-fns";
import { setAuthTokens } from "@/utils/auth-tokens";
import useCalendarTasks from "@/hooks/calendar/use-calendar-tasks";
import { CalendarTask } from "@/types/calendar";
import { Task } from "@/components/dashboard/TaskItem";
import TaskCalendar from "./TaskCalendar";

/** Maps a backend CalendarTask to the dashboard Task shape */
function calendarTaskToDashboardTask(t: CalendarTask): Task {
  const d = new Date(t.deadline);
  const typeMap: Record<string, Task["type"]> = {
    assignment: "assignment",
    quiz: "assignment",
    "video-session": "session",
    personal: "personal",
  };
  return {
    id: t.id,
    title: t.title,
    type: typeMap[t.taskCategory] ?? "personal",
    date: d,
    time: format(d, "HH:mm"),
    description: t.description,
    completed: t.taskStatus === "completed",
  };
}

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const { tasks: calendarTasks } = useCalendarTasks();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const accessToken = searchParams?.get("token");
    const refreshToken = searchParams?.get("refreshToken");
    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);
    }
  }, [searchParams]);

  // Convert real calendar tasks to the dashboard Task shape
  const allTasks = useMemo<Task[]>(
    () => calendarTasks.map(calendarTaskToDashboardTask),
    [calendarTasks],
  );

  // Tasks for the currently selected date (defaults to today)
  const selectedTasks = useMemo<Task[]>(() => {
    if (!selectedDate) return [];
    return allTasks.filter((t) => isSameDay(t.date, selectedDate));
  }, [allTasks, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="sm:px-6 px-4 sm:py-6 py-4 transition-all duration-300 ease-in-out">
      <div className="flex gap-6 items-start">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6 transition-all duration-300 ease-in-out">
          {/* Hero Section */}
          <div>
            <SummaryCards />
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Assignments & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingAssignments />
            <Announcements />
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* My Rooms */}
          <MyRooms />
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-80 hidden lg:block top-6">
          <div className="space-y-4">
            <TaskCalendar tasks={calendarTasks} onDateSelect={handleDateSelect} />
            <TasksToday selectedDate={selectedDate} tasks={selectedTasks} />
            <StreakCounter />
            <RewardsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

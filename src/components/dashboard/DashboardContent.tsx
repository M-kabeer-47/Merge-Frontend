"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PendingAssignments from "@/components/dashboard/PendingAssignments";
import Announcements from "@/components/dashboard/Announcements";
import MyRooms from "@/components/dashboard/MyRooms";
import FocusAnalytics from "@/components/dashboard/FocusAnalytics";
import TasksToday from "@/components/dashboard/TasksToday";
import StreakCounter from "@/components/dashboard/StreakCounter";
import RewardsWidget from "@/components/dashboard/RewardsWidget";
import TaskCalendar, {
  Task,
  sampleTasks,
} from "@/components/dashboard/TaskCalendar";
import { isSameDay } from "date-fns";

export default function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const accessToken = searchParams?.get("token");
    const refreshToken = searchParams?.get("refreshToken");
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [searchParams]);

  // Initialize with today's tasks
  useEffect(() => {
    const today = new Date();
    const todayTasks = sampleTasks.filter((task) =>
      isSameDay(task.date, today)
    );
    setSelectedDate(today);
    setSelectedTasks(todayTasks);
  }, []);

  const handleDateSelect = (date: Date, tasks: Task[]) => {
    setSelectedDate(date);
    setSelectedTasks(tasks);
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
            {/* Pending Assignments */}
            <PendingAssignments />

            {/* Announcements */}
            <Announcements />
          </div>

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* My Rooms */}
          <MyRooms />

          {/* Divider */}
          <div className="border-t border-light-border" />

          {/* Focus Analytics */}
          {/* <FocusAnalytics /> */}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-80 hidden lg:block top-6">
          <div className="space-y-4">
            {/* Calendar */}
            <TaskCalendar onDateSelect={handleDateSelect} />

            {/* Tasks Today */}
            <TasksToday selectedDate={selectedDate} tasks={selectedTasks} />

            {/* Streak Counter */}
            <StreakCounter />

            {/* Rewards Widget */}
            <RewardsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

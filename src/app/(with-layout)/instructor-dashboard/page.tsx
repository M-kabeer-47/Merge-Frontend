"use client";

import { useState } from "react";
import InstructorSummaryCards from "@/components/dashboard/instructor/InstructorSummaryCards";
import InstructorAssignments from "@/components/dashboard/instructor/InstructorAssignments";
import RecentActivity from "@/components/dashboard/instructor/RecentActivity";
import TaskCalendar, {
  sampleTasks,
} from "@/components/dashboard/TaskCalendar";
import InstructorTasks from "@/components/dashboard/instructor/InstructorTasks";
import MyRooms from "@/components/dashboard/MyRooms";

export default function InstructorDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 9, 12)); // Oct 12, 2025

  return (
    <div className="min-h-screen bg-main-background">
      <div className="sm:px-6 px-4 sm:py-6 py-4 transition-all duration-300 ease-in-out">
        <div className="flex gap-6 items-start">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6 transition-all duration-300 ease-in-out">
            {/* Hero Section */}
            <div>
              <InstructorSummaryCards />
            </div>

            {/* Divider */}
            <div className="border-t border-light-border" />

            {/* Assignments & Recent Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstructorAssignments />
              <RecentActivity />
            </div>

            {/* Divider */}
            <div className="border-t border-light-border" />

            {/* My Rooms */}
            <MyRooms />
          </div>

          {/* Right Sidebar Widgets */}
          <div className="w-80 hidden lg:block sticky top-6">
            <div className="space-y-4">
              {/* Calendar */}
              <TaskCalendar onDateSelect={(date) => setSelectedDate(date)} />

              {/* Tasks */}
              <InstructorTasks selectedDate={selectedDate} tasks={sampleTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

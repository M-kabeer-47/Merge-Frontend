"use client";

import { useState, useMemo } from "react";
import { isSameDay, format } from "date-fns";
import InstructorSummaryCards from "@/components/dashboard/instructor/InstructorSummaryCards";
import InstructorAssignments from "@/components/dashboard/instructor/InstructorAssignments";
import RecentActivity from "@/components/dashboard/instructor/RecentActivity";
import InstructorTasks, { InstructorTask } from "@/components/dashboard/instructor/InstructorTasks";
import MyRooms from "@/components/dashboard/MyRooms";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import useCalendarTasks from "@/hooks/calendar/use-calendar-tasks";
import { CalendarTask } from "@/types/calendar";

function calendarTaskToInstructorTask(t: CalendarTask): InstructorTask {
  const d = new Date(t.deadline);
  return {
    id: t.id,
    title: t.title,
    date: d,
    time: format(d, "HH:mm"),
    completed: t.taskStatus === "completed",
  };
}

export default function InstructorDashboard() {
  const { tasks: calendarTasks } = useCalendarTasks();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const allTasks = useMemo<InstructorTask[]>(
    () => calendarTasks.map(calendarTaskToInstructorTask),
    [calendarTasks],
  );

  const selectedTasks = useMemo<InstructorTask[]>(() => {
    if (!selectedDate) return [];
    return allTasks.filter((t) => isSameDay(t.date, selectedDate));
  }, [allTasks, selectedDate]);

  return (
    <div className="min-h-screen bg-main-background">
      <div className="sm:px-6 px-4 sm:py-6 py-4 transition-all duration-300 ease-in-out">
        <div className="flex gap-6 items-start">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div>
              <InstructorSummaryCards />
            </div>

            <div className="border-t border-light-border" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstructorAssignments />
              <RecentActivity />
            </div>

            <div className="border-t border-light-border" />

            <MyRooms />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 hidden lg:block top-6">
            <div className="space-y-4">
              <TaskCalendar tasks={calendarTasks} onDateSelect={setSelectedDate} />
              <InstructorTasks selectedDate={selectedDate} tasks={selectedTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

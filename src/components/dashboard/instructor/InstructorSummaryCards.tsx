"use client";

import {
  Users,
  ClipboardList,
  Video,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import WelcomeSection from "../WelcomeSection";
import SummaryCard from "../SummaryCard";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import useCalendarTasks from "@/hooks/calendar/use-calendar-tasks";
import useInstructorActiveAssignments from "@/hooks/assignments/use-instructor-active-assignments";
import { isAfter } from "date-fns";

interface SummaryCardData {
  id: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  metric: string;
  label: string;
  additionalInfo?: string;
  additionalInfoColor?: string;
}

export default function InstructorSummaryCards() {
  const { rooms: createdRooms } = useGetUserRooms({ filter: "created" });
  const { tasks } = useCalendarTasks();
  const { assignments: activeAssignments } = useInstructorActiveAssignments(50);

  const now = new Date();
  const totalStudents = createdRooms.reduce(
    (sum, r) => sum + (r.memberCount ?? 0),
    0,
  );
  const upcomingSessions = tasks.filter(
    (t) =>
      t.taskCategory === "video-session" &&
      t.taskStatus !== "completed" &&
      isAfter(new Date(t.deadline), now),
  ).length;
  const ungradedCount = activeAssignments.reduce(
    (sum, a) => sum + a.ungradedAttempts,
    0,
  );

  const summaryData: SummaryCardData[] = [
    {
      id: "students",
      icon: Users,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(totalStudents),
      label: "Total Students",
      additionalInfo: createdRooms.length
        ? `Across ${createdRooms.length} room${createdRooms.length > 1 ? "s" : ""}`
        : "Create a room to start",
      additionalInfoColor: "text-para-muted",
    },
    {
      id: "assignments",
      icon: ClipboardList,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(activeAssignments.length),
      label: "Active Assignments",
      additionalInfo: ungradedCount
        ? `${ungradedCount} need${ungradedCount > 1 ? "" : "s"} grading`
        : "All caught up",
      additionalInfoColor: ungradedCount ? "text-accent" : "text-para-muted",
    },
    {
      id: "sessions",
      icon: Video,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(upcomingSessions),
      label: "Upcoming Sessions",
      additionalInfo: upcomingSessions ? "Scheduled ahead" : "No sessions queued",
      additionalInfoColor: "text-para-muted",
    },
    {
      id: "tasks",
      icon: Calendar,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(tasks.filter((t) => t.taskStatus !== "completed").length),
      label: "Scheduled Tasks",
      additionalInfo: "On your calendar",
      additionalInfoColor: "text-para-muted",
    },
  ];

  return (
    <>
      <WelcomeSection userRole="instructor" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((card) => (
          <SummaryCard
            key={card.id}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconColor={card.iconColor}
            metric={card.metric}
            label={card.label}
            additionalInfo={card.additionalInfo}
            additionalInfoColor={card.additionalInfoColor}
          />
        ))}
      </div>
    </>
  );
}

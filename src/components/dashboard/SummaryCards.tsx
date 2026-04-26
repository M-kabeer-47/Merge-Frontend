"use client";

import {
  House,
  ClipboardList,
  Calendar,
  Flame,
  type LucideIcon,
} from "lucide-react";
import WelcomeSection from "./WelcomeSection";
import SummaryCard from "./SummaryCard";
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import useCalendarTasks from "@/hooks/calendar/use-calendar-tasks";
import useRewardsProfile from "@/hooks/rewards/use-rewards-profile";
import { isToday, isAfter } from "date-fns";

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

export default function SummaryCards() {
  const { rooms } = useGetUserRooms({ filter: "all" });
  const { tasks } = useCalendarTasks();
  const { profile } = useRewardsProfile();

  const now = new Date();
  const pendingTasks = tasks.filter(
    (t) => t.taskStatus === "pending" && isAfter(new Date(t.deadline), now),
  );
  const dueTodayTasks = tasks.filter(
    (t) => t.taskStatus === "pending" && isToday(new Date(t.deadline)),
  );
  const pendingAssignments = pendingTasks.filter(
    (t) => t.taskCategory === "assignment",
  );
  const dueThisWeekAssignments = pendingAssignments.filter((t) => {
    const days = Math.ceil(
      (new Date(t.deadline).getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
    );
    return days <= 7;
  });

  const summaryData: SummaryCardData[] = [
    {
      id: "rooms",
      icon: House,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(rooms?.length ?? 0),
      label: "Rooms",
      additionalInfo: rooms?.length
        ? "Active learning groups"
        : "Join your first room",
      additionalInfoColor: "text-para-muted",
    },
    {
      id: "assignments",
      icon: ClipboardList,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(pendingAssignments.length),
      label: "Pending Assignments",
      additionalInfo: dueThisWeekAssignments.length
        ? `${dueThisWeekAssignments.length} due this week`
        : "Nothing urgent",
      additionalInfoColor: "text-para-muted",
    },
    {
      id: "tasks",
      icon: Calendar,
      iconBgColor: "bg-secondary/10",
      iconColor: "text-primary",
      metric: String(pendingTasks.length),
      label: "Scheduled Tasks",
      additionalInfo: dueTodayTasks.length
        ? `${dueTodayTasks.length} for today`
        : "None for today",
      additionalInfoColor: "text-para-muted",
    },
    {
      id: "streak",
      icon: Flame,
      iconBgColor: "bg-accent/10",
      iconColor: "text-accent",
      metric: String(profile?.streak.currentStreak ?? 0),
      label: "Day Streak",
      additionalInfo: profile?.streak.longestStreak
        ? `Best: ${profile.streak.longestStreak} days`
        : "Start your streak today!",
      additionalInfoColor: "text-para-muted",
    },
  ];

  return (
    <>
      <WelcomeSection />

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

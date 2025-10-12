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

interface SummaryCardData {
  id: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  metric: string;
  label: string;
}

const summaryData: SummaryCardData[] = [
  {
    id: "students",
    icon: Users,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "156",
    label: "Total Students",
  },
  {
    id: "assignments",
    icon: ClipboardList,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "8",
    label: "Active Assignments",
  },
  {
    id: "sessions",
    icon: Video,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "5",
    label: "Upcoming Sessions",
  },
  {
    id: "tasks",
    icon: Calendar,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "12",
    label: "Scheduled Tasks",
  },
];

export default function InstructorSummaryCards() {
  return (
    <>
      <WelcomeSection userName="Professor" userRole="instructor" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((card) => (
          <SummaryCard
            key={card.id}
            icon={card.icon}
            iconBgColor={card.iconBgColor}
            iconColor={card.iconColor}
            metric={card.metric}
            label={card.label}
          />
        ))}
      </div>
    </>
  );
}

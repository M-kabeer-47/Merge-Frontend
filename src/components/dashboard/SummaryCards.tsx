"use client";

import {
  House,
  ClipboardList,
  Calendar,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import WelcomeSection from "./WelcomeSection";
import SummaryCard from "./SummaryCard";

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

const summaryData: SummaryCardData[] = [
  {
    id: "rooms",
    icon: House,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "12",
    label: "Rooms Joined",
    additionalInfo: "Active learning groups",
    additionalInfoColor: "text-para-muted",
  },
  {
    id: "assignments",
    icon: ClipboardList,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "5",
    label: "Assignments Pending",
    additionalInfo: "2 due this week",
    additionalInfoColor: "text-para-muted",
  },
  {
    id: "tasks",
    icon: Calendar,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "8",
    label: "Scheduled Tasks",
    additionalInfo: "3 for today",
    additionalInfoColor: "text-para-muted",
  },
  {
    id: "focus",
    icon: TrendingUp,
    iconBgColor: "bg-secondary/10",
    iconColor: "text-primary",
    metric: "87%",
    label: "Focus Score",
    additionalInfo: "↑ +5% from last week",
    additionalInfoColor: "text-success",
  },
];

export default function SummaryCards() {
  return (
    <>
      <WelcomeSection userName="Sarah" userRole="student" />

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

"use client";

import Icon from "@/components/ui/Icon";
import { CalendarDays } from "lucide-react";

interface HorizontalStatsProps {
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
  totalScore: number;
  dueDate: Date;
  isClosed: boolean;
}

/**
 * Horizontal stats row for instructor assignment view.
 * Displays submission stats and due date in a single row.
 */
export default function HorizontalStats({
  totalAttempts,
  gradedAttempts,
  ungradedAttempts,
  totalScore,
  dueDate,
  isClosed,
}: HorizontalStatsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isPastDue = new Date() > new Date(dueDate);

  const stats = [
    {
      icon: "/icons/submissions.png",
      label: "Submissions",
      value: totalAttempts,
    },
    {
      icon: "/icons/graded.png",
      label: "Graded",
      value: gradedAttempts,
    },
    {
      icon: "/icons/pending.png",
      label: "To Grade",
      value: ungradedAttempts,
    },
    {
      icon: "/icons/score.png",
      label: "Total Pts",
      value: totalScore,
    },
  ];

  return (
    <div className="bg-background border border-light-border rounded-xl p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Stats - Left side */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-[100%]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-4 py-2.5 bg-secondary/5 rounded-lg border border-light-border/50 h-[80px]"
            >
              <div className="w-8 h-8 flex-shrink-0">
                <Icon src={stat.icon} width={32} height={32} alt={stat.label} />
              </div>
              <div>
                <p className="text-xl font-bold text-heading leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-para-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Due Date & Status - Right side */}
      </div>
    </div>
  );
}

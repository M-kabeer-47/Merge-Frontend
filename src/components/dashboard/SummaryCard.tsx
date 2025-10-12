"use client";

import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface SummaryCardProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  metric: string;
  label: string;
  additionalInfo?: string;
  additionalInfoColor?: string;
}

export default function SummaryCard({
  icon: Icon,
  iconBgColor = "bg-secondary/10",
  iconColor = "text-primary",
  metric,
  label,
  additionalInfo,
  additionalInfoColor = "text-para-muted",
}: SummaryCardProps) {
  return (
    <div
      className="bg-background border border-light-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${metric}. ${additionalInfo}`}
    >
      {/* Top Row: Icon and Trend Indicator */}
      <div className="flex justify-between items-start">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}
          aria-hidden="true"
        >
          <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
        </div>
        <ArrowUpRight
          className="w-4 h-4 text-para-muted"
          aria-hidden="true"
        />
      </div>
      <div className="mt-2">
        <p className="text-lg font-medium text-heading">{label}</p>
      </div>
      {/* Metric Section */}
      <div className="mt-1">
        <p className="text-4xl font-bold text-heading">{metric}</p>
      </div>
    </div>
  );
}

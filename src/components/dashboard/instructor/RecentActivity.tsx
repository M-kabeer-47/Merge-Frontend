"use client";

import { Activity, MessageSquare, FileCheck, HelpCircle, UserPlus } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "submission" | "question" | "message" | "enrollment";
  studentName: string;
  action: string;
  details: string;
  time: string;
  roomName: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "submission",
      studentName: "Sarah Johnson",
      action: "Submitted Assignment",
      details: "React Component Library",
      time: "10m ago",
      roomName: "Advanced React Development",
    },
    {
      id: "2",
      type: "question",
      studentName: "Michael Chen",
      action: "Asked a Question",
      details: "How to implement useContext with TypeScript?",
      time: "25m ago",
      roomName: "Web Development Fundamentals",
    },
    {
      id: "3",
      type: "enrollment",
      studentName: "Emma Davis",
      action: "Enrolled in Course",
      details: "Just joined your class",
      time: "1h ago",
      roomName: "UI/UX Design Principles",
    },
    {
      id: "4",
      type: "message",
      studentName: "James Wilson",
      action: "Posted in Discussion",
      details: "Question about database normalization techniques",
      time: "2h ago",
      roomName: "Database Systems",
    },
  ];

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "submission":
        return FileCheck;
      case "question":
        return HelpCircle;
      case "message":
        return MessageSquare;
      case "enrollment":
        return UserPlus;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "submission":
        return "text-primary";
      case "question":
        return "text-secondary";
      case "message":
        return "text-primary";
      case "enrollment":
        return "text-primary";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Recent Activity
          </h2>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {activities.map((activity) => {
          // Extract first letter of first and last name for avatar
          const nameParts = activity.studentName.split(" ");
          const initials =
            nameParts.length >= 2
              ? `${nameParts[0][0]}${nameParts[1][0]}`
              : activity.studentName.substring(0, 2);

          const Icon = getActivityIcon(activity.type);
          const iconColor = getActivityColor(activity.type);

          return (
            <div
              key={activity.id}
              className="bg-background rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-light-border"
            >
              {/* Header with Room Name and Time */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-heading truncate">
                  {activity.roomName}
                </h3>
                <span className="text-xs text-para-muted flex-shrink-0 ml-2">
                  {activity.time}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">
                    {initials}
                  </span>
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  {/* Student Name and Action */}
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-heading text-sm">
                      {activity.studentName}
                    </p>
                    <div className={`flex items-center gap-1 ${iconColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Action Type */}
                  <p className="text-xs text-para-muted mb-1">
                    {activity.action}
                  </p>

                  {/* Details */}
                  <p className="text-sm text-para font-semibold line-clamp-2">
                    {activity.details}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

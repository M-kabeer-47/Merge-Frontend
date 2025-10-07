"use client";
import React, { useEffect } from "react";
import { motion } from "motion/react";
import {
  IconUsers,
  IconNotes,
  IconPalette,
  IconVideo,
  IconClock,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

const statsData = [
  {
    title: "Active Rooms",
    value: "5",
    change: "+2",
    changeType: "increase",
    icon: IconUsers,
    color: "primary",
  },
  {
    title: "Total Notes",
    value: "47",
    change: "+12",
    changeType: "increase",
    icon: IconNotes,
    color: "secondary",
  },
  {
    title: "Canvases Created",
    value: "12",
    change: "+3",
    changeType: "increase",
    icon: IconPalette,
    color: "accent",
  },
  {
    title: "Study Hours",
    value: "24h",
    change: "+4h",
    changeType: "increase",
    icon: IconClock,
    color: "primary",
  },
];

const recentActivities = [
  {
    title: 'Joined "Advanced React Patterns"',
    time: "2 hours ago",
    icon: IconUsers,
    color: "primary",
  },
  {
    title: 'Created canvas "System Design"',
    time: "4 hours ago",
    icon: IconPalette,
    color: "accent",
  },
  {
    title: "Completed live session",
    time: "1 day ago",
    icon: IconVideo,
    color: "secondary",
  },
  {
    title: 'Added notes to "Database Design"',
    time: "2 days ago",
    icon: IconNotes,
    color: "secondary",
  },
];

const upcomingSessions = [
  {
    title: "React Advanced Concepts",
    time: "Today, 3:00 PM",
    participants: 12,
    type: "Live Session",
  },
  {
    title: "System Design Workshop",
    time: "Tomorrow, 10:00 AM",
    participants: 8,
    type: "Workshop",
  },
  {
    title: "Code Review Session",
    time: "Friday, 2:00 PM",
    participants: 6,
    type: "Review",
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary/20",
      };
    case "accent":
      return {
        bg: "bg-accent/10",
        text: "text-accent",
        border: "border-accent/20",
      };
    case "secondary":
      return {
        bg: "bg-secondary/10",
        text: "text-secondary",
        border: "border-secondary/20",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-light-border",
      };
  }
};

export default function DashboardPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, []);
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-raleway font-bold text-heading">
            Dashboard
          </h1>
          <p className="text-para-muted mt-2">
            Welcome back! Here's what's happening with your learning journey.
          </p>
        </div>
        <motion.button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Learning
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${colorClasses.text}`} />
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-heading mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-para-muted">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-background rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold text-heading mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const colorClasses = getColorClasses(activity.color);
              const Icon = activity.icon;

              return (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 ${colorClasses.bg} rounded-full flex items-center justify-center`}
                  >
                    <Icon className={`h-5 w-5 ${colorClasses.text}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-heading">{activity.title}</p>
                    <p className="text-sm text-para-muted">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold text-heading mb-6">
            Upcoming Sessions
          </h2>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-heading text-sm">
                    {session.title}
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {session.type}
                  </span>
                </div>
                <p className="text-sm text-para-muted mb-2">{session.time}</p>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-para-muted" />
                  <span className="text-sm text-para-muted">
                    {session.participants} participants
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="w-full mt-4 bg-primary/5 text-primary py-2 px-4 rounded-lg font-medium hover:bg-primary/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Sessions
          </motion.button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-background rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-heading mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Create Room",
              icon: IconUsers,
              color: "primary",
              href: "/with-layout/rooms/create",
            },
            {
              title: "New Canvas",
              icon: IconPalette,
              color: "accent",
              href: "/with-layout/canvas/create",
            },
            {
              title: "Take Notes",
              icon: IconNotes,
              color: "secondary",
              href: "/with-layout/notes",
            },
            {
              title: "Join Session",
              icon: IconVideo,
              color: "primary",
              href: "/with-layout/live-session",
            },
          ].map((action, index) => {
            const colorClasses = getColorClasses(action.color);
            const Icon = action.icon;

            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100 hover:border-light-border"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${colorClasses.text}`} />
                </div>
                <span className="font-medium text-heading">{action.title}</span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

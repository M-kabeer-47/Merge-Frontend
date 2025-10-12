"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import DashboardAnnouncementCard from "@/components/dashboard/DashboardAnnouncementCard";
import type { Announcement } from "@/types/announcement";

export default function Announcements() {
  const [announcements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Office Hours Update",
      content:
        "Office hours have been moved to Tuesday and Thursday from 2-4 PM. Please update your calendars accordingly.",
      author: {
        id: "instructor-1",
        name: "Dr. Sarah Johnson",
        role: "instructor",
        initials: "SJ",
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "published",
      isPinned: false,
    },
    {
      id: "2",
      title: "Study Group Tonight",
      content:
        "Join us for a study group session tonight at 7 PM in the library. We'll be reviewing the latest React concepts and working on practice problems together.",
      author: {
        id: "student-1",
        name: "Alex Chen",
        role: "student",
        initials: "AC",
      },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      status: "published",
      isPinned: true,
    },
    {
      id: "3",
      title: "Exam Date Announced",
      content:
        "The midterm exam is scheduled for October 25th. It will cover chapters 1-5. Review sessions will be held next week.",
      author: {
        id: "instructor-2",
        name: "Prof. Michael Chen",
        role: "instructor",
        initials: "MC",
      },
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      status: "published",
      isPinned: true,
      attachments: [
        {
          id: "att-1",
          name: "exam-topics.pdf",
          type: "file",
          url: "#",
          size: 524288,
        },
      ],
    },
  ]);

  const roomMapping: Record<string, string> = {
    "1": "Advanced React",
    "2": "Machine Learning",
    "3": "Machine Learning",
  };

  const handleAnnouncementClick = (id: string) => {
    // TODO: Navigate to announcement details or open modal
    console.log("View announcement:", id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Recent Announcements
          </h2>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {announcements.map((announcement) => (
          <DashboardAnnouncementCard
            key={announcement.id}
            announcement={announcement}
            roomName={roomMapping[announcement.id] || "Unknown Room"}
            onClick={() => handleAnnouncementClick(announcement.id)}
          />
        ))}
      </div>
    </div>
  );
}

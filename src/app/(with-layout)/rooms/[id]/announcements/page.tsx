"use client";

import React, { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import AnnouncementComposer from "@/components/announcements/AnnouncementComposer";
import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import { EmptyAnnouncements } from "@/components/announcements/EmptyStates";
import { sampleAnnouncements } from "@/lib/constants/announcement-mock-data";
import Tabs from "@/components/ui/Tabs";
import type {
  Announcement,
  AnnouncementSortOption,
  AnnouncementStatus,
} from "@/types/announcement";
import { Button } from "@/components/ui/Button";

export default function AnnouncementsTab() {
  // State
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(sampleAnnouncements);
  const [sortBy, setSortBy] = useState<AnnouncementSortOption>("newest");
  const [showComposer, setShowComposer] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "published" | "scheduled"
  >("all");

  // TODO: Replace with actual role check from auth/context
  const userRole = "instructor"; // Can be "instructor", "teaching-assistant", "student"
  const canPostAnnouncements =
    userRole === "instructor" || userRole === "teaching-assistant";

  // Sort and filter announcements
  const sortedAnnouncements = useMemo(() => {
    let items = [...announcements];

    // Apply filter
    if (activeFilter === "published") {
      items = items.filter((ann) => ann.status === "published");
    } else if (activeFilter === "scheduled") {
      items = items.filter((ann) => ann.status === "scheduled");
    }

    items.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return items;
  }, [announcements, sortBy, activeFilter]);

  // Handlers
  const handlePost = (data: {
    title: string;
    content: string;
    scheduledFor?: Date;
    attachments: File[];
  }) => {
    console.log("Posting announcement:", data);
    // TODO: Implement actual post logic with API call
    setShowComposer(false);
  };

  const handlePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    }
  };

  const isEmpty = sortedAnnouncements.length === 0;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header with Toggle Button */}
      <div className="px-4 sm:px-6 py-4 border-b border-light-border">
        <div className="flex items-center justify-between mb-4 ">
          {canPostAnnouncements && (
            <>
              <div className="py-3 w-[700px]">
                <Tabs
                  options={[
                    { key: "all", label: "All" },
                    { key: "published", label: "Posted" },
                    { key: "scheduled", label: "Scheduled" },
                  ]}
                  activeKey={activeFilter}
                  onChange={(key) =>
                    setActiveFilter(key as "all" | "published" | "scheduled")
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowComposer(!showComposer)}
                  className="w-full"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">New Announcement</span>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Announcement Composer (Toggleable) */}
        {showComposer && canPostAnnouncements && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-heading font-semibold">
                Create Announcement
              </h3>
              <button
                onClick={() => setShowComposer(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AnnouncementComposer onPost={handlePost} />
          </div>
        )}
      </div>

      {/* Filter Tabs (Only for authorized users) */}

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <EmptyAnnouncements onCreateFirst={() => setShowComposer(true)} />
          </div>
        ) : (
          <div className="px-4 sm:px-6 py-4 space-y-4">
            {sortedAnnouncements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                isRecent={index === 0}
                onPin={canPostAnnouncements ? handlePin : undefined}
                onDelete={canPostAnnouncements ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

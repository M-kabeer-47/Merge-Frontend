"use client";

import React, { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import AnnouncementComposer from "@/components/announcements/AnnouncementComposer";
import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import { EmptyAnnouncements } from "@/components/announcements/EmptyStates";
import Tabs from "@/components/ui/Tabs";
import type {
  Announcement,
  AnnouncementSortOption,
} from "@/types/announcement";
import { Button } from "@/components/ui/Button";
import { useRoom } from "@/providers/RoomProvider";
import useFetchAnnouncements from "@/hooks/announcements/use-fetch-announcements";
import useCreateAnnouncement from "@/hooks/announcements/use-create-announcement";
import AnnouncementCardsSkeleton from "@/components/assignments/AssignmentCardsSkeleton"; // Reuse skeleton or create new one? reusing assignment one for now or generic skeleton

export default function AnnouncementsList({ roomId }: { roomId: string }) {
  // Hooks
  const { userRole } = useRoom();
  const { data: announcements = [], isLoading } = useFetchAnnouncements({
    roomId,
  });
  const { mutate: createAnnouncement, isPending: isCreating } =
    useCreateAnnouncement();

  // State
  const [showComposer, setShowComposer] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "published" | "scheduled"
  >("all");

  // Permissions
  const canPostAnnouncements =
    userRole === "instructor" || userRole === "moderator";

  // Filter & Sort
  const sortedAnnouncements = useMemo(() => {
    let items = [...announcements];

    // Apply status filter
    // Note: API might not return status for students as clearly as 'scheduled',
    // but assuming data structure supports it.
    if (activeFilter === "published") {
      items = items.filter((ann) => ann.status === "published");
    } else if (activeFilter === "scheduled") {
      items = items.filter((ann) => ann.status === "scheduled");
    }

    // Default sort: Newest first
    items.sort((a, b) => {
      // Prioritize pinned
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return items;
  }, [announcements, activeFilter]);

  // Handlers
  const handlePost = (data: {
    title: string;
    content: string;
    scheduledFor?: Date;
    attachments: File[];
  }) => {
    createAnnouncement(
      {
        roomId,
        title: data.title,
        content: data.content,
        scheduledAt: data.scheduledFor?.toISOString(),
        isPublished: !data.scheduledFor,
        // Attachments ignored for now as per API spec limitation mentioned in plan
      },
      {
        onSuccess: () => setShowComposer(false),
      },
    );
  };

  const handlePin = (id: string) => {
    // TODO: Implement pin mutation
    console.log("Pin", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete mutation
    console.log("Delete", id);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const isEmpty = sortedAnnouncements.length === 0;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header with Actions */}
      <div className="px-4 sm:px-6 py-4 border-b border-light-border">
        <div className="flex items-center justify-between mb-4">
          {canPostAnnouncements ? (
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
                  disabled={isCreating}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">New Announcement</span>
                </Button>
              </div>
            </>
          ) : (
            <h2 className="text-lg font-semibold text-heading">
              Announcements
            </h2>
          )}
        </div>

        {/* Composer */}
        {showComposer && canPostAnnouncements && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
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

      {/* List */}
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
                isRecent={
                  index === 0 &&
                  !announcement.isPinned &&
                  activeFilter === "all" &&
                  !announcement.scheduledFor
                } // Highlight recent
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

"use client";

import { MessageSquare } from "lucide-react";
import type { Announcement } from "@/types/announcement";

interface DashboardAnnouncementCardProps {
  announcement: Announcement;
  roomName: string;
  onClick?: () => void;
}

export default function DashboardAnnouncementCard({
  announcement,
  roomName,
  onClick,
}: DashboardAnnouncementCardProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-background rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer h-[200px] flex flex-col"
    >
      {/* Header with Author */}
      <h2 className="text-xl text-heading font-bold mb-2">{roomName}</h2>
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          {announcement.author.avatarUrl ? (
            <img
              src={announcement.author.avatarUrl}
              alt={announcement.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {announcement.author.initials}
            </span>
          )}
        </div>

        {/* Author Info & Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-heading text-sm line-clamp-1 mb-0.5">
            {announcement.title}
          </h3>
          <p className="text-xs text-para-muted">
            {announcement.author.name} • {formatTimeAgo(announcement.createdAt)}
          </p>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-sm text-para line-clamp-2 mb-3 flex-1">
        {announcement.content}
      </p>

      {/* Footer - Room Name & Attachments */}
      <div className="flex items-center justify-end pt-3 border-t border-primary/20">
        {announcement.attachments && announcement.attachments.length > 0 && (
          <span className="text-xs text-para-muted">
            {announcement.attachments.length} attachment
            {announcement.attachments.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

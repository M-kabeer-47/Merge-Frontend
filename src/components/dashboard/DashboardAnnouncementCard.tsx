"use client";

import { MessageSquare } from "lucide-react";
import type { Announcement } from "@/types/announcement";
import { getTimeAgo } from "@/utils/date-helpers";

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
  return (
    <div
      onClick={onClick}
      className="bg-background rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer h-[200px] flex flex-col"
    >
      {/* Header with Author */}
      <h2 className="text-xl text-heading font-bold mb-2">{roomName}</h2>
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {announcement.author.image ? (
            <img
              src={announcement.author.image}
              alt={`${announcement.author.firstName} ${announcement.author.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-semibold text-sm">
              {(announcement.author.firstName?.[0] || "") +
                (announcement.author.lastName?.[0] || "")}
            </span>
          )}
        </div>

        {/* Author Info & Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-heading text-sm line-clamp-1 mb-0.5">
            {announcement.title}
          </h3>
          <p className="text-xs text-para-muted">
            {announcement.author.firstName} {announcement.author.lastName} •{" "}
            {getTimeAgo(
              announcement.createdAt instanceof Date
                ? announcement.createdAt
                : new Date(announcement.createdAt),
            )}
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

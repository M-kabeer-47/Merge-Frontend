import React, { useState } from "react";
import {
  Pin,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  File as FileIcon,
  Download,
} from "lucide-react";
import type { Announcement } from "@/types/announcement";
import { formatFileSize } from "@/utils/file-helpers";

interface AnnouncementCardProps {
  announcement: Announcement;
  isRecent?: boolean;
  bgColor?: string;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AnnouncementCard({
  announcement,
  isRecent = false,
  bgColor,
  onPin,
  onDelete,
}: AnnouncementCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getFileIcon = (fileName: string, type: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (
      type === "image" ||
      ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")
    ) {
      return <FileImage className="w-4 h-4 text-blue-500" />;
    }
    if (["pdf"].includes(ext || "")) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }
    if (["doc", "docx"].includes(ext || "")) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    }
    if (["xls", "xlsx", "csv"].includes(ext || "")) {
      return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
    }
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) {
      return <FileVideo className="w-4 h-4 text-purple-500" />;
    }
    if (["mp3", "wav", "ogg"].includes(ext || "")) {
      return <FileAudio className="w-4 h-4 text-orange-500" />;
    }
    return <FileIcon className="w-4 h-4 text-gray-400" />;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handlePin = () => {
    onPin?.(announcement.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete?.(announcement.id);
    setShowMenu(false);
  };

  const handleDownload = (url: string, fileName: string) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine background color - use prop if provided, otherwise use existing logic
  const cardBgColor = bgColor || (isRecent ? "bg-primary/90" : "bg-main-background");

  return (
    <div
      className={`border-[0.5px] border-light-border rounded-lg p-4 ${cardBgColor}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full  text-white flex items-center justify-center text-sm font-medium ${
              isRecent ? "bg-secondary" : "bg-primary"
            }`}
          >
            {announcement.author.initials}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-semibold ${
                  isRecent ? "text-white" : "text-para"
                }`}
              >
                {announcement.author.name}
              </span>
              <span
                className={`px-2 py-0.5  rounded text-xs font-medium ${
                  isRecent
                    ? "bg-secondary text-white"
                    : " bg-secondary/10 text-secondary"
                }`}
              >
                {announcement.author.role}
              </span>
              {announcement.isPinned && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded text-xs font-medium">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {announcement.status === "scheduled" &&
                announcement.scheduledFor && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                    Scheduled for{" "}
                    {new Date(announcement.scheduledFor).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                )}
            </div>
            <div
              className={` mt-0.5 text-sm ${
                isRecent ? "text-white" : "text-para-muted"
              }`}
            >
              {announcement.publishedAt
                ? getTimeAgo(announcement.publishedAt)
                : "Not published"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            onClick={handlePin}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              announcement.isPinned ? "text-accent" : "text-gray-400"
            }`}
            title={announcement.isPinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <button
                onClick={handlePin}
                className="w-full px-4 py-2 text-left text-para hover:bg-gray-50"
              >
                {announcement.isPinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      {announcement.title && (
        <h3
          className={`mb-2 font-bold text-lg ${
            isRecent ? "text-white" : "text-heading"
          }`}
        >
          {announcement.title}
        </h3>
      )}

      {/* Content */}
      <div className="mb-3">
        <p
          className={` whitespace-pre-wrap text-sm ${
            isRecent ? "text-white/90" : "text-para"
          }`}
        >
          {announcement.content}
        </p>
      </div>

      {announcement.attachments && announcement.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {announcement.attachments.map((attachment, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-2 border-1 rounded-md border-light-border text-para-muted group  transition-colors ${
                isRecent ? "text-white" : "text-para-muted"
              }`}
            >
              {getFileIcon(attachment.name, attachment.type)}
              <span className="text-sm ">{attachment.name}</span>
              {attachment.size && (
                <span className="text-xs ">
                  ({formatFileSize(attachment.size)})
                </span>
              )}
              <button
                onClick={() => handleDownload(attachment.url, attachment.name)}
                className="ml-2 p-1 rounded  transition-colors "
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  File as FileIcon,
  Download,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react";
import type { Announcement } from "@/types/announcement";
import { formatFileSize } from "@/utils/file-helpers";
import Avatar from "@/components/ui/Avatar";
import DropdownMenu, { DropdownOption } from "@/components/ui/Dropdown";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { getTimeAgo } from "@/utils/date-helpers";

interface AnnouncementCardProps {
  announcement: Announcement;
  isRecent?: boolean;
  bgColor?: string;
  onDelete?: (id: string) => void;
}

export default function AnnouncementCard({
  announcement,
  isRecent = false,
  bgColor,
  onDelete,
  onEdit,
}: AnnouncementCardProps & {
  onEdit?: (announcement: Announcement) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setShowMenu(false), showMenu);

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

  const handleDelete = () => {
    onDelete?.(announcement.id);
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

  // Helper for attachment colors
  const getAttachmentStyle = (type: string, ext: string) => {
    if (type === "image" || ["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return "bg-blue-50 text-blue-700 border-blue-100";
    if (["pdf"].includes(ext)) return "bg-red-50 text-red-700 border-red-100";
    if (["doc", "docx"].includes(ext))
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    if (["xls", "xlsx", "csv"].includes(ext))
      return "bg-green-50 text-green-700 border-green-100";
    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  // AssignmentCard-like container styles
  // We keep "isRecent" styles subtle (maybe just the badge) combined with the universal assignment-card look.
  const containerClasses =
    "relative border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden bg-background hover:shadow-xl transition-all duration-300 group";

  // Dropdown options
  const menuOptions: DropdownOption[] = [];
  if (onEdit) {
    menuOptions.push({
      title: "Edit",
      icon: <Edit size={16} />,
      action: () => onEdit(announcement),
    });
  }
  if (onDelete) {
    menuOptions.push({
      title: "Delete",
      icon: <Trash size={16} />,
      action: handleDelete,
      destructive: true,
    });
  }

  return (
    <div className={containerClasses}>
      {/* Decorative gradient accent (same as AssignmentCard) */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent opacity-80" />

      {/* Label for recent card */}
      {isRecent && (
        <div className="absolute top-0 right-0 p-3 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Latest
          </span>
        </div>
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar profileImage={announcement.author.image} size="md" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-raleway text-lg text-heading">
                  {announcement.author.firstName} {announcement.author.lastName}
                </span>
                {announcement.author.role && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-primary/5 text-primary border border-primary/10">
                    {announcement.author.role}
                  </span>
                )}
              </div>

              <div className="text-xs flex items-center gap-2 mt-0.5 text-para-muted">
                <span>
                  {announcement.createdAt
                    ? getTimeAgo(
                        announcement.createdAt instanceof Date
                          ? announcement.createdAt
                          : new Date(announcement.createdAt),
                      )
                    : "Just now"}
                </span>
                {announcement.status === "scheduled" &&
                  announcement.scheduledFor && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                      <span className="text-blue-600 font-medium">
                        Scheduled:{" "}
                        {new Date(
                          announcement.scheduledFor,
                        ).toLocaleDateString()}
                      </span>
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* Actions - Positioned to not overlap with Recent badge if present */}
          {menuOptions.length > 0 && (
            <div
              ref={menuRef}
              className={`relative ${isRecent ? "mt-8" : ""} z-30`}
            >
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-400 hover:text-gray-600 outline-none focus:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <DropdownMenu
                  options={menuOptions}
                  onClose={() => setShowMenu(false)}
                  className="w-40"
                />
              )}
            </div>
          )}
        </div>

        {/* Main Content - No indentation needed as AssignmentCard aligns left usually, but let's keep it clean */}
        <div className="pl-0 sm:pl-[64px]">
          {announcement.title && (
            <h3 className="mb-2 font-bold font-raleway text-xl leading-tight text-heading">
              {announcement.title}
            </h3>
          )}

          <div className="mb-5 whitespace-pre-wrap text-sm leading-relaxed text-para">
            {announcement.content}
          </div>

          {/* Attachments Grid */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {announcement.attachments.map((attachment, index) => {
                const ext =
                  attachment.name.split(".").pop()?.toLowerCase() || "";
                const styleClass = `${getAttachmentStyle(
                  attachment.type,
                  ext,
                )} border`;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/item cursor-pointer ${styleClass} hover:shadow-sm hover:-translate-y-0.5`}
                    onClick={() =>
                      handleDownload(attachment.url, attachment.name)
                    }
                  >
                    <div className="p-2 rounded-lg bg-white">
                      {getFileIcon(attachment.name, attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-heading">
                        {attachment.name}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-para-muted">
                          {formatFileSize(attachment.size)}
                        </p>
                      )}
                    </div>
                    <Download className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

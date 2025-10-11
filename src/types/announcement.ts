// Announcement Types for Announcements Tab

export type AnnouncementStatus = "published" | "scheduled";

export type AnnouncementSortOption = "newest" | "oldest";

export type UserRole = "instructor" | "student" | "moderator" | "ta";

export interface AnnouncementAuthor {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  initials: string;
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  type: "file" | "image";
  url: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: AnnouncementAuthor;
  createdAt: Date;
  scheduledFor?: Date;
  publishedAt?: Date;
  status: AnnouncementStatus;
  isPinned: boolean;
  attachments?: AnnouncementAttachment[];
}

// Announcement Types

export type AnnouncementStatus = "published" | "scheduled" | "draft";

export type AnnouncementSortOption = "newest" | "oldest";

export interface AnnouncementAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export interface AnnouncementAuthor {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string; // Optional if not always available
}

export interface Announcement {
  id: string;
  roomId: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  isPinned: boolean;
  createdAt: string | Date; // API might return string
  publishedAt?: string | Date;
  scheduledFor?: string | Date; // API might return "scheduledAt"
  author: AnnouncementAuthor;
  attachments?: AnnouncementAttachment[];
}

export interface CreateAnnouncementPayload {
  roomId: string;
  title: string;
  content: string;
  isPublished?: boolean;
  scheduledAt?: string; // ISO string
  attachments?: File[]; // For client-side handling before upload
}

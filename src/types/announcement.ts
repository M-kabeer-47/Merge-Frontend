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
  firstName: string;
  lastName: string;
  image?: string;
  email: string;
  role?: string; // Keeping as optional in case it helps UI, otherwise will remove usage
}

export interface Announcement {
  id: string;
  roomId: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
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

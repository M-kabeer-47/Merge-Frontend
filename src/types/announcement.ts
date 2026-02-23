// Announcement Types

import type { Author } from "./common";

export type AnnouncementStatus = "published" | "scheduled" | "draft";

export type AnnouncementSortOption = "newest" | "oldest";

export interface AnnouncementAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export type AnnouncementAuthor = Author;

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

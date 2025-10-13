// Type definitions for Discover page

export interface RoomCreator {
  id: string;
  name: string;
  avatar: string;
}

export interface RoomFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc" | "video" | "other";
  size: string;
}

export interface RoomAssignment {
  id: string;
  title: string;
  dueDate: string;
}

export interface RoomMember {
  id: string;
  name: string;
  avatar: string;
}

export interface PublicRoom {
  id: string;
  title: string;
  creator: RoomCreator;
  description: string;
  tags: string[];
  membersCount: number;
  activeNow: boolean;
  thumbnail: string;
  files: RoomFile[];
  assignments: RoomAssignment[];
  membersPreview: RoomMember[];
  lastActiveAt: string;
  rating?: {
    average: number; // 0-5 stars
    count: number; // number of ratings
  };
}

export type SortOption = "newest" | "most-active" | "most-members";

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  sortBy: SortOption;
}

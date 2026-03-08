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

// Types matching the backend /room/feed response
export interface FeedRoom {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  autoJoin: boolean;
  roomCode: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
  tags: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  tagMatches: number;
  isRecommended: boolean;
  joinedByUser: boolean;
}

export interface FeedResponse {
  rooms: FeedRoom[];
  total: number;
  totalPages: number;
  currentPage: number;
  userTags: string[];
  hasPersonalizedFeed: boolean;
  search: string | null;
}

import { User } from "@/types/user";

export interface RoomDetails {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  autoJoin: boolean;
  roomCode: string;
  tags: Array<{ id: string; name: string }>;
  admin: User;
  members: Array<User>;
  moderators?: Array<User>;
  createdAt: string;
  updatedAt: string;
  userRole: string;
  memberCount: number;
}

/**
 * Mock data for Room Settings feature
 * 
 * Provides sample room configuration data for development and testing.
 * Replace with actual API calls in production.
 */

import type {
  RoomSettings,
  Moderator,
  RoomMember,
  ModeratorPermissions,
} from "@/types/room-settings";

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Create default moderator permissions (all enabled)
 */
export const defaultModeratorPermissions = (): ModeratorPermissions => ({
  canPostAnnouncements: true,
  canManageMembers: true,
  canPostAssignments: true,
  canGradeAssignments: true,
  canStartSessions: true,
  canManageFiles: true,
});

/**
 * Create restricted moderator permissions (basic features only)
 */
export const restrictedModeratorPermissions = (): ModeratorPermissions => ({
  canPostAnnouncements: true,
  canManageMembers: false,
  canPostAssignments: false,
  canGradeAssignments: false,
  canStartSessions: true,
  canManageFiles: false,
});

// ═══════════════════════════════════════════════════════════════════
// SAMPLE MODERATORS
// ═══════════════════════════════════════════════════════════════════

export const sampleModerators: Moderator[] = [
  {
    id: "mod-1",
    name: "Ali Hassan",
    email: "ali.hassan@example.com",
    avatar: undefined,
    permissions: {
      canPostAnnouncements: true,
      canManageMembers: true,
      canPostAssignments: false,
      canGradeAssignments: false,
      canStartSessions: true,
      canManageFiles: true,
    },
    assignedAt: new Date("2024-09-15"),
  },
  {
    id: "mod-2",
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    avatar: undefined,
    permissions: {
      canPostAnnouncements: true,
      canManageMembers: false,
      canPostAssignments: true,
      canGradeAssignments: true,
      canStartSessions: false,
      canManageFiles: true,
    },
    assignedAt: new Date("2024-10-01"),
  },
];

// ═══════════════════════════════════════════════════════════════════
// SAMPLE MEMBERS
// ═══════════════════════════════════════════════════════════════════

export const sampleMembers: RoomMember[] = [
  {
    id: "member-1",
    name: "Fatima Khan",
    email: "fatima.khan@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-10"),
    isMuted: false,
  },
  {
    id: "member-2",
    name: "Ahmed Malik",
    email: "ahmed.malik@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-12"),
    isMuted: false,
  },
  {
    id: "member-3",
    name: "Zainab Ali",
    email: "zainab.ali@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-15"),
    isMuted: true,
    mutedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  },
  {
    id: "member-4",
    name: "Usman Sheikh",
    email: "usman.sheikh@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-18"),
    isMuted: false,
  },
  {
    id: "member-5",
    name: "Mariam Siddiqui",
    email: "mariam.siddiqui@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-20"),
    isMuted: false,
  },
  {
    id: "member-6",
    name: "Hassan Raza",
    email: "hassan.raza@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-22"),
    isMuted: false,
  },
  {
    id: "member-7",
    name: "Ayesha Mahmood",
    email: "ayesha.mahmood@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-25"),
    isMuted: false,
  },
  {
    id: "member-8",
    name: "Bilal Tariq",
    email: "bilal.tariq@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-09-28"),
    isMuted: false,
  },
  {
    id: "member-9",
    name: "Hina Khalid",
    email: "hina.khalid@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-10-01"),
    isMuted: false,
  },
  {
    id: "member-10",
    name: "Kamran Iqbal",
    email: "kamran.iqbal@example.com",
    avatar: undefined,
    role: "member",
    joinedAt: new Date("2024-10-05"),
    isMuted: false,
  },
];

// ═══════════════════════════════════════════════════════════════════
// COMPLETE MOCK ROOM
// ═══════════════════════════════════════════════════════════════════

export const mockRoomSettings: RoomSettings = {
  id: "room-123",
  title: "Advanced Web Development",
  description:
    "A comprehensive room focused on modern frontend architectures, React ecosystem, and full-stack development practices. Learn cutting-edge techniques and build production-ready applications.",
  tags: ["Web Development", "React", "TypeScript", "Full Stack"],
  visibility: "private",
  joinPolicy: "request",
  ownerId: "instructor-001",
  ownerName: "Dr. Sarah Johnson",
  moderators: sampleModerators,
  members: sampleMembers,
  chatPermissions: {
    level: "everyone",
    selectedMemberIds: [],
  },
  lastSaved: new Date("2024-10-13T10:30:00"),
  createdAt: new Date("2024-09-01"),
};

// ═══════════════════════════════════════════════════════════════════
// ADDITIONAL MOCK DATA FOR SEARCH/AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════════════

/**
 * Sample users for searching when adding moderators or transferring ownership
 */
export const searchableUsers = [
  ...sampleMembers,
  {
    id: "user-extra-1",
    name: "Omar Farooq",
    email: "omar.farooq@example.com",
    avatar: undefined,
    role: "member" as const,
    joinedAt: new Date("2024-10-08"),
  },
  {
    id: "user-extra-2",
    name: "Sana Baig",
    email: "sana.baig@example.com",
    avatar: undefined,
    role: "member" as const,
    joinedAt: new Date("2024-10-10"),
  },
];

/**
 * Common mute duration options (in minutes)
 */
export const muteDurations = [
  { label: "10 minutes", value: 10 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "6 hours", value: 360 },
  { label: "24 hours", value: 1440 },
  { label: "1 week", value: 10080 },
];

/**
 * Popular tag suggestions for rooms
 */
export const popularTags = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "React",
  "Python",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Database",
  "API Development",
];

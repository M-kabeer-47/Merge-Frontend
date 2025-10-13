/**
 * Type definitions for Room Settings feature
 * 
 * Comprehensive interfaces for room configuration, moderator management,
 * member permissions, and chat controls.
 */

// ═══════════════════════════════════════════════════════════════════
// CORE ROOM TYPES
// ═══════════════════════════════════════════════════════════════════

export type RoomVisibility = "private" | "public";
export type JoinPolicy = "auto" | "request";
export type ChatPermissionLevel = "instructors-only" | "selected-members" | "everyone";
export type MemberRole = "instructor" | "moderator" | "member";

/**
 * Granular permissions that can be assigned to moderators
 */
export interface ModeratorPermissions {
  canPostAnnouncements: boolean;
  canManageMembers: boolean;
  canPostAssignments: boolean;
  canGradeAssignments: boolean;
  canStartSessions: boolean;
  canManageFiles: boolean;
}

/**
 * Moderator with full profile and permission details
 */
export interface Moderator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permissions: ModeratorPermissions;
  assignedAt?: Date;
}

/**
 * Room member with basic profile information
 */
export interface RoomMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  joinedAt: Date;
  isMuted?: boolean;
  mutedUntil?: Date;
}

/**
 * Complete room configuration object
 */
export interface RoomSettings {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visibility: RoomVisibility;
  joinPolicy: JoinPolicy;
  ownerId: string;
  ownerName: string;
  moderators: Moderator[];
  members: RoomMember[];
  chatPermissions: {
    level: ChatPermissionLevel;
    selectedMemberIds?: string[];
  };
  lastSaved?: Date;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════════
// ACTION TYPES
// ═══════════════════════════════════════════════════════════════════

/**
 * Payload for updating general room information
 */
export interface UpdateGeneralSettingsPayload {
  title: string;
  description: string;
  tags?: string[];
}

/**
 * Payload for visibility change confirmation
 */
export interface VisibilityChangePayload {
  newVisibility: RoomVisibility;
  currentVisibility: RoomVisibility;
}

/**
 * Payload for adding/updating moderator
 */
export interface ModeratorActionPayload {
  userId: string;
  permissions: ModeratorPermissions;
}

/**
 * Payload for muting a member
 */
export interface MuteMemberPayload {
  memberId: string;
  duration: number; // in minutes
  reason?: string;
}

/**
 * Payload for transferring ownership
 */
export interface TransferOwnershipPayload {
  newOwnerId: string;
  confirmationText: string;
}

/**
 * Payload for deleting/archiving room
 */
export interface DeleteRoomPayload {
  roomName: string;
  permanentDelete: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION & ERROR TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ValidationError {
  field: string;
  message: string;
}

export interface SettingsFormState {
  hasUnsavedChanges: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
}

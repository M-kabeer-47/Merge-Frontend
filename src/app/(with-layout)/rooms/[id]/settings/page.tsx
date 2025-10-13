/**
 * Room Settings Page
 *
 * Comprehensive settings page for room configuration.
 * Only accessible to instructors/owners of the room.
 *
 * Features:
 * - General room information (title, description, tags)
 * - Visibility and join policy controls
 * - Moderator and permission management
 * - Member management (mute, remove, promote)
 * - Chat permissions configuration
 * - Ownership transfer
 * - Archive and delete room
 */

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Settings, ShieldAlert, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Import all setting components
import GeneralSettingsForm from "@/components/rooms/settings/GeneralSettingsForm";
import VisibilitySettings from "@/components/rooms/settings/VisibilitySettings";
import ModeratorManager from "@/components/rooms/settings/ModeratorManager";
import MembersTable from "@/components/rooms/settings/MembersTable";
import ChatPermissions from "@/components/rooms/settings/ChatPermissions";
import TransferOwnership from "@/components/rooms/settings/TransferOwnership";
import DangerZone from "@/components/rooms/settings/DangerZone";

// Import types and mock data
import type {
  RoomSettings,
  UpdateGeneralSettingsPayload,
  RoomVisibility,
  JoinPolicy,
  ChatPermissionLevel,
  ModeratorPermissions,
} from "@/types/room-settings";
import { mockRoomSettings } from "@/lib/constants/room-settings-mock-data";

export default function RoomSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  // TODO: Replace with actual user role check from auth context
  const currentUserRole = "instructor"; // Mock: should come from useAuth() or similar
  const isInstructor = currentUserRole === "instructor";

  // State management
  const [roomSettings, setRoomSettings] =
    useState<RoomSettings>(mockRoomSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] =
    useState(false);

  // Access control: Show 403 if not instructor
  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full bg-main-background border border-light-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-raleway font-bold text-heading mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-para-muted mb-6">
            You do not have permission to access room settings. Only instructors
            and room owners can modify settings.
          </p>
          <Button
            onClick={() => router.push(`/rooms/${roomId}`)}
            variant="outline"
            className="w-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Room
          </Button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  const handleSaveGeneral = (payload: UpdateGeneralSettingsPayload) => {
    setIsSubmitting(true);

    // TODO: Integrate with backend API
    // Example: await updateRoomSettings(roomId, payload);

    // Simulate API call
    setTimeout(() => {
      setRoomSettings({
        ...roomSettings,
        title: payload.title,
        description: payload.description,
        tags: payload.tags || roomSettings.tags,
        lastSaved: new Date(),
      });
      setIsSubmitting(false);

      // TODO: Show success toast
      console.log("General settings saved:", payload);
    }, 500);
  };

  const handleVisibilityChange = (newVisibility: RoomVisibility) => {
    // TODO: Integrate with backend API
    // Example: await updateRoomVisibility(roomId, newVisibility);

    setRoomSettings({
      ...roomSettings,
      visibility: newVisibility,
      lastSaved: new Date(),
    });

    console.log("Visibility changed to:", newVisibility);
    // TODO: Show success toast
  };

  const handleJoinPolicyChange = (newPolicy: JoinPolicy) => {
    // TODO: Integrate with backend API
    // Example: await updateJoinPolicy(roomId, newPolicy);

    setRoomSettings({
      ...roomSettings,
      joinPolicy: newPolicy,
      lastSaved: new Date(),
    });

    console.log("Join policy changed to:", newPolicy);
    // TODO: Show success toast
  };

  const handleAddModerator = (
    userId: string,
    permissions: ModeratorPermissions
  ) => {
    // TODO: Integrate with backend API
    // Example: await addModerator(roomId, userId, permissions);

    console.log("Add moderator:", userId, permissions);
    // TODO: Update state and show success toast
  };

  const handleUpdatePermissions = (
    moderatorId: string,
    permissions: ModeratorPermissions
  ) => {
    // TODO: Integrate with backend API
    // Example: await updateModeratorPermissions(roomId, moderatorId, permissions);
    // TODO: Add audit logging

    setRoomSettings({
      ...roomSettings,
      moderators: roomSettings.moderators.map((mod) =>
        mod.id === moderatorId ? { ...mod, permissions } : mod
      ),
      lastSaved: new Date(),
    });

    console.log("Moderator permissions updated:", moderatorId, permissions);
    // TODO: Show success toast
  };

  const handleRemoveModerator = (moderatorId: string) => {
    // TODO: Integrate with backend API
    // Example: await removeModerator(roomId, moderatorId);
    // TODO: Add audit logging

    setRoomSettings({
      ...roomSettings,
      moderators: roomSettings.moderators.filter(
        (mod) => mod.id !== moderatorId
      ),
      lastSaved: new Date(),
    });

    console.log("Moderator removed:", moderatorId);
    // TODO: Show success toast
  };

  const handleMuteMember = (memberId: string, duration: number) => {
    // TODO: Integrate with backend API
    // Example: await muteMember(roomId, memberId, duration);

    const mutedUntil = new Date(Date.now() + duration * 60 * 1000);

    setRoomSettings({
      ...roomSettings,
      members: roomSettings.members.map((member) =>
        member.id === memberId
          ? { ...member, isMuted: true, mutedUntil }
          : member
      ),
    });

    console.log("Member muted:", memberId, "for", duration, "minutes");
    // TODO: Show success toast
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Integrate with backend API
    // Example: await removeMember(roomId, memberId);

    setRoomSettings({
      ...roomSettings,
      members: roomSettings.members.filter((member) => member.id !== memberId),
    });

    console.log("Member removed:", memberId);
    // TODO: Show success toast
  };

  const handlePromoteToModerator = (
    memberId: string,
    permissions: ModeratorPermissions
  ) => {
    // TODO: Integrate with backend API
    // Example: await promoteToModerator(roomId, memberId, permissions);

    console.log("Promote to moderator:", memberId, permissions);
    // TODO: Update state and show success toast
  };

  const handleUpdateChatPermissions = (
    level: ChatPermissionLevel,
    memberIds?: string[]
  ) => {
    // TODO: Integrate with backend API
    // Example: await updateChatPermissions(roomId, level, memberIds);

    setRoomSettings({
      ...roomSettings,
      chatPermissions: {
        level,
        selectedMemberIds: memberIds || [],
      },
      lastSaved: new Date(),
    });

    console.log("Chat permissions updated:", level, memberIds);
    // TODO: Show success toast
  };

  const handleTransferOwnership = (newOwnerId: string) => {
    // TODO: Integrate with backend API and redirect
    // Example: await transferOwnership(roomId, newOwnerId);
    // Example: router.push(`/rooms/${roomId}`);

    console.log("Ownership transferred to:", newOwnerId);
    // TODO: Show success toast and redirect
  };

  const handleArchiveRoom = () => {
    // TODO: Integrate with backend API and redirect
    // Example: await archiveRoom(roomId);
    // Example: router.push('/dashboard');

    console.log("Room archived");
    // TODO: Show success toast and redirect
  };

  const handleDeleteRoom = () => {
    // TODO: Integrate with backend API and redirect
    // Example: await deleteRoom(roomId);
    // Example: router.push('/dashboard');

    console.log("Room deleted permanently");
    // TODO: Show success toast and redirect
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-main-background">
      {/* Header */}

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-8">
          {/* General Settings */}
          <section aria-labelledby="general-settings-heading">
            <GeneralSettingsForm
              room={roomSettings}
              onSave={handleSaveGeneral}
              isSubmitting={isSubmitting}
            />
          </section>

          {/* Visibility & Join Policy */}
          <section aria-labelledby="visibility-settings-heading">
            <VisibilitySettings
              currentVisibility={roomSettings.visibility}
              currentJoinPolicy={roomSettings.joinPolicy}
              onVisibilityChange={handleVisibilityChange}
              onJoinPolicyChange={handleJoinPolicyChange}
            />
          </section>

          {/* Moderators */}
          <section aria-labelledby="moderator-settings-heading">
            <ModeratorManager
              moderators={roomSettings.moderators}
              onAddModerator={handleAddModerator}
              onUpdatePermissions={handleUpdatePermissions}
              onRemoveModerator={handleRemoveModerator}
            />
          </section>

          {/* Members */}
          <section aria-labelledby="members-settings-heading">
            <MembersTable
              members={roomSettings.members}
              onMuteMember={handleMuteMember}
              onRemoveMember={handleRemoveMember}
              onPromoteToModerator={handlePromoteToModerator}
            />
          </section>

          {/* Chat Permissions */}
          <section aria-labelledby="chat-settings-heading">
            <ChatPermissions
              currentLevel={roomSettings.chatPermissions.level}
              selectedMemberIds={
                roomSettings.chatPermissions.selectedMemberIds || []
              }
              allMembers={roomSettings.members}
              onUpdatePermissions={handleUpdateChatPermissions}
            />
          </section>

          {/* Transfer Ownership */}
          <section aria-labelledby="transfer-settings-heading">
            <TransferOwnership
              currentOwnerId={roomSettings.ownerId}
              currentOwnerName={roomSettings.ownerName}
              members={roomSettings.members}
              onTransferOwnership={handleTransferOwnership}
            />
          </section>

          {/* Danger Zone */}
          <section aria-labelledby="danger-zone-heading">
            <DangerZone
              roomTitle={roomSettings.title}
              roomId={roomSettings.id}
              onArchiveRoom={handleArchiveRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          </section>
        </div>

        {/* Bottom Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}

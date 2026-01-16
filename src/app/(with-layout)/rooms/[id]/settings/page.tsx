"use client";

import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldAlert, ChevronLeft } from "lucide-react";
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
import { useRoom } from "@/providers/RoomProvider";
import RoomSettingsError from "@/components/rooms/settings/RoomSettingsError";
import RoomUpdateTest from "@/components/rooms/settings/RoomUpdateTest";
export default function RoomSettingsPage() {
  const { room, userRole } = useRoom();
  const isAdmin = userRole === "instructor" || userRole === "moderator";

  // State management
  const [roomSettings, setRoomSettings] =
    useState<RoomSettings>(mockRoomSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] =
    useState(false);
  const [isPending, startTransition] = useTransition();
  if (!isAdmin && !isPending) {
    return <RoomSettingsError roomID={room?.id as string} />;
  }

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

  return (
    <div className="min-h-screen bg-main-background">
      {/* Header */}

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-8">
          {/* Test Component - Remove after testing */}
          <RoomUpdateTest />

          {/* General Settings */}
          <section aria-labelledby="general-settings-heading">
            <GeneralSettingsForm
              room={room}
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

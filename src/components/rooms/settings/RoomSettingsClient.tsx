"use client";

// Import all setting components
import GeneralSettingsForm from "@/components/rooms/settings/GeneralSettingsForm";
import VisibilitySettings from "@/components/rooms/settings/VisibilitySettings";
import ModeratorManager from "@/components/rooms/settings/ModeratorManager";
import MembersTable from "@/components/rooms/settings/MembersTable";
import ChatPermissions from "@/components/rooms/settings/ChatPermissions";
import TransferOwnership from "@/components/rooms/settings/TransferOwnership";
import DangerZone from "@/components/rooms/settings/DangerZone";
import RoomSettingsError from "@/components/rooms/settings/RoomSettingsError";

// Import types
import type {
  UpdateGeneralSettingsPayload,
  RoomVisibility,
  JoinPolicy,
  ChatPermissionLevel,
} from "@/types/room-settings";

// Import hooks and providers
import { useRoom } from "@/providers/RoomProvider";
import useUpdateRoom from "@/hooks/rooms/use-update-room";
import useUpdateMemberRole from "@/hooks/rooms/use-update-member-role";
import useRemoveMember from "@/hooks/rooms/use-remove-member";
import useFetchRoomMembers from "@/hooks/rooms/use-fetch-room-members";

interface RoomSettingsClientProps {
  roomId: string;
}

export default function RoomSettingsClient({
  roomId,
}: RoomSettingsClientProps) {
  const { room, userRole } = useRoom();

  // Check if user has admin access
  const isAdmin = userRole === "instructor" || userRole === "moderator";

  // Hooks for mutations
  const { updateRoom, isUpdating: isUpdatingRoom } = useUpdateRoom(roomId);
  const { updateMemberRole, isUpdating: isUpdatingRole } =
    useUpdateMemberRole();
  const { removeMember, isRemoving } = useRemoveMember();

  // Fetch members with React Query (hydrated from server prefetch)
  const { data: members = [] } = useFetchRoomMembers({
    roomId,
    enabled: isAdmin,
  });

  // Wait for room data
  if (!room) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Check admin access
  if (!isAdmin) {
    return <RoomSettingsError roomID={roomId} />;
  }

  // Map room data to UI types
  const currentVisibility: RoomVisibility = room.isPublic
    ? "public"
    : "private";
  const currentJoinPolicy: JoinPolicy = room.autoJoin ? "auto" : "request";

  // Filter members by role - only get regular members from API
  const regularMembers = members.filter((m) => m.role === "member");

  // Get moderators from room.moderators (User[] from RoomProvider)
  const moderators = room.moderators || [];

  // Transform members for components that need different format
  const allMembersForChat = members.map((m) => ({
    id: m.user.id,
    name: `${m.user.firstName} ${m.user.lastName}`,
    avatar: m.user.image || undefined,
  }));

  // Handler functions
  const handleSaveGeneral = async (payload: UpdateGeneralSettingsPayload) => {
    await updateRoom({
      title: payload.title,
      description: payload.description,
      tags: payload.tags,
    });
  };

  const handleVisibilityChange = async (newVisibility: RoomVisibility) => {
    await updateRoom({
      isPublic: newVisibility === "public",
    });
  };

  const handleJoinPolicyChange = async (newPolicy: JoinPolicy) => {
    await updateRoom({
      autoJoin: newPolicy === "auto",
    });
  };

  const handlePromoteToModerator = async (userId: string) => {
    await updateMemberRole({
      roomId,
      memberId: userId,
      role: "moderator",
    });
  };

  const handleDemoteToMember = async (moderatorMemberId: string) => {
    const memberRecord = members.find((m) => m.id === moderatorMemberId);

    if (!memberRecord) {
      console.error(
        "Could not find member record for moderator:",
        moderatorMemberId,
      );
      return;
    }

    await updateMemberRole({
      roomId,
      memberId: memberRecord.id,
      role: "member",
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMember({
      roomId,
      memberId,
    });
  };

  const handleUpdateChatPermissions = (
    level: ChatPermissionLevel,
    memberIds?: string[],
  ) => {
    // TODO: Integrate with backend when API is available
    console.log("Chat permissions updated:", level, memberIds);
  };

  const handleTransferOwnership = (newOwnerId: string) => {
    // TODO: Integrate with backend when API is available
    console.log("Transfer ownership to:", newOwnerId);
  };

  const handleArchiveRoom = () => {
    // TODO: Integrate with backend when API is available
    console.log("Archive room");
  };

  const handleDeleteRoom = () => {
    // TODO: Integrate with backend when API is available
    console.log("Delete room");
  };

  return (
    <div className="space-y-8">
      {/* General Settings */}
      <section aria-labelledby="general-settings-heading">
        <GeneralSettingsForm
          room={room}
          onSave={handleSaveGeneral}
          isSubmitting={isUpdatingRoom}
        />
      </section>

      {/* Visibility & Join Policy */}
      <section aria-labelledby="visibility-settings-heading">
        <VisibilitySettings
          currentVisibility={currentVisibility}
          currentJoinPolicy={currentJoinPolicy}
          onVisibilityChange={handleVisibilityChange}
          onJoinPolicyChange={handleJoinPolicyChange}
        />
      </section>

      {/* Moderators */}
      <section aria-labelledby="moderator-settings-heading">
        <ModeratorManager
          moderators={moderators}
          availableMembers={regularMembers}
          onAddModerator={handlePromoteToModerator}
          onRemoveModerator={handleDemoteToMember}
          isUpdating={isUpdatingRole}
        />
      </section>

      {/* Members */}
      <section aria-labelledby="members-settings-heading">
        <MembersTable
          members={regularMembers}
          onRemoveMember={handleRemoveMember}
          isRemoving={isRemoving}
        />
      </section>

      {/* Chat Permissions */}
      <section aria-labelledby="chat-settings-heading">
        <ChatPermissions
          currentLevel="everyone"
          selectedMemberIds={[]}
          allMembers={allMembersForChat}
          onUpdatePermissions={handleUpdateChatPermissions}
        />
      </section>

      {/* Transfer Ownership */}
      <section aria-labelledby="transfer-settings-heading">
        <TransferOwnership
          currentOwnerId={room.admin?.id || ""}
          currentOwnerName={
            room.admin
              ? `${room.admin.firstName} ${room.admin.lastName}`
              : "Unknown"
          }
          members={allMembersForChat}
          onTransferOwnership={handleTransferOwnership}
        />
      </section>

      {/* Danger Zone */}
      <section aria-labelledby="danger-zone-heading">
        <DangerZone
          roomTitle={room.title}
          roomId={room.id}
          onArchiveRoom={handleArchiveRoom}
          onDeleteRoom={handleDeleteRoom}
        />
      </section>

      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}

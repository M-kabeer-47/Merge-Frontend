"use client";

import { useRoom } from "@/providers/RoomProvider";
// import { useQueryClient } from "@tanstack/react-query";
import useFetchRoomMembers from "@/hooks/rooms/use-fetch-room-members";
import useUpdateRoom from "@/hooks/rooms/use-update-room";
import useRemoveMember from "@/hooks/rooms/use-remove-member";
import useUpdateMemberRole from "@/hooks/rooms/use-update-member-role";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
import { toast } from "sonner";

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
  ModeratorPermissions,
} from "@/types/room-settings";
import { tryIt } from "@/utils/try-it";

export default function RoomSettingsClient() {
  const { room, userRole } = useRoom();
  const isAdmin = userRole === "instructor";
  const { data: members = [] } = useFetchRoomMembers({
    roomId: room?.id || "",
  });

  const { updateRoom, isUpdating: isUpdatingRoom } = useUpdateRoom({
    roomId: room?.id || "",
  });
  const { removeMember, isRemoving: isRemovingMember } = useRemoveMember({
    roomId: room?.id || "",
  });
  const { updateMemberRole, isUpdating: isUpdatingRole } = useUpdateMemberRole({
    roomId: room?.id || "",
  });

  if (!isAdmin) {
    return <RoomSettingsError roomID={room?.id as string} />;
  }

  // Derive moderators from members list
  const moderators = members
    .filter((m) => m.role === "moderator" || m.role === "instructor")
    .map((m) => m.user);

  // Available members for moderation (everyone who is NOT already a moderator/instructor)
  const availableMembers = members.filter((m) => m.role === "member");

  const handleSaveGeneral = async (payload: UpdateGeneralSettingsPayload) => {
    updateRoom({
      title: payload.title,
      description: payload.description,
      tagNames: payload.tags,
    });
  };

  const handleVisibilityChange = async (newVisibility: RoomVisibility) => {
    updateRoom({
      isPublic: newVisibility === "public",
    });
  };

  const handleJoinPolicyChange = async (newPolicy: JoinPolicy) => {
    updateRoom({
      autoJoin: newPolicy === "auto",
    });
  };

  const handleAddModerator = async (userId: string) => {
    const member = members.find((m) => m.id === userId);
    updateMemberRole({
      memberId: member.id,
      role: "moderator",
    });
  };

  const handleRemoveModerator = async (userId: string) => {
    const member = members.find((m) => m.user.id === userId);

    updateMemberRole({
      memberId: member.id,
      role: "member",
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    removeMember({ memberId });
  };

  // Placeholder for chat permissions

  return (
    <div className="min-h-screen bg-main-background">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
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
              currentVisibility={room?.isPublic ? "public" : "private"}
              currentJoinPolicy={room?.autoJoin ? "auto" : "request"}
              onVisibilityChange={handleVisibilityChange}
              onJoinPolicyChange={handleJoinPolicyChange}
            />
          </section>

          {/* Moderators */}
          <section aria-labelledby="moderator-settings-heading">
            <ModeratorManager
              moderators={moderators}
              availableMembers={availableMembers}
              onAddModerator={handleAddModerator}
              onRemoveModerator={handleRemoveModerator}
              isUpdating={isUpdatingRole}
            />
          </section>

          {/* Members */}
          <section aria-labelledby="members-settings-heading">
            <MembersTable
              members={members}
              onRemoveMember={handleRemoveMember}
              isRemoving={isRemovingMember}
              //   onMuteMember={handleMuteMember}
              //   onPromoteToModerator={handlePromoteToModerator}
            />
          </section>

          {/* Chat Permissions */}
          <section aria-labelledby="chat-settings-heading">
            {/* <ChatPermissions
              currentLevel={chatPermissions.level}
              selectedMemberIds={chatPermissions.selectedMemberIds}
              allMembers={members}
              onUpdatePermissions={handleUpdateChatPermissions}
            /> */}
          </section>

          {/* Transfer Ownership */}
          <section aria-labelledby="transfer-settings-heading">
            {/* <TransferOwnership
              currentOwnerId={room.admin?.id}
              currentOwnerName={`${room.admin?.firstName} ${room.admin?.lastName}`}
              members={members}
              onTransferOwnership={handleTransferOwnership}
            /> */}
          </section>

          {/* Danger Zone */}
          <section aria-labelledby="danger-zone-heading">
            {/* <DangerZone
              roomTitle={room.title}
              roomId={room.id}
              onArchiveRoom={handleArchiveRoom}
              onDeleteRoom={handleDeleteRoom}
            /> */}
          </section>
        </div>
        <div className="h-16" />
      </div>
    </div>
  );
}

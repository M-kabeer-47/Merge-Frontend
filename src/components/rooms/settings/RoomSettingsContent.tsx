"use client";

import GeneralSettingsForm from "@/components/rooms/settings/GeneralSettingsForm";
import { useRoom } from "@/providers/RoomProvider";
import RoomSettingsError from "@/components/rooms/settings/RoomSettingsError";
import useUpdateRoom from "@/hooks/rooms/use-update-room";
import useUpdateMemberRole from "@/hooks/rooms/use-update-member-role";
import { GeneralSettingsFormSkeleton } from "./general-settings/GeneralSettingsFormSkeleton";
import VisibilitySettings from "./VisibilitySettings";
import ModeratorsSection from "./ModeratorsSection";
import MembersTable from "./MembersTable";
import type {
  RoomVisibility,
  JoinPolicy,
  RoomMember,
} from "@/types/room-settings";

interface RoomSettingsContentProps {
  members: RoomMember[];
}

export default function RoomSettingsContent({
  members,
}: RoomSettingsContentProps) {
  const { room, userRole } = useRoom();
  const isAdmin = userRole === "instructor";
  const { updateRoom, isUpdating } = useUpdateRoom(room?.id as string);
  const { updateMemberRole, isUpdating: isUpdatingRole } =
    useUpdateMemberRole();

  const handleSaveGeneral = async (payload: {
    title: string;
    description: string;
    tags?: string[];
  }) => {
    await updateRoom(payload);
  };

  // Visibility change handler - maps visibility to isPublic
  const handleVisibilityChange = async (newVisibility: RoomVisibility) => {
    await updateRoom({ isPublic: newVisibility === "public" });
  };

  // Join policy change handler - maps policy to autoJoin
  const handleJoinPolicyChange = async (newPolicy: JoinPolicy) => {
    await updateRoom({ autoJoin: newPolicy === "auto" });
  };

  // Moderator handlers
  const handlePromoteMember = async (memberId: string) => {
    if (!room) return;
    await updateMemberRole({
      roomId: room.id,
      memberId,
      role: "moderator",
    });
  };

  const handleDemoteModerator = async (moderatorId: string) => {
    if (!room) return;
    await updateMemberRole({
      roomId: room.id,
      memberId: moderatorId,
      role: "member",
    });
  };

  // Show skeleton until room data is actually loaded with valid title
  if (!room || !room.title || room.title === "") {
    return (
      <div className="min-h-screen bg-main-background">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-8">
            <GeneralSettingsFormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <RoomSettingsError roomID={room.id} />;
  }

  return (
    <div className="min-h-screen bg-main-background">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-8">
          {/* General Settings */}
          <section aria-labelledby="general-settings-heading">
            <GeneralSettingsForm
              room={room}
              onSave={handleSaveGeneral}
              isSubmitting={isUpdating}
            />
          </section>

          {/* Visibility & Join Policy */}
          <section aria-labelledby="visibility-settings-heading">
            <VisibilitySettings
              currentVisibility={room.isPublic ? "public" : "private"}
              currentJoinPolicy={room.autoJoin ? "auto" : "request"}
              onVisibilityChange={handleVisibilityChange}
              onJoinPolicyChange={handleJoinPolicyChange}
            />
          </section>

          {/* Moderators Management */}
          <section aria-labelledby="moderators-settings-heading">
            <ModeratorsSection
              moderators={members.filter((m) => m.role === "moderator")}
              members={members}
              isUpdating={isUpdatingRole}
              onPromoteMember={handlePromoteMember}
              onDemoteModerator={handleDemoteModerator}
            />
          </section>

          {/* Members Management */}
          <section aria-labelledby="members-settings-heading">
            <MembersTable
              members={members}
              onMuteMember={(memberId, duration) => {
                // TODO: Implement mute API
                console.log("Mute member:", memberId, duration);
              }}
              onRemoveMember={(memberId) => {
                // TODO: Implement remove API
                console.log("Remove member:", memberId);
              }}
              onPromoteToModerator={(memberId, permissions) => {
                // TODO: Implement promote API
                console.log("Promote member:", memberId, permissions);
              }}
            />
          </section>

          {/* TODO: Add other settings sections when backend APIs are ready */}
          {/* - ChatPermissions */}
          {/* - TransferOwnership */}
          {/* - DangerZone */}
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}

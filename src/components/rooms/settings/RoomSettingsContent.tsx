"use client";

import GeneralSettingsForm from "@/components/rooms/settings/GeneralSettingsForm";
import { useRoom } from "@/providers/RoomProvider";
import RoomSettingsError from "@/components/rooms/settings/RoomSettingsError";
import useUpdateRoom from "@/hooks/rooms/use-update-room";
import { GeneralSettingsFormSkeleton } from "./general-settings/GeneralSettingsFormSkeleton";
import VisibilitySettings from "./VisibilitySettings";
import type { RoomVisibility, JoinPolicy } from "@/types/room-settings";

export default function RoomSettingsContent() {
  const { room, userRole } = useRoom();
  const isAdmin = userRole === "instructor" || userRole === "moderator";
  const { updateRoom, isUpdating } = useUpdateRoom(room?.id as string);

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

  // Join policy change handler - empty for now
  const handleJoinPolicyChange = (newPolicy: JoinPolicy) => {
    // TODO: Implement when backend supports join policy
    console.log("Join policy change to:", newPolicy);
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
              currentJoinPolicy="request"
              onVisibilityChange={handleVisibilityChange}
              onJoinPolicyChange={handleJoinPolicyChange}
            />
          </section>

          {/* TODO: Add other settings sections when backend APIs are ready */}
          {/* - ModeratorManager */}
          {/* - MembersTable */}
          {/* - ChatPermissions */}
          {/* - TransferOwnership */}
          {/* - DangerZone */}
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}

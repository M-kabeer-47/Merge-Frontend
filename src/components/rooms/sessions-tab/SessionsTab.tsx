"use client";

import React, { useState } from "react";
import { Video, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRoom } from "@/providers/RoomProvider";
import useFetchSessions from "@/hooks/live-sessions/use-fetch-sessions";
import useCreateSession from "@/hooks/live-sessions/use-create-session";
import useStartSession from "@/hooks/live-sessions/use-start-session";
import useDeleteSession from "@/hooks/live-sessions/use-delete-session";
import useJoinSession from "@/hooks/live-sessions/use-join-session";
import { useLiveSessionSocket } from "@/hooks/live-sessions/use-live-session-socket";
import UpcomingSessionCard from "./UpcomingSessionCard";
import PastSessionCard from "./PastSessionCard";
import { EmptyUpcomingState, EmptyPastState } from "./empty-states";
import { useRouter } from "next/navigation";

// Schedule modal
import ScheduleSessionModal from "./ScheduleSessionModal";

export default function SessionsTab() {
  const { room, userRole } = useRoom();
  const router = useRouter();
  const roomId = room?.id || "";
  const isAdmin = userRole === "instructor";

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Realtime updates
  useLiveSessionSocket({ roomId });

  // Fetch all sessions for this room
  const { data, isLoading } = useFetchSessions({ roomId });

  // Mutations
  const { createSession, isCreating } = useCreateSession();
  const { startSession, isStarting } = useStartSession();
  const { deleteSession, isDeleting } = useDeleteSession();
  const { joinSession, isJoining } = useJoinSession();

  const sessions = data?.sessions || [];

  // Separate sessions by status
  const upcomingSessions = sessions.filter(
    (s) => s.status === "scheduled" || s.status === "live"
  );

  const pastSessions = sessions.filter((s) => s.status === "ended");

  // Handlers
  const handleStartInstantSession = async () => {
    if (!roomId) return;
    const result = await createSession({
      roomId,
      title: `Live Session - ${new Date().toLocaleDateString()}`,
    });
    if (result?.id) {
      router.push(`/rooms/${roomId}/live?sessionId=${result.id}`);
    }
  };

  const handleStartScheduledSession = async (sessionId: string) => {
    await startSession({ sessionId, roomId });
    router.push(`/rooms/${roomId}/live?sessionId=${sessionId}`);
  };

  const handleJoinSession = async (sessionId: string) => {
    await joinSession({ sessionId, roomId });
    router.push(`/rooms/${roomId}/live?sessionId=${sessionId}`);
  };

  const handleCancelSession = async (sessionId: string) => {
    await deleteSession({ sessionId, roomId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto bg-main-background">
      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-heading">
          Upcoming Sessions
        </h2>
        {isAdmin && (
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              className="w-[150px]"
              onClick={handleStartInstantSession}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Video className="w-4 h-4 mr-2" />
              )}
              Start Session
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-[150px]"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        )}
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 ? (
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <UpcomingSessionCard
                key={session.id}
                session={session}
                onJoin={handleJoinSession}
                onStart={handleStartScheduledSession}
                onCancel={handleCancelSession}
                isStarting={isStarting}
                isCancelling={isDeleting}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyUpcomingState />
      )}

      {/* Recent Sessions */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-heading mb-4">
          Recent Sessions
        </h2>
        {pastSessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pastSessions.map((session) => (
              <PastSessionCard key={session.id} session={session} isAdmin={isAdmin} roomId={roomId} />
            ))}
          </div>
        ) : (
          <EmptyPastState />
        )}
      </section>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleSessionModal
          roomId={roomId}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}

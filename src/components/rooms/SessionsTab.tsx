"use client";

import React, { useState } from "react";
import { Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Session } from "./sessions-tab/types";
import { sampleSessions } from "./sessions-tab/sample-data";
import UpcomingSessionCard from "./sessions-tab/UpcomingSessionCard";
import PastSessionCard from "./sessions-tab/PastSessionCard";
import { EmptyUpcomingState, EmptyPastState } from "./sessions-tab/SessionEmptyStates";

export default function SessionsTab() {
  const [sessions, setSessions] = useState<Session[]>(sampleSessions);

  // Separate sessions by status
  const upcomingSessions = sessions
    .filter((s) => s.status === "upcoming" || s.status === "live")
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const pastSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto bg-main-background">
      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-heading">
          Upcoming Sessions
        </h2>
        <div className="flex items-center gap-4">
          <Button size="sm" className="w-[150px]">
            <Video className="w-4 h-4 mr-2" />
            Start Session
          </Button>
          <Button size="sm" variant="outline" className="w-[150px]">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 ? (
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <UpcomingSessionCard key={session.id} session={session} />
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
              <PastSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <EmptyPastState />
        )}
      </section>
    </div>
  );
}

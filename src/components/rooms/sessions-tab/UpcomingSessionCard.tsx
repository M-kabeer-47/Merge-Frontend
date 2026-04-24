"use client";

import { Video, Calendar, Users, Clock, Play, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Session } from "./types";
import { formatSessionDate } from "./utils";
import { useRoom } from "@/providers/RoomProvider";

interface UpcomingSessionCardProps {
  session: Session;
  onJoin?: (sessionId: string) => void;
  onStart?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  isStarting?: boolean;
  isCancelling?: boolean;
}

export default function UpcomingSessionCard({
  session,
  onJoin,
  onStart,
  onCancel,
  isStarting,
  isCancelling,
}: UpcomingSessionCardProps) {
  const { userRole } = useRoom();
  const isLive = session.status === "live";
  const isScheduled = session.status === "scheduled";
  const isAdmin = userRole === "instructor";
  const hostName = session.host
    ? `${session.host.firstName} ${session.host.lastName}`
    : "Unknown";

  return (
    <article className="bg-background border border-light-border rounded-lg p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Left Side - Icon & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-heading truncate">
            {session.title}
          </h3>
        </div>

        {/* Right Side - Status Badge */}
        {isLive && (
          <span className="px-3 py-1 bg-destructive text-white rounded-full text-xs font-medium whitespace-nowrap ml-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Live
          </span>
        )}
        {isScheduled && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium whitespace-nowrap ml-2">
            Scheduled
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {/* Hosted By */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-para">
            <div className="relative left-[-5px]">
              <Avatar profileImage={session.host?.image} size="md" />
            </div>
            <span>Hosted by {hostName}</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>
            {formatSessionDate(
              session.scheduledAt || session.startedAt || session.createdAt
            )}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendeeCount} participants</span>
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-para-muted line-clamp-2 mt-1">
            {session.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {isLive && (
          <Button
            size="sm"
            className="w-[150px]"
            onClick={() => onJoin?.(session.id)}
          >
            <Video className="w-4 h-4 mr-2" />
            Join Session
          </Button>
        )}
        {isScheduled && isAdmin && (
          <Button
            size="sm"
            className="w-[150px]"
            onClick={() => onStart?.(session.id)}
            disabled={isStarting}
          >
            {isStarting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Start Now
          </Button>
        )}
        {isScheduled && !isAdmin && (
          <Button size="sm" variant="outline" className="w-[150px]" disabled>
            <Clock className="w-4 h-4 mr-2" />
            Scheduled
          </Button>
        )}
        {isAdmin && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/5"
            onClick={() => onCancel?.(session.id)}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Cancel
          </Button>
        )}
      </div>
    </article>
  );
}

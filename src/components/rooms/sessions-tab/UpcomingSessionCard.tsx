import { Video, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Session } from "./types";
import { formatSessionDate } from "./utils";

export default function UpcomingSessionCard({ session }: { session: Session }) {
  const isLive = session.status === "live";

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

        {/* Right Side - Live Badge */}
        {isLive && (
          <span className="px-3 py-1 bg-destructive text-white rounded-full text-xs font-medium whitespace-nowrap ml-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Live
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {/* Hosted By */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-para">
            <div className="relative left-[-5px]">
              <Avatar profileImage={session.hostedBy.avatar} size="md" />
            </div>
            <span>Hosted by {session.hostedBy.name}</span>
          </div>
          {session.hostedBy.role && (
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              {session.hostedBy.role}
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>{formatSessionDate(session.dateTime, session.duration)}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendees.count} participants</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {isLive ? (
          <Button size="sm" className="w-[150px]">
            <Video className="w-4 h-4 mr-2" />
            Join Session
          </Button>
        ) : (
          <Button size="sm" className="w-[150px]">
            <Clock className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
        )}
      </div>
    </article>
  );
}

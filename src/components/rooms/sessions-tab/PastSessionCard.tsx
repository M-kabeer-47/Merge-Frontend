import { Video, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Session } from "./types";
import { formatSessionDate } from "./utils";

export default function PastSessionCard({ session }: { session: Session }) {
  return (
    <article className="bg-background border border-light-border rounded-lg p-4 sm:p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        {/* Left Side - Icon & Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6 text-para-muted" />
          </div>
          <h3 className="text-lg font-semibold text-heading truncate">
            {session.title}
          </h3>
        </div>

        {/* Right Side - Completed Badge */}
        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium whitespace-nowrap ml-2">
          Completed
        </span>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-4">
        {/* Hosted By */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-para">
            <div className="relative left-[-5px]">
              <Avatar profileImage={session.hostedBy.avatar} size="sm" />
            </div>
            <span>Hosted by {session.hostedBy.name}</span>
          </div>
          {session.hostedBy.role && (
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              {session.hostedBy.role}
            </span>
          )}
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>{formatSessionDate(session.dateTime, session.duration)}</span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendees.count} attendees</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        <Button size="sm" className="w-[170px]">
          <Users className="w-4 h-4 mr-2" />
          View Attendees
        </Button>
        {session.lectureSummary && (
          <Button size="sm" className="w-[195px]" variant={"outline"}>
            <FileText className="w-4 h-4 mr-2" />
            View Lecture Summary
          </Button>
        )}
      </div>
    </article>
  );
}

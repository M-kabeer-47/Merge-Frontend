"use client";

import { useState } from "react";
import { Video, Calendar, Users, Target, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Session } from "./types";
import { formatSessionDate } from "./utils";
import FocusReportDialog from "@/components/live-session/FocusReportDialog";
import { useFocusReportQuery } from "@/hooks/focus-tracker/use-focus-report-query";

export default function PastSessionCard({ session }: { session: Session }) {
  const hostName = session.host
    ? `${session.host.firstName} ${session.host.lastName}`
    : "Unknown";

  const [reportOpen, setReportOpen] = useState(false);
  const { data: report, isLoading, error } = useFocusReportQuery(
    session.id,
    reportOpen,
  );

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
              <Avatar profileImage={session.host?.image} size="sm" />
            </div>
            <span>Hosted by {hostName}</span>
          </div>
        </div>

        {/* Date & Duration */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Calendar className="w-4 h-4" />
          <span>
            {formatSessionDate(
              session.startedAt || session.createdAt,
              session.durationMinutes
            )}
          </span>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2 text-sm text-para-muted">
          <Users className="w-4 h-4" />
          <span>{session.attendeeCount} attendees</span>
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-para-muted line-clamp-2 mt-1">
            {session.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mt-4">
        <Button size="sm" className="w-[170px]">
          <Users className="w-4 h-4 mr-2" />
          View Attendees
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-[210px]"
          onClick={() => setReportOpen(true)}
        >
          <Target className="w-4 h-4 mr-2" />
          View My Focus Report
        </Button>
      </div>

      {/* Historical Focus Report */}
      {reportOpen && (
        <>
          {isLoading ? (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading focus report…</span>
              </div>
            </div>
          ) : error ? (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur p-4"
              onClick={() => setReportOpen(false)}
            >
              <div className="max-w-sm bg-[#1e1f23] text-white rounded-2xl p-6 border border-white/10">
                <div className="text-sm font-medium mb-2">
                  Couldn&apos;t load report
                </div>
                <div className="text-xs text-white/60">
                  Please try again in a moment.
                </div>
              </div>
            </div>
          ) : report ? (
            <FocusReportDialog
              isOpen={reportOpen}
              onClose={() => setReportOpen(false)}
              report={report}
              mode="historical"
            />
          ) : (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur p-4"
              onClick={() => setReportOpen(false)}
            >
              <div className="max-w-sm bg-[#1e1f23] text-white rounded-2xl p-6 border border-white/10 text-center">
                <Target className="w-8 h-8 text-white/40 mx-auto mb-3" />
                <div className="text-sm font-medium mb-1">
                  No focus report for this session
                </div>
                <div className="text-xs text-white/60">
                  Focus tracking wasn&apos;t enabled when you attended.
                </div>
                <button
                  onClick={() => setReportOpen(false)}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}

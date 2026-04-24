"use client";

import { useState, useEffect } from "react";
import { Video, Calendar, Users, Target, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import type { Session } from "./types";
import { formatSessionDate } from "./utils";
import FocusReportDialog from "@/components/live-session/FocusReportDialog";
import { useFocusReportQuery } from "@/hooks/focus-tracker/use-focus-report-query";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface AttendeeInfo {
  id: string;
  joinedAt: string;
  leftAt?: string;
  focusScore: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  } | null;
}

function AttendeesModal({
  sessionId,
  roomId,
  onClose,
}: {
  sessionId: string;
  roomId: string;
  onClose: () => void;
}) {
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/live-sessions/${sessionId}/attendees?roomId=${roomId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setAttendees(data.attendees || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [sessionId, roomId]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background rounded-2xl border border-light-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-heading">Session Attendees</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-secondary/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-para-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-para-muted text-sm">
              Failed to load attendees. Please try again.
            </div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-12 text-para-muted text-sm">
              No attendees found.
            </div>
          ) : (
            <div className="divide-y divide-light-border">
              {attendees.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar profileImage={a.user?.image} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-heading truncate">
                        {a.user
                          ? `${a.user.firstName} ${a.user.lastName}`
                          : "Unknown User"}
                      </p>
                      <p className="text-xs text-para-muted">
                        Joined {new Date(a.joinedAt).toLocaleTimeString()}
                        {a.leftAt && ` · Left ${new Date(a.leftAt).toLocaleTimeString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <Target className="w-3.5 h-3.5 text-para-muted" />
                    <span
                      className={`text-xs font-semibold ${
                        a.focusScore >= 80
                          ? "text-green-600"
                          : a.focusScore >= 60
                          ? "text-amber-600"
                          : a.focusScore > 0
                          ? "text-red-600"
                          : "text-para-muted"
                      }`}
                    >
                      {a.focusScore > 0 ? `${a.focusScore}%` : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && attendees.length > 0 && (
          <div className="px-5 py-3 border-t border-light-border text-xs text-para-muted text-center">
            {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PastSessionCard({
  session,
  isAdmin = false,
  roomId = "",
}: {
  session: Session;
  isAdmin?: boolean;
  roomId?: string;
}) {
  const hostName = session.host
    ? `${session.host.firstName} ${session.host.lastName}`
    : "Unknown";

  const [reportOpen, setReportOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
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

      {/* Action Buttons — role-based */}
      <div className="flex gap-2 flex-wrap mt-4">
        {isAdmin ? (
          <>
            <Button size="sm" className="w-[170px]" onClick={() => setAttendeesOpen(true)}>
              <Users className="w-4 h-4 mr-2" />
              View Attendees
            </Button>
            {session.summaryPdfUrl && (
              <Button
                size="sm"
                variant="outline"
                className="w-[170px]"
                onClick={() => window.open(session.summaryPdfUrl!, "_blank")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Summary
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="sm"
              className="w-[210px]"
              onClick={() => setReportOpen(true)}
            >
              <Target className="w-4 h-4 mr-2" />
              View My Focus Report
            </Button>
            {session.summaryPdfUrl && (
              <Button
                size="sm"
                variant="outline"
                className="w-[170px]"
                onClick={() => window.open(session.summaryPdfUrl!, "_blank")}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Summary
              </Button>
            )}
          </>
        )}
      </div>

      {/* Attendees Modal (Admin) */}
      {attendeesOpen && (
        <AttendeesModal
          sessionId={session.id}
          roomId={roomId}
          onClose={() => setAttendeesOpen(false)}
        />
      )}

      {/* Historical Focus Report (Member) */}
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

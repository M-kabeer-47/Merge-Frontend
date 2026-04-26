"use client";

import { ClipboardList, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useMyPendingAssignments from "@/hooks/assignments/use-my-pending-assignments";

function timeRemaining(deadline: Date): { label: string; isUrgent: boolean; isOverdue: boolean } {
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  if (isOverdue) {
    return { label: "Overdue", isUrgent: true, isOverdue: true };
  }
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (days >= 1) return { label: `${days}d left`, isUrgent: days <= 2, isOverdue: false };
  if (hours >= 1) return { label: `${hours}h left`, isUrgent: true, isOverdue: false };
  return { label: "Due soon", isUrgent: true, isOverdue: false };
}

export default function PendingAssignments() {
  const { assignments, isLoading } = useMyPendingAssignments(4);
  const router = useRouter();

  // Order: non-overdue first (soonest deadline first), then overdue at the bottom
  const sortedAssignments = [...assignments].sort((a, b) => {
    const now = Date.now();
    const aEnd = a.endAt ? new Date(a.endAt).getTime() : Infinity;
    const bEnd = b.endAt ? new Date(b.endAt).getTime() : Infinity;
    const aOverdue = aEnd < now;
    const bOverdue = bEnd < now;
    if (aOverdue && !bOverdue) return 1;   // a goes after b
    if (!aOverdue && bOverdue) return -1;  // a goes before b
    return aEnd - bEnd;                    // both same status: closest deadline first
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Pending Assignments
          </h2>
        </div>
        <Link
          href="/rooms"
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-secondary/10 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-background border border-light-border rounded-xl p-6 text-center flex-1 flex flex-col justify-center">
          <ClipboardList className="w-8 h-8 text-para-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-heading font-medium">All caught up!</p>
          <p className="text-xs text-para-muted mt-1">No pending assignments across your rooms.</p>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {sortedAssignments.map((a) => {
            const deadline = a.endAt ? new Date(a.endAt) : null;
            const time = deadline ? timeRemaining(deadline) : null;
            return (
              <button
                key={a.id}
                onClick={() => a.room && router.push(`/rooms/${a.room.id}/assignments/${a.id}`)}
                className="w-full text-left bg-background border border-light-border rounded-lg p-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-heading truncate">{a.title}</h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-para-muted mt-0.5">
                      {a.room && (
                        <span className="truncate font-medium">{a.room.title}</span>
                      )}
                      {a.totalScore != null && (
                        <>
                          <span>·</span>
                          <span>{a.totalScore} pts</span>
                        </>
                      )}
                    </div>
                    {deadline && (
                      <p className="text-[11px] text-para-muted mt-1">
                        Due {format(deadline, "dd MMM, h:mm a")}
                      </p>
                    )}
                  </div>
                  {time && (
                    <span
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        time.isOverdue
                          ? "bg-destructive/10 text-destructive"
                          : time.isUrgent
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary/10 text-para"
                      }`}
                    >
                      {time.isOverdue ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {time.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

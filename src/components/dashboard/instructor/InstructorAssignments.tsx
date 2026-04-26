"use client";

import { ClipboardList, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import useInstructorActiveAssignments from "@/hooks/assignments/use-instructor-active-assignments";

export default function InstructorAssignments() {
  const { assignments, isLoading } = useInstructorActiveAssignments(4);
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Active Assignments
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
            <div key={i} className="h-24 bg-secondary/10 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-background border border-light-border rounded-xl p-6 text-center flex-1 flex flex-col justify-center">
          <ClipboardList className="w-8 h-8 text-para-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-heading font-medium">No active assignments</p>
          <p className="text-xs text-para-muted mt-1">
            Create assignments in your rooms to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {assignments.map((a) => {
            const needsGrading = a.ungradedAttempts > 0;
            const allGraded =
              a.totalAttempts > 0 && a.ungradedAttempts === 0;
            return (
              <button
                key={a.id}
                onClick={() => a.room && router.push(`/rooms/${a.room.id}/assignments/${a.id}`)}
                className="w-full text-left bg-background border border-light-border rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-heading truncate">
                      {a.title}
                    </h4>
                    {a.room && (
                      <p className="text-[11px] text-primary font-medium mt-0.5">
                        {a.room.title}
                      </p>
                    )}
                  </div>
                  {needsGrading ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent flex-shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      Needs grading
                    </span>
                  ) : allGraded ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Graded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/10 text-para-muted flex-shrink-0">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-para-muted">
                  {a.endAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {format(new Date(a.endAt), "dd MMM")}
                    </span>
                  )}
                  <span>
                    <span className="font-semibold text-para">{a.gradedAttempts}</span>
                    /{a.totalAttempts} graded
                  </span>
                  {a.totalScore != null && (
                    <span>{a.totalScore} pts</span>
                  )}
                </div>

                {a.totalAttempts > 0 && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary/10">
                    <div
                      className={`h-full rounded-full ${needsGrading ? "bg-accent" : "bg-success"}`}
                      style={{
                        width: `${Math.round((a.gradedAttempts / a.totalAttempts) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { ClipboardList, Calendar } from "lucide-react";
import type { PublicRoom } from "@/types/discover";

interface RoomAssignmentsSectionProps {
  assignments: PublicRoom["assignments"];
}

export default function RoomAssignmentsSection({
  assignments,
}: RoomAssignmentsSectionProps) {
  if (assignments.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
        <ClipboardList className="w-4 h-4" />
        Assignments ({assignments.length})
      </h3>
      <div className="space-y-2">
        {assignments.slice(0, 3).map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center justify-between p-3 rounded-lg border border-light-border hover:bg-secondary/5 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-heading truncate">
                {assignment.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-para-muted mt-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Due:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {assignments.length > 3 && (
        <p className="text-sm text-para-muted mt-2">
          +{assignments.length - 3} more assignments
        </p>
      )}
    </section>
  );
}

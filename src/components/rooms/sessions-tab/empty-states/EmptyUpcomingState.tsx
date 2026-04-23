import { Calendar } from "lucide-react";

export function EmptyUpcomingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="w-12 h-12 text-para-muted mb-3" />
      <h3 className="text-lg font-semibold text-heading mb-1">
        No Upcoming Sessions
      </h3>
      <p className="text-sm text-para-muted">
        Schedule a session to get started
      </p>
    </div>
  );
}

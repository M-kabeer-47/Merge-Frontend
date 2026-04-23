import { Video } from "lucide-react";

export function EmptyPastState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Video className="w-12 h-12 text-para-muted mb-3" />
      <h3 className="text-lg font-semibold text-heading mb-1">
        No Past Sessions
      </h3>
      <p className="text-sm text-para-muted">
        Completed sessions will appear here
      </p>
    </div>
  );
}

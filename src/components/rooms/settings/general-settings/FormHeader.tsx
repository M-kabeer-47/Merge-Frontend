import { Clock } from "lucide-react";
import { format } from "date-fns";

interface FormHeaderProps {
  lastSaved?: string;
}

export function FormHeader({ lastSaved }: FormHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-xl font-raleway font-bold text-heading">
          General Information
        </h3>
        <p className="text-sm text-para-muted mt-1">
          Update your room&apos;s identity and description
        </p>
      </div>
      {lastSaved && (
        <div className="flex items-center gap-2 text-xs text-para-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>Last saved {format(new Date(lastSaved), "MMM d, h:mm a")}</span>
        </div>
      )}
    </div>
  );
}

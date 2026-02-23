import { Check, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import type { JoinRequest } from "@/types/join-request";
import { Button } from "@/components/ui/Button";
import { getTimeAgo } from "@/utils/date-helpers";

interface JoinRequestItemProps {
  request: JoinRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isLoading?: boolean;
}

/**
 * Single join request item with user info and action buttons
 */
export default function JoinRequestItem({
  request,
  onAccept,
  onReject,
  isLoading = false,
}: JoinRequestItemProps) {
  const { user, createdAt, id } = request;
  const timeAgo = getTimeAgo(createdAt, false);

  return (
    <div className="flex items-center justify-between p-4 border border-light-border rounded-lg bg-background hover:bg-secondary/5 transition-colors">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10">
          <Avatar profileImage={user.image ?? undefined} size="md" />
        </div>
        <div>
          <p className="font-medium text-heading">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-para-muted">{user.email}</p>
          <p className="text-xs text-para-muted">{timeAgo}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onReject(id)}
          disabled={isLoading}
          variant="outline"
          aria-label="Reject request"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Reject</span>
        </Button>
        <Button
          onClick={() => onAccept(id)}
          disabled={isLoading}
          variant="default"
          aria-label="Accept request"
        >
          <Check className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Accept</span>
        </Button>
      </div>
    </div>
  );
}

import { Inbox } from "lucide-react";
import JoinRequestItem from "./JoinRequestItem";
import JoinRequestItemSkeleton from "./JoinRequestItemSkeleton";
import type { JoinRequest } from "@/types/join-request";

interface JoinRequestsListProps {
  requests: JoinRequest[] | undefined;
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  processingId?: string;
}

/**
 * List of join requests with loading and empty states
 */
export default function JoinRequestsList({
  requests,
  isLoading,
  onAccept,
  onReject,
  processingId,
}: JoinRequestsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <JoinRequestItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="text-lg font-medium text-heading mb-1">
          No pending requests
        </h3>
        <p className="text-sm text-para-muted">
          When students request to join this room, they'll appear here.
        </p>
      </div>
    );
  }

  // List of requests
  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <JoinRequestItem
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
          isLoading={processingId === request.id}
        />
      ))}
    </div>
  );
}

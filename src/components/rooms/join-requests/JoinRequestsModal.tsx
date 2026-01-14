"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import JoinRequestsList from "./JoinRequestsList";
import useFetchJoinRequests from "@/hooks/rooms/use-fetch-join-requests";
import useReviewJoinRequest from "@/hooks/rooms/use-review-join-request";

interface JoinRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
}

/**
 * Modal to display and manage room join requests (instructor only)
 */
export default function JoinRequestsModal({
  isOpen,
  onClose,
  roomId,
  roomName,
}: JoinRequestsModalProps) {
  const [processingId, setProcessingId] = useState<string | undefined>();

  const { data: requests, isLoading } = useFetchJoinRequests({
    roomId,
    enabled: isOpen,
  });

  const { mutateAsync: reviewRequest } = useReviewJoinRequest({
    roomId,
  });

  if (!isOpen) return null;

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await reviewRequest({ requestId, action: "accepted" });
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await reviewRequest({ requestId, action: "rejected" });
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const pendingCount =
    requests?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-requests-modal-title"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-background rounded-xl shadow-xl max-w-xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2
                  id="join-requests-modal-title"
                  className="text-xl font-semibold text-heading"
                >
                  Join Requests
                  {pendingCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-para-muted">
                      ({pendingCount} pending)
                    </span>
                  )}
                </h2>
                <p className="text-sm text-para-muted">{roomName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-para" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <JoinRequestsList
              requests={requests}
              isLoading={isLoading}
              onAccept={handleAccept}
              onReject={handleReject}
              processingId={processingId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

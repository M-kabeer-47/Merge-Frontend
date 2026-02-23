"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import JoinRequestsList from "./JoinRequestsList";
import Modal from "@/components/ui/Modal";
import useFetchJoinRequests from "@/hooks/rooms/use-fetch-join-requests";
import useReviewJoinRequest from "@/hooks/rooms/use-review-join-request";

interface JoinRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
}

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

  const pendingCount =
    requests?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join Requests${pendingCount > 0 ? ` (${pendingCount} pending)` : ""}`}
      description={roomName}
      icon={
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
      }
      maxWidth="xl"
    >
      <JoinRequestsList
        requests={requests}
        isLoading={isLoading}
        onAccept={handleAccept}
        onReject={handleReject}
        processingId={processingId}
      />
    </Modal>
  );
}

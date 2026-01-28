import React from "react";
import Modal from "@/components/ui/Modal";
import AnnouncementComposer from "@/components/announcements/AnnouncementComposer";
import type { Announcement } from "@/types/announcement";
import useUpdateAnnouncement from "@/hooks/announcements/use-update-announcement";

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
  roomId: string;
}

export default function EditAnnouncementModal({
  isOpen,
  onClose,
  announcement,
  roomId,
}: EditAnnouncementModalProps) {
  const { mutate: updateAnnouncement, isPending } = useUpdateAnnouncement();

  const handleUpdate = (data: {
    title: string;
    content: string;
    scheduledFor?: Date;
    attachments: File[];
  }) => {
    updateAnnouncement(
      {
        id: announcement.id,
        roomId,
        title: data.title,
        content: data.content,
        scheduledAt: data.scheduledFor?.toISOString(),
        isPublished: !data.scheduledFor,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Announcement"
      maxWidth="2xl"
    >
      <AnnouncementComposer
        initialData={{
          title: announcement.title,
          content: announcement.content,
          scheduledFor: announcement.scheduledFor
            ? new Date(announcement.scheduledFor)
            : undefined,
        }}
        onPost={handleUpdate}
        actionLabel={isPending ? "Updating..." : "Update"}
      />
    </Modal>
  );
}

"use client";

import {
  X,
  UserPlus,
  ExternalLink,
  Users,
  FileText,
  ClipboardList,
  Calendar,
  File,
  Image as ImageIcon,
  FileVideo,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { PublicRoom, RoomFile } from "@/types/discover";
import TagChip from "./TagChip";
import { Button } from "../ui/Button";

interface RoomPreviewModalProps {
  room: PublicRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
  onOpenFull: (roomId: string) => void;
}

const getFileIcon = (type: RoomFile["type"]) => {
  switch (type) {
    case "pdf":
    case "doc":
      return FileText;
    case "image":
      return ImageIcon;
    case "video":
      return FileVideo;
    default:
      return File;
  }
};

export default function RoomPreviewModal({
  room,
  isOpen,
  onClose,
  onJoin,
  onOpenFull,
}: RoomPreviewModalProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !room) return null;

  const isLongDescription = room.description.length > 150;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-background rounded-xl shadow-2xl max-w-3xl w-full max-h-[93vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-light-border">
          <div className="flex-1 min-w-0 pr-4">
            <h2
              id="modal-title"
              className="text-2xl font-bold text-heading mb-2"
            >
              {room.title}
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden flex-shrink-0">
                <Image
                  src={room.creator.avatar}
                  alt={room.creator.name}
                  width={32}
                  height={32}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">
                  {room.creator.name}
                </p>
                <p className="text-xs text-para-muted">Room Creator</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-secondary/10 flex items-center justify-center transition-colors text-para-muted hover:text-heading"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
          {/* Description */}
          <section>
            <h3 className="text-sm font-semibold text-heading mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </h3>
            <p className="text-sm text-para">
              {showFullDescription || !isLongDescription
                ? room.description
                : `${room.description.slice(0, 150)}...`}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm text-primary hover:text-primary/80 font-medium mt-2"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-sm font-semibold text-heading mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {room.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
          </section>

          {/* Members Preview */}
          <section>
            <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Members ({room.membersCount})
            </h3>
            <div className="flex items-center gap-6 flex-wrap">
              {room.membersPreview.slice(0, 6).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={32}
                      height={32}
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-sm text-para whitespace-nowrap">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
            {room.membersCount > 6 && (
              <p className="text-sm text-para-muted mt-3">
                +{room.membersCount - 6} more members
              </p>
            )}
          </section>

          {/* Files Preview */}
          {room.files.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Files ({room.files.length})
              </h3>
              <div className="space-y-2">
                {room.files.slice(0, 3).map((file) => {
                  const Icon = getFileIcon(file.type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-light-border hover:bg-secondary/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-heading truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-para-muted">{file.size}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {room.files.length > 3 && (
                <p className="text-sm text-para-muted mt-2">
                  +{room.files.length - 3} more files
                </p>
              )}
            </section>
          )}

          {/* Assignments Preview */}
          {room.assignments.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Assignments ({room.assignments.length})
              </h3>
              <div className="space-y-2">
                {room.assignments.slice(0, 3).map((assignment) => (
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
              {room.assignments.length > 3 && (
                <p className="text-sm text-para-muted mt-2">
                  +{room.assignments.length - 3} more assignments
                </p>
              )}
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-light-border bg-secondary/5 ">
          <Button variant={"outline"} className="w-1/2">
            <X className="w-4 h-4" />
            <span>Close</span>
          </Button>
          <Button className="w-1/2" onClick={() => onJoin(room.id)}>
            <UserPlus className="w-4 h-4" />
            <span>Join Room</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

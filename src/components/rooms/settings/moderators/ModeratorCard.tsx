"use client";

import { Button } from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { Trash2 } from "lucide-react";
import type { RoomMember } from "@/types/room-settings";

interface ModeratorCardProps {
  moderator: RoomMember;
  onRemove: () => void;
  isDisabled?: boolean;
}

export default function ModeratorCard({
  moderator,
  onRemove,
  isDisabled = false,
}: ModeratorCardProps) {
  return (
    <div className="p-3 sm:p-4 border border-light-border rounded-lg hover:border-secondary/30 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Moderator Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Avatar profileImage={moderator.avatar} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-heading text-sm truncate">
              {moderator.name}
            </h4>
            <p className="text-xs text-para-muted truncate">
              {moderator.email}
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          onClick={onRemove}
          variant="outline"
          size="sm"
          className="flex-shrink-0"
          aria-label={`Remove ${moderator.name} as moderator`}
          disabled={isDisabled}
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
          <span className="hidden sm:inline ml-1">Remove</span>
        </Button>
      </div>
    </div>
  );
}

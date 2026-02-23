import { X } from "lucide-react";
import type { ChatMessage, ChatUser } from "@/types/general-chat";
import { getUserDisplayName } from "@/types/general-chat";

interface ReplyPreviewBannerProps {
  replyingTo: ChatMessage;
  replyingToUser: ChatUser;
  onCancelReply: () => void;
}

export default function ReplyPreviewBanner({
  replyingTo,
  replyingToUser,
  onCancelReply,
}: ReplyPreviewBannerProps) {
  return (
    <div className="px-6 py-3 relative ">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-para-muted mb-1">
            Replying to{" "}
            <span className="font-medium text-heading">
              {getUserDisplayName(replyingToUser)}
            </span>
          </div>
          <div className="text-sm text-para line-clamp-2">
            {replyingTo.content}
          </div>
        </div>
        <button
          onClick={onCancelReply}
          className="p-1  rounded transition-colors ml-2"
        >
          <X className="h-4 w-4 text-heading absolute right-[25px] " />
        </button>
      </div>
    </div>
  );
}

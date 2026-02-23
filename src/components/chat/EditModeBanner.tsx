import { X } from "lucide-react";
import type { ChatMessage } from "@/types/general-chat";

interface EditModeBannerProps {
  editingMessage: ChatMessage;
  onCancelEdit?: () => void;
}

export default function EditModeBanner({
  editingMessage,
  onCancelEdit,
}: EditModeBannerProps) {
  return (
    <div className="px-6 py-3 relative bg-primary/10 rounded-lg mx-4 mt-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-primary mb-1 font-medium">
            Editing message
          </div>
          <div className="text-sm text-para line-clamp-2">
            {editingMessage.content}
          </div>
        </div>
        <button
          onClick={onCancelEdit}
          className="p-1 rounded transition-colors ml-2 hover:bg-primary/10"
        >
          <X className="h-4 w-4 text-para" />
        </button>
      </div>
    </div>
  );
}

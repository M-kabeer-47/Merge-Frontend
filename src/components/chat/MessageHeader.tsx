import type { ChatMessage, ChatUser } from "@/types/general-chat";
import { getUserDisplayName } from "@/types/general-chat";

interface MessageHeaderProps {
  user?: ChatUser | null;
  message: ChatMessage;
  isOwnMessage: boolean;
}

export default function MessageHeader({
  isOwnMessage,
  message,
  user,
}: MessageHeaderProps) {
  return (
    <div className={`flex items-baseline gap-2 mb-1 ${isOwnMessage ? "" : ""}`}>
      {!isOwnMessage && (
        <span className={`font-semibold text-sm ${isOwnMessage ? "text-white" : "text-secondary"}`}>
          {getUserDisplayName(user)}
        </span>
      )}
    </div>
  );
}

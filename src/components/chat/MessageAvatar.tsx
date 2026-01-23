import type { ChatUser } from "@/types/general-chat";
import { getUserInitials, getUserDisplayName } from "@/types/general-chat";

interface MessageAvatarProps {
  user?: ChatUser | null;
  isOwnMessage: boolean;
}

export default function MessageAvatar({
  user,
  isOwnMessage,
}: MessageAvatarProps) {
  const initials = user?.initials || getUserInitials(user);
  const displayName = getUserDisplayName(user);
  
  return (
    <div className="flex-shrink-0">
      {user?.image ? (
        <img
          src={user.image}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isOwnMessage ? "bg-white/20" : "bg-secondary/10"
          }`}
        >
          <span
            className={`text-xs font-medium ${
              isOwnMessage ? "text-white" : "text-secondary"
            }`}
          >
            {initials}
          </span>
        </div>
      )}
      {user?.isOnline && (
        <div
          className={`w-3 h-3 bg-green-500 rounded-full border-2 border-background -mt-2 ml-6`}
        ></div>
      )}
    </div>
  );
}

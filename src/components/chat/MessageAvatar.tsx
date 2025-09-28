
interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  isOnline: boolean;
}
interface MessageAvatarProps {
  user: ChatUser;
  isOwnMessage: boolean;
}
export default function MessageAvatar({
  user,
  isOwnMessage,
}: MessageAvatarProps) {
  return (
    <div className="flex-shrink-0">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
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
            {user.initials}
          </span>
        </div>
      )}
      {user.isOnline && (
        <div
          className={`w-3 h-3 bg-green-500 rounded-full border-2 border-background -mt-2 ml-6`}
        ></div>
      )}
    </div>
  );
}

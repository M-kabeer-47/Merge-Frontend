interface MessageHeaderProps {
  user: {
    name: string;
    role: "student" | "instructor" | "admin";
    initials: string;
  };
  message: {
    id: string;
    content: string;
    timestamp: Date;
    edited?: boolean;
    deletedForEveryone?: boolean;
  };
  isOwnMessage: boolean;
}

export default function MessageHeader({
  isOwnMessage,
  message,
  user,
}: MessageHeaderProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return isOwnMessage ? "text-white" : "text-primary";
      case "admin":
        return isOwnMessage ? "text-white" : "text-accent";
      default:
        return isOwnMessage ? "text-white" : "text-secondary";
    }
  };

  return (
    <div className={`flex items-baseline gap-2 mb-1 ${isOwnMessage ? "" : ""}`}>
      {!isOwnMessage && (
        <span className={`font-semibold text-sm ${getRoleColor(user.role)}`}>
          {user.name}
        </span>
      )}
      {user.role === "instructor" && (
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            isOwnMessage
              ? "bg-white/20 text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          Instructor
        </span>
      )}
      {user.role === "admin" && (
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${
            isOwnMessage ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
          }`}
        >
          Admin
        </span>
      )}
      <span
        className={`text-xs ${
          isOwnMessage ? "text-white/70" : "text-para-muted"
        }`}
      >
        {/* {format(message.timestamp, { addSuffix: true })} */}
      </span>
      {message.edited && !message.deletedForEveryone && (
        <span
          className={`text-xs ${
            isOwnMessage ? "text-white/70" : "text-para-muted"
          }`}
        >
          (edited)
        </span>
      )}
    </div>
  );
}

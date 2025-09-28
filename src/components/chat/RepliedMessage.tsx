interface RepliedMessageProps {
  replyToUser: {
    name: string;
  };
  handleReplyClick: (e: React.MouseEvent) => void;
  isOwnMessage: boolean;
  replyToMessage: {
    content: string;
  };
}
export default function RepliedMessage({
  replyToUser,
  handleReplyClick,
  isOwnMessage,
  replyToMessage,
}: RepliedMessageProps) {
  return (
    <button
      className={`mb-2 p-3 rounded-md py-1 w-full text-left ${
        isOwnMessage
          ? "bg-white/10 border-l-2 border-white/20"
          : "bg-secondary/5 border-l-2 border-primary hover:bg-secondary/10"
      } transition-colors`}
      onClick={handleReplyClick}
    >
      <div
        className={`text-xs mb-1 ${
          isOwnMessage ? "text-white/80" : "text-para-muted"
        }`}
      >
        <span
          className={`font-medium ${
            isOwnMessage ? "text-white" : "text-heading"
          }`}
        >
          {replyToUser.name}
        </span>
      </div>
      <div
        className={`text-sm line-clamp-2 ${
          isOwnMessage ? "text-white/90" : "text-para"
        }`}
      >
        {replyToMessage.content}
      </div>
    </button>
  );
}

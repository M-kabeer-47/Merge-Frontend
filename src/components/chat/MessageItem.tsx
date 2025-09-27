// File: src/components/rooms/chat/MessageItem.tsx
import React from 'react';
import { ChatMessage, User, currentUserId } from '@/lib/constants/mockChatData';
import { Reply, MoreHorizontal, Smile, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

interface MessageItemProps {
  message: ChatMessage;
  user: User;
  replyToMessage?: ChatMessage;
  replyToUser?: User;
  onReply: (messageId: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  user,
  replyToMessage,
  replyToUser,
  onReply,
  onReaction
}) => {
  const isOwnMessage = message.userId === currentUserId;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor': return 'text-primary';
      case 'admin': return 'text-accent';
      default: return 'text-heading';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`group flex gap-3 px-6 py-3 bg-secondary/5 mb-10 hover:bg-gray-50 transition-colors duration-200 ${isOwnMessage ? 'bg-blue-50/30' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">{user.initials}</span>
          </div>
        )}
        {user.isOnline && (
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-background -mt-2 ml-6"></div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Message Header */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`font-semibold text-sm ${getRoleColor(user.role)}`}>
            {user.name}
          </span>
          {user.role === 'instructor' && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
              Instructor
            </span>
          )}
          {user.role === 'admin' && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">
              Admin
            </span>
          )}
          <span className="text-xs text-para-muted">
            {/* {format(message.timestamp, { addSuffix: true })} */}
          </span>
          {message.edited && (
            <span className="text-xs text-para-muted">(edited)</span>
          )}
        </div>

        {/* Reply Context */}
        {replyToMessage && replyToUser && (
          <div className="mb-2 pl-3 border-l-2 border-gray-200 bg-gray-50/50 rounded-r-md py-1">
            <div className="text-xs text-para-muted mb-1">
              Replying to <span className="font-medium text-heading">{replyToUser.name}</span>
            </div>
            <div className="text-sm text-para line-clamp-2">
              {replyToMessage.content}
            </div>
          </div>
        )}

        {/* Message Text */}
        <div className="text-sm text-para leading-relaxed mb-2 whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-heading truncate">
                    {attachment.name}
                  </div>
                  {attachment.size && (
                    <div className="text-xs text-para-muted">
                      {formatFileSize(attachment.size)}
                    </div>
                  )}
                </div>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Download className="h-4 w-4 text-para-muted" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReaction(message.id, reaction.emoji)}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full border transition-colors ${
                  reaction.users.includes(currentUserId)
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-gray-50 border-gray-200 text-para-muted hover:bg-gray-100'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onReply(message.id)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-para-muted hover:text-primary hover:bg-primary/5 rounded transition-colors"
          >
            <Reply className="h-3 w-3" />
            Reply
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-para-muted hover:text-primary hover:bg-primary/5 rounded transition-colors">
            <Smile className="h-3 w-3" />
            React
          </button>
          <button className="p-1 text-para-muted hover:text-heading hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
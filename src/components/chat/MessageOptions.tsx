import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/lib/constants/mock-chat-data";
import { MoreHorizontal, Reply, Trash2, Edit, User } from "lucide-react";
import DropdownMenu from "../ui/Dropdown";

interface MessageOptionsProps {
  isOwnMessage: boolean;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDeleteForMe: (messageId: string) => void;
  onDeleteForEveryone: (messageId: string) => void;
  message: ChatMessage;
}

export default function MessageOptions({
  isOwnMessage,
  onReply,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
  message,
}: MessageOptionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div
      className={`flex items-center gap-1 opacity-100 transition-opacity relative ${
        isOwnMessage ? "justify-end" : ""
      }`}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onReply(message.id);
        }}
        className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
          isOwnMessage
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-para-muted hover:text-primary hover:bg-primary/5"
        }`}
      >
        <Reply className="h-3 w-3" />
        Reply
      </button>

      {isOwnMessage && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((s) => !s);
            }}
            aria-expanded={open}
            aria-haspopup="true"
            className={`p-1 rounded transition-colors ${
              isOwnMessage
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-para-muted hover:text-heading hover:bg-primary/5"
            }`}
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>

          {open && (
            <DropdownMenu
            size="small"
              options={[
                {
                  title: "Edit",
                  icon: <Edit className="h-[15px] w-[15px]" />,
                  action: () => {
                    onEdit(message.id);
                    setOpen(false);
                  },
                },
                {
                  title: "Delete for me",
                  icon: <User className="h-[15px] w-[15px]" />,
                  action: () => {
                    onDeleteForMe(message.id);
                    setOpen(false);
                  },
                },
                {
                  title: "Delete for everyone",
                  destructive: true,
                  icon: <Trash2 className="h-[15px] w-[15px] text-destructive" />,
                  action: () => {
                    onDeleteForEveryone(message.id);
                    setOpen(false);
                  },
                },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}

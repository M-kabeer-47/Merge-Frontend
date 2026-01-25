"use client";
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useEffect,
} from "react";
import {
  Send,
  Paperclip,
  Smile,
  X,
  AtSign,
  Image as ImageIcon,
} from "lucide-react";
import type { ChatMessage, ChatUser } from "@/types/general-chat";
import { getUserDisplayName } from "@/types/general-chat";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/EmojiPicker";
import AttachmentPreview, { AttachmentFile } from "./AttachmentPreview";

interface MessageComposerProps {
  onSendMessage: (
    content: string,
    replyToId?: string,
    attachments?: AttachmentFile[],
  ) => void;
  replyingTo?: ChatMessage;
  replyingToUser?: ChatUser | null;
  onCancelReply: () => void;
  editingMessage?: ChatMessage;
  onCancelEdit?: () => void;
  onUpdateMessage?: (messageId: string, content: string) => void;
}

export type MessageComposerHandle = {
  insertEmoji: (emoji: string) => void;
};

const MessageComposer = forwardRef(function MessageComposer(
  {
    onSendMessage,
    replyingTo,
    replyingToUser,
    onCancelReply,
    editingMessage,
    onCancelEdit,
    onUpdateMessage,
  }: MessageComposerProps,
  ref: ForwardedRef<MessageComposerHandle>,
) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Set message content when editing
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      // Focus the textarea
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [editingMessage]);

  // emoji picker state & ref
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleImageButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentFile[] = [];

    Array.from(files).forEach((file) => {
      newAttachments.push({
        file,
        preview: URL.createObjectURL(file),
        type: "file",
      });
    });

    setAttachments(newAttachments);
    e.currentTarget.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newAttachments.push({
          file,
          preview: URL.createObjectURL(file),
          type: "image",
        });
      }
    });

    setAttachments(newAttachments);
    e.currentTarget.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleRemoveAllAttachments = () => {
    setAttachments([]);
  };

  // Cleanup previews on unmount
  // useEffect(() => {
  //   return () => {
  //     attachments.forEach((attachment) => {
  //       URL.revokeObjectURL(attachment.preview);
  //     });
  //   };
  // }, [attachments]);

  // insert emoji helper (used internally and exposed)
  const insertEmojiLocal = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMessage((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? start;
    const before = message.slice(0, start);
    const after = message.slice(end);
    const newValue = before + emoji + after;

    setMessage(newValue);

    requestAnimationFrame(() => {
      if (!textarea) return;

      const caret = start + emoji.length;
      textarea.selectionStart = textarea.selectionEnd = caret;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
      textarea.focus();
    });
  };

  // expose insertEmoji to parent via ref
  useImperativeHandle(ref, () => ({
    insertEmoji: insertEmojiLocal,
  }));

  // close emoji picker when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(e.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target as Node)
      ) {
        setIsEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      // Check if we're editing
      if (editingMessage && onUpdateMessage) {
        // Update message
        onUpdateMessage(editingMessage.id, message.trim());
        setMessage("");
        onCancelEdit?.();
      } else {
        // Send new message
        onSendMessage(
          message.trim(),
          replyingTo?.id,
          attachments.length > 0 ? attachments : undefined,
        );
        setMessage("");
        handleRemoveAllAttachments();
        if (replyingTo) {
          onCancelReply();
        }
      }
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleEmojiSelect = (emojiData: any) => {
    const emoji =
      typeof emojiData === "string"
        ? emojiData
        : (emojiData?.emoji ?? emojiData?.native ?? "");
    if (!emoji) return;
    insertEmojiLocal(emoji);
  };

  return (
    <div className="border-t border-light-border lg:w-full w-[90%]  relative">
      {/* Attachment Preview */}
      <AttachmentPreview
        attachments={attachments}
        onRemove={handleRemoveAttachment}
        onRemoveAll={handleRemoveAllAttachments}
      />

      {/* Editing Banner */}
      {editingMessage && (
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
      )}

      {replyingTo && replyingToUser && (
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
      )}

      {/* Emoji picker - shown above composer when isEmojiOpen */}
      {isEmojiOpen && (
        <div
          ref={emojiRef}
          className="absolute bottom-full mb-2 right-4 z-50 pointer-events-auto"
        >
          <div className="w-[280px] h-[420px] shadow-lg rounded-md overflow-hidden">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              className="h-full w-full"
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </div>
        </div>
      )}

      <div className="px-4 py-3 w-full ">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="text-para w-full px-4 py-3 pr-12 border border-light-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none  min-h-[46px] max-h-[120px] text-sm overflow-y-auto"
              rows={1}
            />

            <div className="absolute right-3 bottom-4 flex items-center gap-1 ">
              {/* Image attachment button */}
              <button
                onClick={handleImageButtonClick}
                className="p-1.5 hover:bg-secondary/10 rounded transition-colors"
                title="Attach images"
              >
                <ImageIcon className="h-4 w-4 text-para-muted" />
              </button>
              <input
                ref={imageInputRef}
                type="file"
                className="hidden"
                accept=".mp3,.mp4,.mov,.avi,.mkv,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                multiple
                onChange={handleImageChange}
              />

              {/* File attachment button */}
              <button
                onClick={handleFileButtonClick}
                className="p-1.5 hover:bg-secondary/10 rounded transition-colors"
                title="Attach files"
              >
                <Paperclip className="h-4 w-4 text-para-muted" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
              />

              {/* <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                <AtSign className="h-4 w-4 text-para-muted" />
              </button> */}

              {/* Emoji toggle button - opens emoji picker */}
              <button
                ref={emojiButtonRef}
                onClick={(e) => {
                  setIsEmojiOpen((s) => !s);
                }}
                aria-expanded={isEmojiOpen}
                className="p-1.5 hover:bg-secondary/10 rounded transition-colors"
              >
                <Smile className="h-4 w-4 text-para-muted" />
              </button>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
            className={`px-3.5 flex-shrink-0 h-[42px] rounded-lg relative top-[-5px] transition-all duration-200 disabled:bg-primary/20 ${
              message.trim() || attachments.length > 0
                ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                : "bg-primary/50 text-white cursor-not-allowed"
            }`}
            title={editingMessage ? "Update message" : "Send message"}
          >
            {editingMessage ? (
              <span className="text-sm font-medium">Update</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export default MessageComposer;

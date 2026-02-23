import { RefObject } from "react";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/EmojiPicker";

interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onEmojiSelect: (emojiData: any) => void;
  emojiRef: RefObject<HTMLDivElement | null>;
}

export default function EmojiPickerPopover({
  isOpen,
  onEmojiSelect,
  emojiRef,
}: EmojiPickerPopoverProps) {
  if (!isOpen) return null;

  return (
    <div
      ref={emojiRef}
      className="absolute bottom-full mb-2 right-4 z-50 pointer-events-auto"
    >
      <div className="w-[280px] h-[420px] shadow-lg rounded-md overflow-hidden">
        <EmojiPicker
          onEmojiSelect={onEmojiSelect}
          className="h-full w-full"
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </div>
    </div>
  );
}

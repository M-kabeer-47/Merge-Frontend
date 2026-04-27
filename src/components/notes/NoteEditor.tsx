"use client";

import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import TextareaAutosize from "react-textarea-autosize";
import NoteNavbar from "./NoteNavbar";

interface NoteEditorProps {
  type: "create" | "update";
  initialTitle?: string;
  initialContent?: any;
  onSave?: (data: { title: string; content: string }) => Promise<void>;
  isSaving: boolean;
  onSuccess?: () => void;
}

const DRAFT_STORAGE_KEY = "note-draft";
const DRAFT_TTL_MS = 3 * 60 * 1000; // 3 minutes

const readFreshDraft = (): { title?: string; content?: string } | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw);
    const savedAt = draft?.timestamp ? Date.parse(draft.timestamp) : NaN;
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }
    return draft;
  } catch {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    return null;
  }
};

export default function NoteEditor({
  type,
  initialTitle = "",
  initialContent,
  onSave,
  isSaving,
  onSuccess,
}: NoteEditorProps) {
  const initializeTitle = () => {
    if (type === "update") {
      return initialTitle;
    }
    const draft = readFreshDraft();
    return draft?.title || "";
  };

  const [title, setTitle] = useState<string>(initializeTitle() || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [changesCount, setChangesCount] = useState(0);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // File upload handler for images and attachments in the editor
  const uploadFile = async (file: File) => {
    try {
      const attachmentType = file.type.startsWith("image/") ? "image" : "raw";
      const response = await uploadToCloudinary({ file, attachmentType });
      return response;
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed");
      throw error;
    }
  };

  // Initialize BlockNote editor
  const editor = useCreateBlockNote({ uploadFile: uploadFile });

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    if (type === "update" && e.target.value !== initialTitle) {
      setHasChanges(true);
    }
    // Trigger auto-save for create mode
    if (type === "create") {
      triggerAutoSave(e.target.value);
    }
  };

  // Auto-save function
  const triggerAutoSave = async (newTitle: string = title) => {
    if (type !== "create") return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const html = editor.blocksToFullHTML(editor.document);
        const noteData = {
          title: newTitle,
          content: html,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(noteData));
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 1000); // 30 seconds
  };

  // Handle editor content changes
  const handleEditorChange = () => {
    if (type === "update") {
      if (changesCount === 0) {
        setChangesCount((prev) => prev + 1);
      }
      if (changesCount === 1 || changesCount === 2) {
        setHasChanges(true);
        setChangesCount((prev) => prev + 1);
      }
    } else {
      // Trigger auto-save for create mode
      triggerAutoSave();
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (!onSave) return;

    // Validation
    if (!title.trim()) {
      toast.error("Please add a title for your note");
      return;
    }

    try {
      // Convert editor content to HTML
      const html = editor.blocksToFullHTML(editor.document);

      // Check if content is empty
      if (!html || html.trim() === "") {
        toast.error("Please add some content to your note");
        return;
      }

      await onSave({
        title: title,
        content: html,
      });

      // Clear draft from localStorage on successful save
      if (type === "create") {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      setHasChanges(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // Memoize event handlers
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  // Load initial content for update mode or draft for create mode
  useEffect(() => {
    if (type === "update" && initialContent) {
      const loadContent = () => {
        try {
          const blocks = editor.tryParseHTMLToBlocks(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          console.error("Failed to load note content:", error);
          toast.error("Failed to load note content");
        }
      };
      loadContent();
    } else if (type === "create") {
      // Load draft from localStorage if it's still within the TTL window
      const draftData = readFreshDraft();

      if (draftData) {
        if (draftData.content) {
          const blocks = editor.tryParseHTMLToBlocks(draftData.content);
          editor.replaceBlocks(editor.document, blocks);
        }
        if (draftData.title) {
          setTitle(draftData.title);
        }
      }
    }

    // Cleanup auto-save timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [type, initialContent]);

  return (
    <div className="min-h-screen flex flex-col bg-main-background">
      <NoteNavbar
        type={type}
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      {/* Unified Editor Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-6 sm:px-14 py-8">
          {/* Title Input */}
          <TextareaAutosize
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl sm:text-5xl font-bold font-raleway placeholder:text-para-muted/40 text-heading bg-transparent border-0 outline-none focus:ring-0 resize-none mb-4"
          />

          {/* BlockNote Editor */}

          <BlockNoteView
            editor={editor}
            theme="light"
            onChange={handleEditorChange}
            onScroll={handleScroll}
            onPaste={handlePaste}
          />
        </div>
      </div>
    </div>
  );
}

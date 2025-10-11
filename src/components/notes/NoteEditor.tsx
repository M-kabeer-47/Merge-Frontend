"use client";

import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import React, { useCallback, useEffect, useState } from "react";
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

export default function NoteEditor({
  type,
  initialTitle = "",
  initialContent,
  onSave,
  isSaving,
  onSuccess,
}: NoteEditorProps) {
  const [title, setTitle] = useState<string>(
    type === "update" ? initialTitle : ""
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [changesCount, setChangesCount] = useState(0);

  // File upload handler for images and attachments in the editor
  const uploadFile = async (file: File) => {
    try {
      const attachmentType = file.type.startsWith("image/") ? "image" : "raw";
      const response = await uploadToCloudinary({ file, attachmentType });
      return response;
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed");
      throw new Error("File upload failed");
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
      const html = await editor.blocksToFullHTML(editor.document);
      
      // Check if content is empty
      if (!html || html.trim() === "") {
        toast.error("Please add some content to your note");
        return;
      }

      await onSave({
        title: title.trim(),
        content: html,
      });

      setHasChanges(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  // Memoize event handlers
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
    },
    []
  );

  // Load initial content for update mode
  useEffect(() => {
    if (type === "update" && initialContent) {
      const loadContent = async () => {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          console.error("Failed to load note content:", error);
          toast.error("Failed to load note content");
        }
      };
      loadContent();
    }
  }, [type, initialContent]);

  return (
    <div className="h-screen flex flex-col bg-main-background">
      <NoteNavbar
        type={type}
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      {/* Unified Editor Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full  px-6 sm:px-14 py-8 overflow-y-auto">
          {/* Title Input */}
          <TextareaAutosize
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl sm:text-5xl font-bold font-raleway placeholder:text-para-muted/40 text-heading bg-transparent border-0 outline-none focus:ring-0 resize-none mb-4"
          />

          {/* BlockNote Editor */}
          <div className="max-w-none relative left-[-50px]">
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
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NoteEditor from "@/components/notes/NoteEditor";
import { toast } from "sonner";

const DynamicNoteEditor = dynamic(
  () => import("@/components/notes/NoteEditor"),
  { ssr: false }
);

export default function CreateNotePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (data: { title: string; content: string }) => {
    setIsSaving(true);
    try {
      // TODO: Replace this with actual API call when backend is ready
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data creation
      console.log("Creating note:", data);

      toast.success("Note created successfully!");

      // Redirect to notes page after successful creation
      setTimeout(() => {
        router.push("/notes");
      }, 500);
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DynamicNoteEditor type="create" onSave={handleSave} isSaving={isSaving} />
  );
}

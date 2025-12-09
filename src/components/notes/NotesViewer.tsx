import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";
import "@blocknote/shadcn/style.css";

interface NotesViewerProps {
  content: string;
  onReady?: () => void;
  noteTitle?: string;
}

export default function NotesViewer({ content, onReady }: NotesViewerProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { theme } = useTheme();
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (content && editor) {
      const loadContent = async () => {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(content);
          editor.replaceBlocks(editor.document, blocks);
          setIsEditorReady(true);
          if (onReady) {
            // Small delay to ensure rendering is complete
            setTimeout(onReady, 500);
          }
        } catch (error) {
          console.error("Failed to parse note content:", error);
          setIsEditorReady(true);
        }
      };
      loadContent();
    }
  }, [content, editor, onReady]);

  return (
    <div className="relative">
      {isEditorReady ? (
        <BlockNoteView
          editor={editor}
          editable={false}
          theme={theme as any}
        />
      ) : (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
        </div>
      )}
    </div>
  );
}

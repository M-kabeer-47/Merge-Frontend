import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import ChatComposer from "@/components/ai-assistant/ChatComposer";
import type { ContextFile } from "@/types/ai-chat";
import type { AttachmentUploadProgress } from "@/hooks/ai-assistant/use-upload-attachment";

interface WelcomeScreenProps {
  userName: string | undefined;
  onSendMessage: (message: string, files: ContextFile[]) => void;
  onAddContext: () => void;
  onUploadFile: (file: File) => void;
  contextFiles: ContextFile[];
  onRemoveContextFile: (fileId: string) => void;
  disabled: boolean;
  isStreaming?: boolean;
  uploadProgress?: AttachmentUploadProgress | null;
  attachmentCount?: number;
  maxAttachments?: number;
  atAttachmentCap?: boolean;
}

export default function WelcomeScreen({
  userName,
  onSendMessage,
  onAddContext,
  onUploadFile,
  contextFiles,
  onRemoveContextFile,
  disabled,
  isStreaming,
  uploadProgress,
  attachmentCount,
  maxAttachments,
  atAttachmentCap,
}: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-raleway font-bold text-heading mb-3">
          Good Morning, {userName || "there"}
        </h2>
        <p className="text-lg text-para mb-8">
          How Can I{" "}
          <span className="text-primary font-semibold">
            Assist You Today?
          </span>
        </p>
      </motion.div>
      <div className="w-full max-w-[700px] px-4">
        <ChatComposer
          onSendMessage={onSendMessage}
          onAddContext={onAddContext}
          onUploadFile={onUploadFile}
          contextFiles={contextFiles}
          onRemoveContextFile={onRemoveContextFile}
          disabled={disabled}
          isStreaming={isStreaming}
          uploadProgress={uploadProgress}
          attachmentCount={attachmentCount}
          maxAttachments={maxAttachments}
          atAttachmentCap={atAttachmentCap}
        />
      </div>
    </div>
  );
}

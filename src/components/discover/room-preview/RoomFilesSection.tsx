import { FileText } from "lucide-react";
import type { RoomFile } from "@/types/discover";
import { getFileIcon } from "./utils";

interface RoomFilesSectionProps {
  files: RoomFile[];
}

export default function RoomFilesSection({ files }: RoomFilesSectionProps) {
  if (files.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Files ({files.length})
      </h3>
      <div className="space-y-2">
        {files.slice(0, 3).map((file) => {
          const Icon = getFileIcon(file.type);
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-light-border hover:bg-secondary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">
                  {file.name}
                </p>
                <p className="text-xs text-para-muted">{file.size}</p>
              </div>
            </div>
          );
        })}
      </div>
      {files.length > 3 && (
        <p className="text-sm text-para-muted mt-2">
          +{files.length - 3} more files
        </p>
      )}
    </section>
  );
}

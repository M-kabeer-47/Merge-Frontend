import { FileText, Download } from "lucide-react";
import { downloadFile } from "@/utils/download-file";

type AssignmentFile = { name: string; url: string };

interface InstructionsSectionProps {
  description?: string;
  assignmentFiles?: AssignmentFile[];
}

export default function InstructionsSection({
  description,
  assignmentFiles,
}: InstructionsSectionProps) {
  const handleDownload = (file: AssignmentFile) => {
    downloadFile(file.url, file.name);
  };

  return (
    <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-heading mb-3">Instructions</h2>
      <div className="text-para text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
        {description}
      </div>

      {/* Assignment Files */}
      {assignmentFiles && assignmentFiles.length > 0 && (
        <div className="mt-5 pt-5 border-t border-light-border">
          <h3 className="text-sm font-semibold text-heading mb-3">
            Attachments
          </h3>
          <div className="flex flex-wrap gap-2">
            {assignmentFiles.map((file, index) => (
              <button
                key={index}
                onClick={() => handleDownload(file)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg
                  bg-secondary/5 border border-light-border
                  hover:border-primary/50 hover:bg-primary/5
                  transition-all duration-200 group"
              >
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm text-heading max-w-[200px] truncate">
                  {file.name}
                </span>
                <Download className="w-3.5 h-3.5 text-para-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

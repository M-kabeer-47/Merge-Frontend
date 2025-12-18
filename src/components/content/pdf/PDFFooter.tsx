"use client";

interface PDFFooterProps {
  fileName: string;
}

export default function PDFFooter({ fileName }: PDFFooterProps) {
  return (
    <div className="flex items-center justify-center py-2.5 bg-main-background border-t border-light-border text-sm text-para-muted shrink-0">
      <span className="truncate max-w-md" title={fileName}>
        {fileName}
      </span>
    </div>
  );
}

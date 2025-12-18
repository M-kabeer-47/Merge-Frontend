"use client";

import { RefObject } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, FileWarning } from "lucide-react";

interface PDFPageListProps {
  url: string;
  numPages: number | null;
  scale: number;
  rotation: number;
  loading: boolean;
  error: string | null;
  containerRef: RefObject<HTMLDivElement | null>;
  onLoadSuccess: (pdf: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
}

export default function PDFPageList({
  url,
  numPages,
  scale,
  rotation,
  loading,
  error,
  containerRef,
  onLoadSuccess,
  onLoadError,
}: PDFPageListProps) {
  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-background py-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <span className="text-para-muted">Loading PDF...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <FileWarning className="w-12 h-12 text-destructive" />
            <span className="text-lg font-medium text-heading">
              Failed to load PDF
            </span>
            <span className="text-sm text-para-muted">{error}</span>
          </div>
        </div>
      )}

      {/* PDF Document */}
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading=""
        className="flex flex-col items-center gap-6"
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <div
              key={`page_${i + 1}`}
              data-page-number={i + 1}
              className="shadow-xl rounded-lg overflow-hidden border border-light-border"
            >
              <Page
                pageNumber={i + 1}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="bg-white"
              />
            </div>
          ))}
      </Document>
    </div>
  );
}

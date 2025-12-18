"use client";

import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  RotateCw,
  X,
} from "lucide-react";

interface PDFToolbarProps {
  // Page state
  currentPage: number;
  setCurrentPage: (page: number) => void;
  numPages: number | null;

  // Zoom state
  scale: number;
  zoomIndex: number;
  setZoomIndex: (index: number) => void;
  zoomLevels: number[];

  // Other state
  isFullscreen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;

  // Actions
  onRotate: () => void;
  onDownload: () => void;
  onClose?: () => void;
}

export default function PDFToolbar({
  currentPage,
  setCurrentPage,
  numPages,
  scale,
  zoomIndex,
  setZoomIndex,
  zoomLevels,
  isFullscreen,
  containerRef,
  onRotate,
  onDownload,
  onClose,
}: PDFToolbarProps) {
  // Derived state
  const canZoomIn = zoomIndex < zoomLevels.length - 1;
  const canZoomOut = zoomIndex > 0;
  const canGoPrev = currentPage > 1;
  const canGoNext = numPages ? currentPage < numPages : false;

  // Page navigation
  const goToPrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setCurrentPage(Math.min(currentPage + 1, numPages));
    }
  };

  const goToPage = (page: number) => {
    if (numPages && page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    setZoomIndex(Math.min(zoomIndex + 1, zoomLevels.length - 1));
  };

  const zoomOut = () => {
    setZoomIndex(Math.max(zoomIndex - 1, 0));
  };

  const handleZoomChange = (level: number) => {
    const index = zoomLevels.indexOf(level);
    if (index !== -1) setZoomIndex(index);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-main-background border-b border-light-border shrink-0">
      {/* Left: Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPrevPage}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-para" />
        </button>

        <div className="flex items-center gap-2 text-sm text-para">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (!isNaN(page)) {
                goToPage(page);
              }
            }}
            className="w-12 px-2 py-1.5 text-center bg-background border border-light-border rounded-lg text-heading focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
            min={1}
            max={numPages || 1}
          />
          <span className="text-para-muted">of {numPages || "-"}</span>
        </div>

        <button
          onClick={goToNextPage}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-para" />
        </button>
      </div>

      {/* Center: Zoom controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={zoomOut}
          disabled={!canZoomOut}
          className="p-2 rounded-lg hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-para" />
        </button>

        <select
          value={scale}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="px-3 py-1.5 bg-background border border-light-border rounded-lg text-sm text-heading focus:outline-none focus:border-secondary cursor-pointer"
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {Math.round(level * 100)}%
            </option>
          ))}
        </select>

        <button
          onClick={zoomIn}
          disabled={!canZoomIn}
          className="p-2 rounded-lg hover:bg-secondary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-para" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onRotate}
          className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          aria-label="Rotate"
          title="Rotate"
        >
          <RotateCw className="w-5 h-5 text-para" />
        </button>

        <button
          onClick={onDownload}
          className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          aria-label="Download"
          title="Download"
        >
          <Download className="w-5 h-5 text-para" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5 text-para" />
          ) : (
            <Maximize className="w-5 h-5 text-para" />
          )}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors ml-2"
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5 text-para hover:text-destructive" />
          </button>
        )}
      </div>
    </div>
  );
}

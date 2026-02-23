"use client";

import { useState, useRef, useEffect } from "react";
import "@/lib/pdfjs/pdfjs";
import PDFToolbar from "./PDFToolbar";
import PDFPageList from "./PDFPageList";
import PDFFooter from "./PDFFooter";
import { downloadFile } from "@/utils/download-file";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];
const DEFAULT_ZOOM_INDEX = 3; // 125%

type Props = {
  url: string;
  fileName?: string;
  onClose?: () => void;
};

export default function PDFViewer({
  url,
  fileName = "document.pdf",
  onClose,
}: Props) {
  // State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesContainerRef = useRef<HTMLDivElement>(null);

  const scale = ZOOM_LEVELS[zoomIndex];

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Rotation
  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Document handlers
  const handleLoadSuccess = (pdf: { numPages: number }) => {
    setNumPages(pdf.numPages);
    setLoading(false);
    setError(null);
  };

  const handleLoadError = (err: Error) => {
    setError(err.message);
    setLoading(false);
  };

  // Download
  const handleDownload = () => {
    downloadFile(url, fileName);
  };

  // Scroll to page
  useEffect(() => {
    if (pagesContainerRef.current && !loading) {
      const pageElement = pagesContainerRef.current.querySelector(
        `[data-page-number="${currentPage}"]`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentPage, loading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      } else if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (numPages) {
          setCurrentPage((prev) => Math.min(prev + 1, numPages));
        }
      } else if (e.key === "+" || e.key === "=") {
        setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
      } else if (e.key === "-") {
        setZoomIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-background">
      <PDFToolbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numPages={numPages}
        scale={scale}
        zoomIndex={zoomIndex}
        setZoomIndex={setZoomIndex}
        zoomLevels={ZOOM_LEVELS}
        isFullscreen={isFullscreen}
        containerRef={containerRef}
        onRotate={rotate}
        onDownload={handleDownload}
        onClose={onClose}
      />

      <PDFPageList
        url={url}
        numPages={numPages}
        scale={scale}
        rotation={rotation}
        loading={loading}
        error={error}
        containerRef={pagesContainerRef}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
      />

      <PDFFooter fileName={fileName} />
    </div>
  );
}

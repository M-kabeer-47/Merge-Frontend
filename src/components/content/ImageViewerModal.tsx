"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState } from "react";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageName: string;
  onDownload?: () => void;
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  imageSrc,
  imageName,
  onDownload,
}: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setRotation(0);
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex flex-col"
        onClick={onClose}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white font-medium truncate max-w-[60%]">
            {imageName}
          </h2>
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <div className="w-px h-5 bg-white/30 mx-2" />
            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Rotate"
            >
              <RotateCw className="w-5 h-5 text-white" />
            </button>
            {/* Download */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Download"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="w-px h-5 bg-white/30 mx-2" />
            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Image container */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{ scale, rotate: rotation }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-full max-h-full"
          >
            <Image
              src={imageSrc}
              alt={imageName}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

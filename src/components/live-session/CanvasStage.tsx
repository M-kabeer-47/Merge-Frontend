/**
 * CanvasStage Component
 * 
 * Interactive whiteboard with drawing tools, shapes, and sticky notes.
 * Features toolbar with tool selection and canvas element manipulation.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MousePointer2,
  Pencil,
  Eraser,
  Square,
  Circle,
  ArrowRight,
  StickyNote,
  Type,
  Undo,
  Redo,
  Lock,
  Unlock,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import IconButton from "./IconButton";
import type { CanvasTool, CanvasElement } from "@/types/live-session";

interface CanvasStageProps {
  elements?: CanvasElement[];
  isLocked?: boolean;
  onAddElement?: (element: Omit<CanvasElement, "id">) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement?: (id: string) => void;
  onToggleLock?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onExport?: () => void;
}

export default function CanvasStage({
  elements = [],
  isLocked = false,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onToggleLock,
  onUndo,
  onRedo,
  onClear,
  onExport,
}: CanvasStageProps) {
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: "select" as CanvasTool, icon: MousePointer2, label: "Select", shortcut: "V" },
    { id: "pen" as CanvasTool, icon: Pencil, label: "Pen", shortcut: "P" },
    { id: "eraser" as CanvasTool, icon: Eraser, label: "Eraser", shortcut: "E" },
    { id: "rect" as CanvasTool, icon: Square, label: "Rectangle", shortcut: "R" },
    { id: "circle" as CanvasTool, icon: Circle, label: "Circle", shortcut: "C" },
    { id: "arrow" as CanvasTool, icon: ArrowRight, label: "Arrow", shortcut: "A" },
    { id: "sticky" as CanvasTool, icon: StickyNote, label: "Sticky Note", shortcut: "S" },
    { id: "text" as CanvasTool, icon: Type, label: "Text", shortcut: "T" },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toUpperCase();
      const tool = tools.find((t) => t.shortcut === key);
      if (tool) {
        setActiveTool(tool.id);
      }

      // Delete selected element
      if (key === "DELETE" && selectedElementId) {
        handleDeleteElement(selectedElementId);
      }

      // Undo/Redo
      if (e.ctrlKey || e.metaKey) {
        if (key === "Z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((key === "Z" && e.shiftKey) || key === "Y") {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId]);

  const handleToolSelect = (tool: CanvasTool) => {
    if (isLocked) {
      console.log("[Canvas] Cannot select tool - canvas is locked");
      return;
    }
    setActiveTool(tool);
    setSelectedElementId(null);
    console.log(`[Canvas] Tool changed: ${tool}`);
  };

  const handleElementClick = (elementId: string) => {
    if (isLocked || activeTool !== "select") return;
    setSelectedElementId(elementId === selectedElementId ? null : elementId);
    console.log(`[Canvas] Element ${elementId === selectedElementId ? "deselected" : "selected"}: ${elementId}`);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked || activeTool === "select" || e.target !== canvasRef.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / zoom) * 100;
    const y = ((e.clientY - rect.top) / zoom) * 100;

    // Create new element based on active tool
    const newElement: Omit<CanvasElement, "id"> = {
      type: activeTool === "pen" ? "drawing" : activeTool === "rect" || activeTool === "circle" ? "shape" : activeTool === "arrow" ? "arrow" : activeTool === "sticky" ? "sticky" : "text",
      x,
      y,
      width: activeTool === "sticky" ? 200 : 100,
      height: activeTool === "sticky" ? 150 : 100,
      color: activeTool === "sticky" ? "#fef3c7" : "#8668c0",
      content: activeTool === "sticky" ? "New Note" : activeTool === "text" ? "Text" : undefined,
    };

    onAddElement?.(newElement);
    console.log(`[Canvas] Added ${activeTool} element at (${Math.round(x)}, ${Math.round(y)})`);
  };

  const handleDeleteElement = (id: string) => {
    if (isLocked) {
      console.log("[Canvas] Cannot delete - canvas is locked");
      return;
    }
    onDeleteElement?.(id);
    setSelectedElementId(null);
    console.log(`[Canvas] Deleted element: ${id}`);
  };

  const handleUndo = () => {
    if (isLocked) {
      console.log("[Canvas] Cannot undo - canvas is locked");
      return;
    }
    onUndo?.();
    console.log("[Canvas] Undo action");
  };

  const handleRedo = () => {
    if (isLocked) {
      console.log("[Canvas] Cannot redo - canvas is locked");
      return;
    }
    onRedo?.();
    console.log("[Canvas] Redo action");
  };

  const handleClear = () => {
    if (isLocked) {
      console.log("[Canvas] Cannot clear - canvas is locked");
      return;
    }
    if (window.confirm("Clear all canvas elements? This cannot be undone.")) {
      onClear?.();
      setSelectedElementId(null);
      console.log("[Canvas] Canvas cleared");
    }
  };

  const handleExport = () => {
    onExport?.();
    console.log("[Canvas] Exporting canvas as image");
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleToggleLock = () => {
    onToggleLock?.();
    console.log(`[Canvas] Canvas ${isLocked ? "unlocked" : "locked"}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="px-4 py-3 bg-main-background border-b border-light-border">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 bg-secondary/5 p-1 rounded-lg">
            {tools.map((tool) => (
              <IconButton
                key={tool.id}
                icon={tool.icon}
                label={tool.label}
                onClick={() => handleToolSelect(tool.id)}
                isActive={activeTool === tool.id}
                disabled={isLocked}
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                shortcut={tool.shortcut}
              />
            ))}
          </div>

          <div className="h-6 w-px bg-light-border" />

          {/* Action Tools */}
          <div className="flex items-center gap-1">
            <IconButton
              icon={Undo}
              label="Undo"
              onClick={handleUndo}
              disabled={isLocked}
              variant="ghost"
              size="sm"
              shortcut="Ctrl+Z"
            />
            <IconButton
              icon={Redo}
              label="Redo"
              onClick={handleRedo}
              disabled={isLocked}
              variant="ghost"
              size="sm"
              shortcut="Ctrl+Y"
            />
          </div>

          <div className="h-6 w-px bg-light-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <IconButton
              icon={ZoomOut}
              label="Zoom Out"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              variant="ghost"
              size="sm"
            />
            <span className="px-2 py-1 text-xs font-medium text-para min-w-[50px] text-center">
              {zoom}%
            </span>
            <IconButton
              icon={ZoomIn}
              label="Zoom In"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              variant="ghost"
              size="sm"
            />
          </div>

          <div className="h-6 w-px bg-light-border" />

          {/* Utility Tools */}
          <div className="flex items-center gap-1">
            <IconButton
              icon={isLocked ? Lock : Unlock}
              label={isLocked ? "Unlock Canvas" : "Lock Canvas"}
              onClick={handleToggleLock}
              variant={isLocked ? "danger" : "ghost"}
              size="sm"
            />
            <IconButton
              icon={Trash2}
              label="Clear Canvas"
              onClick={handleClear}
              disabled={isLocked}
              variant="ghost"
              size="sm"
            />
            <IconButton
              icon={Download}
              label="Export"
              onClick={handleExport}
              variant="ghost"
              size="sm"
            />
          </div>

          {/* Delete Selected */}
          {selectedElementId && !isLocked && (
            <>
              <div className="h-6 w-px bg-light-border" />
              <button
                onClick={() => handleDeleteElement(selectedElementId)}
                className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete Selected
              </button>
            </>
          )}
        </div>

        {/* Lock Banner */}
        {isLocked && (
          <div className="mt-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <Lock className="w-4 h-4 text-destructive" />
            <p className="text-xs text-destructive font-medium">
              Canvas is locked. Click the lock icon to unlock and edit.
            </p>
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-4">
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`
            relative bg-white border-2 border-dashed border-light-border rounded-lg mx-auto
            ${isLocked ? "cursor-not-allowed" : activeTool === "select" ? "cursor-default" : "cursor-crosshair"}
          `}
          style={{
            width: `${zoom}%`,
            minWidth: "800px",
            height: "600px",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top left",
          }}
        >
          {/* Render Canvas Elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick(element.id);
              }}
              className={`
                absolute transition-all
                ${activeTool === "select" && !isLocked ? "cursor-move hover:ring-2 hover:ring-primary/50" : ""}
                ${selectedElementId === element.id ? "ring-2 ring-primary" : ""}
              `}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: element.width ? `${element.width}px` : "auto",
                height: element.height ? `${element.height}px` : "auto",
                transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
              }}
            >
              {/* Render based on element type */}
              {element.type === "shape" && (
                <div
                  className="w-full h-full border-2 rounded"
                  style={{
                    borderColor: element.color || "#8668c0",
                    backgroundColor: `${element.color || "#8668c0"}20`,
                  }}
                />
              )}

              {element.type === "arrow" && (
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <marker
                      id={`arrowhead-${element.id}`}
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3, 0 6"
                        fill={element.color || "#8668c0"}
                      />
                    </marker>
                  </defs>
                  <line
                    x1="10"
                    y1="50"
                    x2="90"
                    y2="50"
                    stroke={element.color || "#8668c0"}
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${element.id})`}
                  />
                </svg>
              )}

              {element.type === "sticky" && (
                <div
                  className="w-full h-full p-3 rounded-lg shadow-lg"
                  style={{
                    backgroundColor: element.color || "#fef3c7",
                  }}
                >
                  <p className="text-sm text-gray-800 font-handwriting">
                    {element.content || "New Note"}
                  </p>
                </div>
              )}

              {element.type === "text" && (
                <p
                  className="text-lg font-medium"
                  style={{ color: element.color || "#2f1a58" }}
                >
                  {element.content || "Text"}
                </p>
              )}

              {element.type === "drawing" && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: element.color || "#8668c0" }}
                />
              )}
            </div>
          ))}

          {/* Empty State */}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-para-muted">
                <Pencil className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Canvas is empty</p>
                <p className="text-sm mt-1">
                  Select a tool and click to start drawing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

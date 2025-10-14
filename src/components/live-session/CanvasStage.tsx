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
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [zoom, setZoom] = useState(100);
  const [strokeColor, setStrokeColor] = useState("#1e1e1e");
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Default demo shapes - Simple concept: Client-Server
  const [demoElements] = useState<CanvasElement[]>([
    // Title
    {
      id: "demo-title",
      type: "text",
      x: 300,
      y: 50,
      width: 300,
      height: 30,
      color: "#1e1e1e",
      content: "Client-Server Concept",
    },

    // Client box + label
    {
      id: "demo-client",
      type: "shape",
      x: 140,
      y: 260,
      width: 120,
      height: 70,
      color: "#1971c2",
      rotation: 0,
    },
    {
      id: "demo-client-text",
      type: "text",
      x: 170,
      y: 285,
      width: 80,
      height: 20,
      color: "#1e1e1e",
      content: "Client",
    },

    // Request arrow -> from Client to Server
    {
      id: "demo-arrow-request",
      type: "arrow",
      x: 260,
      y: 285,
      width: 80,
      height: 30,
      color: "#1e1e1e",
      rotation: 0, // right
    },
    {
      id: "demo-label-request",
      type: "text",
      x: 275,
      y: 270,
      width: 70,
      height: 20,
      color: "#1e1e1e",
      content: "Request",
    },

    // Server box + label
    {
      id: "demo-server",
      type: "shape",
      x: 360,
      y: 260,
      width: 140,
      height: 70,
      color: "#2f9e44",
      rotation: 0,
    },
    {
      id: "demo-server-text",
      type: "text",
      x: 395,
      y: 285,
      width: 80,
      height: 20,
      color: "#1e1e1e",
      content: "Server",
    },

    // Response arrow <- from Server to Client
    
    
    // Query arrow -> from Server to Database
    {
      id: "demo-arrow-query",
      type: "arrow",
      x: 500,
      y: 285,
      width: 80,
      height: 30,
      color: "#1e1e1e",
      rotation: 0, // right
    },
    {
      id: "demo-label-query",
      type: "text",
      x: 515,
      y: 270,
      width: 60,
      height: 20,
      color: "#1e1e1e",
      content: "Query",
    },

    // Database box + label
    {
      id: "demo-db",
      type: "shape",
      x: 580,
      y: 260,
      width: 140,
      height: 70,
      color: "#f08c00",
      rotation: 0,
    },
    {
      id: "demo-db-text",
      type: "text",
      x: 600,
      y: 285,
      width: 100,
      height: 20,
      color: "#1e1e1e",
      content: "Database",
    },

    // Result arrow <- from Database to Server
  

    // Sticky note with context
    {
      id: "demo-note",
      type: "sticky",
      x: 120,
      y: 120,
      width: 220,
      height: 110,
      color: "#fef3c7",
      content: "Stateless request-response pattern",
    },
  ]);

  const tools = [
    {
      id: "select" as CanvasTool,
      icon: MousePointer2,
      label: "Select",
      shortcut: "V",
    },
    {
      id: "rect" as CanvasTool,
      icon: Square,
      label: "Rectangle",
      shortcut: "R",
    },
    {
      id: "circle" as CanvasTool,
      icon: Circle,
      label: "Circle",
      shortcut: "C",
    },
    {
      id: "arrow" as CanvasTool,
      icon: ArrowRight,
      label: "Arrow",
      shortcut: "A",
    },
    { id: "pen" as CanvasTool, icon: Pencil, label: "Pen", shortcut: "P" },
    { id: "text" as CanvasTool, icon: Type, label: "Text", shortcut: "T" },
    {
      id: "sticky" as CanvasTool,
      icon: StickyNote,
      label: "Sticky Note",
      shortcut: "S",
    },
    {
      id: "eraser" as CanvasTool,
      icon: Eraser,
      label: "Eraser",
      shortcut: "E",
    },
  ];

  const strokeColors = [
    "#1e1e1e", // Black
    "#e03131", // Red
    "#2f9e44", // Green
    "#1971c2", // Blue
    "#f08c00", // Orange
  ];

  const backgroundColors = [
    "transparent", // None
    "#ffc9c9", // Light red
    "#b2f2bb", // Light green
    "#a5d8ff", // Light blue
    "#ffe066", // Light yellow
  ];

  const allElements = elements.length > 0 ? elements : demoElements;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
    console.log(
      `[Canvas] Element ${
        elementId === selectedElementId ? "deselected" : "selected"
      }: ${elementId}`
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked || activeTool === "select" || e.target !== canvasRef.current)
      return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / zoom) * 100;
    const y = ((e.clientY - rect.top) / zoom) * 100;

    // Create new element based on active tool
    const newElement: Omit<CanvasElement, "id"> = {
      type:
        activeTool === "pen"
          ? "drawing"
          : activeTool === "rect" || activeTool === "circle"
          ? "shape"
          : activeTool === "arrow"
          ? "arrow"
          : activeTool === "sticky"
          ? "sticky"
          : "text",
      x,
      y,
      width: activeTool === "sticky" ? 200 : 100,
      height: activeTool === "sticky" ? 150 : 100,
      color: strokeColor,
      content:
        activeTool === "sticky"
          ? "New Note"
          : activeTool === "text"
          ? "Text"
          : undefined,
    };

    onAddElement?.(newElement);
    console.log(
      `[Canvas] Added ${activeTool} element at (${Math.round(x)}, ${Math.round(
        y
      )})`
    );
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
    <div className="w-full h-full flex bg-[#fafafa] relative">
      {/* Left Sidebar - Color and Style Controls */}

      {/* Top Toolbar - Static Image */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <img
          src="/toolbar.png"
          alt="Canvas Toolbar"
          className="h-[44px] shadow-lg rounded-xl scale-150"
          style={{ userSelect: "none", pointerEvents: "none" }}
        />
      </div>

      {/* Undo/Redo - Top Left of Toolbar Area */}
      

      {/* Zoom Controls - Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200/80 px-2 py-1.5 flex items-center gap-2">
          <IconButton
            icon={ZoomOut}
            label="Zoom Out"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            variant="ghost"
            size="sm"
          />
          <span className="px-2 text-xs font-medium text-gray-600 min-w-[45px] text-center">
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
      </div>

      {/* Delete Selected - Top Right */}
      {selectedElementId && !isLocked && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => handleDeleteElement(selectedElementId)}
            className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 shadow-lg border border-gray-200/80"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Lock Banner */}
      {isLocked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="px-4 py-2 bg-white border border-red-200 rounded-lg flex items-center gap-2 shadow-lg">
            <Lock className="w-4 h-4 text-red-600" />
            <p className="text-xs text-red-600 font-medium">
              Canvas is locked. Click the lock icon to unlock and edit.
            </p>
          </div>
        </div>
      )}

      {/* Canvas Area - Full Width & Height */}
      <div className="w-full h-full overflow-hidden relative">
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`
            w-full h-full relative
            ${
              isLocked
                ? "cursor-not-allowed"
                : activeTool === "select"
                ? "cursor-default"
                : "cursor-crosshair"
            }
          `}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
          }}
        >
          {/* Render Canvas Elements */}
          {allElements.map((element) => (
            <div
              key={element.id}
              onClick={(e) => {
                e.stopPropagation();
                handleElementClick(element.id);
              }}
              className={`
                absolute transition-all rounded-sm
                ${
                  activeTool === "select" && !isLocked
                    ? "cursor-move hover:ring-2 hover:ring-blue-400"
                    : ""
                }
                ${
                  selectedElementId === element.id ? "ring-2 ring-blue-500" : ""
                }
              `}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: element.width ? `${element.width}px` : "auto",
                height: element.height ? `${element.height}px` : "auto",
                transform: element.rotation
                  ? `rotate(${element.rotation}deg)`
                  : undefined,
              }}
            >
              {/* Render based on element type */}
              {element.type === "shape" && (
                <div
                  className="w-full h-full border-2 rounded-lg"
                  style={{
                    borderColor: element.color || strokeColor,
                    backgroundColor:
                      backgroundColor !== "transparent"
                        ? `${backgroundColor}40`
                        : "transparent",
                  }}
                />
              )}

              {element.type === "arrow" && (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  style={{
                    transform: element.rotation
                      ? `rotate(${element.rotation}deg)`
                      : undefined,
                  }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${element.id}`}
                      markerWidth="12"
                      markerHeight="12"
                      refX="10"
                      refY="6"
                      orient="auto-start-reverse"
                    >
                      <polygon
                        points="0 0, 12 6, 0 12"
                        fill={element.color || strokeColor}
                      />
                    </marker>
                  </defs>
                  {/* Draw a horizontal line; container rotation handles direction */}
                  <line
                    x1="8"
                    y1="50"
                    x2="92"
                    y2="50"
                    stroke={element.color || strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    markerEnd={`url(#arrowhead-${element.id})`}
                  />
                </svg>
              )}

              {element.type === "sticky" && (
                <div
                  className="w-full h-full p-3 rounded-md shadow-md border border-gray-200"
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
                  className="text-[15px] leading-none font-medium"
                  style={{ color: element.color || strokeColor }}
                >
                  {element.content || "Text"}
                </p>
              )}

              {element.type === "drawing" && (
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M 10 50 Q 30 30, 50 50 T 90 50"
                    stroke={element.color || strokeColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          ))}

          {/* Empty State - Only show when no demo elements */}
          {allElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <Pencil className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium">Start drawing</p>
                <p className="text-sm mt-1">
                  Select a tool from the toolbar and click to begin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

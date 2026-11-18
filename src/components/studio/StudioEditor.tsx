"use client";

import { useEffect, useRef, useState } from "react";
import BrandColorPicker from "./BrandColorPicker";
import { brandColor, type BrandColorToken } from "../../lib/studio/brandColors";
import type { StudioElement } from "../../lib/studio/types";
import { canvasPresets, type CanvasPreset } from "../../lib/studio/canvasPresets";

const initialElements: StudioElement[] = [
  {
    id: "card-1",
    type: "card",
    x: 86,
    y: 432,
    width: 907,
    height: 432,
    rotation: 0,
    opacity: 100,
    color: "glass",
    radius: 24,
    visible: true,
    locked: false,
  },
  {
    id: "text-1",
    type: "text",
    x: 151,
    y: 540,
    width: 778,
    rotation: 0,
    opacity: 100,
    content: "Research meets technology.",
    color: "deep-plum",
    fontSize: 48,
    fontWeight: 700,
    visible: true,
    locked: false,
  },
];

type DragSession = {
  pointerId: number;
  elementId: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  scale: number;
};

type ResizeSession = {
  pointerId: number;
  elementId: string;
  startClientX: number;
  startClientY: number;
  startWidth: number;
  startHeight: number;
  scale: number;
};

type PanSession = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startScrollLeft: number;
  startScrollTop: number;
};

type AlignmentGuides = {
  vertical: number | null;
  horizontal: number | null;
};

export default function StudioEditor() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [elements, setElements] = useState<StudioElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>("text-1");
  const [backgroundColor, setBackgroundColor] = useState<BrandColorToken>("background");
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>("instagramPortrait");

  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);

  const [zoom, setZoom] = useState<number | "fit">("fit");
  const workspaceRef = useRef<HTMLElement | null>(null);
  const [workspaceSize, setWorkspaceSize] = useState({
    width: 448,
    height: 548,
  });

  const [activeTool, setActiveTool] = useState<"select" | "hand">("select");

  const [showCenterlines, setShowCenterlines] = useState(false);

  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuides>({
    vertical: null,
    horizontal: null,
  });

  const canvasSize = canvasPresets[canvasPreset];

  const dragSession = useRef<DragSession | null>(null);

  function handleDragStart(event: React.PointerEvent<HTMLDivElement>, element: StudioElement) {
    if (activeTool === "hand") return;

    if (element.locked) {
      return;
    }

    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    setSelectedId(element.id);

    const canvas = event.currentTarget.parentElement;
    if (!canvas) return;

    const actualScale = canvas.getBoundingClientRect().width / canvasSize.width;

    dragSession.current = {
      pointerId: event.pointerId,
      elementId: element.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: element.x,
      startY: element.y,
      scale: actualScale,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: React.PointerEvent<HTMLDivElement>) {
    const session = dragSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = (event.clientX - session.startClientX) / session.scale;
    const deltaY = (event.clientY - session.startClientY) / session.scale;

    const alignmentThreshold = 8;

    const activeElement = elements.find((element) => element.id === session.elementId);

    if (!activeElement) return;

    const elementHeight =
      activeElement.type === "card" ? activeElement.height : activeElement.fontSize * 1.2;

    const proposedX = session.startX + deltaX;
    const proposedY = session.startY + deltaY;

    const elementCenterX = proposedX + activeElement.width / 2;

    const elementCenterY = proposedY + elementHeight / 2;

    const canvasCenterX = canvasSize.width / 2;
    const canvasCenterY = canvasSize.height / 2;

    const alignedX = Math.abs(elementCenterX - canvasCenterX) <= alignmentThreshold;

    const alignedY = Math.abs(elementCenterY - canvasCenterY) <= alignmentThreshold;

    setAlignmentGuides({
      vertical: alignedX ? canvasCenterX : null,
      horizontal: alignedY ? canvasCenterY : null,
    });

    setElements((previous) =>
      previous.map((element) => {
        if (element.id !== session.elementId) return element;

        const maxX = Math.max(0, canvasSize.width - element.width);

        const maxY = Math.max(
          0,
          canvasSize.height - (element.type === "card" ? element.height : 0),
        );

        const nextX = snapValue(session.startX + deltaX);
        const nextY = snapValue(session.startY + deltaY);

        return {
          ...element,
          x: Math.max(0, Math.min(maxX, nextX)),
          y: Math.max(0, Math.min(maxY, nextY)),
        };
      }),
    );
  }

  function handleDragEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (dragSession.current?.pointerId !== event.pointerId) {
      return;
    }
    
    setAlignmentGuides({
      vertical: null,
      horizontal: null,
    });

    dragSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const resizeSession = useRef<ResizeSession | null>(null);

  function handleResizeStart(event: React.PointerEvent<HTMLButtonElement>, element: StudioElement) {
    if (activeTool === "hand") return;

    if (element.locked) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const canvas = event.currentTarget.closest('[data-studio-canvas="true"]');

    if (!canvas) return;

    const actualScale = canvas.getBoundingClientRect().width / canvasSize.width;

    resizeSession.current = {
      pointerId: event.pointerId,
      elementId: element.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startWidth: element.width,
      startHeight: element.type === "card" ? element.height : 0,
      scale: actualScale,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizeMove(event: React.PointerEvent<HTMLButtonElement>) {
    const session = resizeSession.current;

    if (!session || session.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = (event.clientX - session.startClientX) / session.scale;
    const deltaY = (event.clientY - session.startClientY) / session.scale;

    setElements((previous) =>
      previous.map((element) => {
        if (element.id !== session.elementId) return element;

        const maxWidth = Math.max(80, canvasSize.width - element.x);

        const newWidth = Math.max(
          80,
          Math.min(maxWidth, snapValue(element.x + session.startWidth + deltaX) - element.x),
        );

        if (element.type === "card") {
          const maxHeight = Math.max(60, canvasSize.height - element.y);

          const newHeight = Math.max(
            60,
            Math.min(maxHeight, snapValue(element.y + session.startHeight + deltaY) - element.y),
          );

          return {
            ...element,
            width: newWidth,
            height: newHeight,
          };
        }

        return {
          ...element,
          width: newWidth,
        };
      }),
    );
  }

  function handleResizeEnd(event: React.PointerEvent<HTMLButtonElement>) {
    if (resizeSession.current?.pointerId !== event.pointerId) {
      return;
    }

    resizeSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const panSession = useRef<PanSession | null>(null);

  function handlePanStart(event: React.PointerEvent<HTMLElement>) {
    if (activeTool !== "hand") return;

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const workspace = workspaceRef.current;
    if (!workspace) return;

    event.preventDefault();
    event.stopPropagation();

    panSession.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: workspace.scrollLeft,
      startScrollTop: workspace.scrollTop,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePanMove(event: React.PointerEvent<HTMLElement>) {
    const session = panSession.current;
    const workspace = workspaceRef.current;

    if (!session || !workspace) return;
    if (session.pointerId !== event.pointerId) return;

    workspace.scrollLeft = session.startScrollLeft - (event.clientX - session.startClientX);

    workspace.scrollTop = session.startScrollTop - (event.clientY - session.startClientY);
  }

  function handlePanEnd(event: React.PointerEvent<HTMLElement>) {
    if (panSession.current?.pointerId !== event.pointerId) {
      return;
    }

    panSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const workspacePadding = 48;

  const availableWidth = Math.max(1, workspaceSize.width - workspacePadding);

  const availableHeight = Math.max(1, workspaceSize.height - workspacePadding);

  const fitScale = Math.min(availableWidth / canvasSize.width, availableHeight / canvasSize.height);

  const scale = zoom === "fit" ? fitScale : zoom / 100;

  const previewWidth = canvasSize.width * scale;
  const previewHeight = canvasSize.height * scale;

  const displayedZoom = Math.round(scale * 100);

  function changeZoom(nextZoom: number) {
    setZoom(Math.max(25, Math.min(400, nextZoom)));
  }

  const selected = elements.find((el) => el.id === selectedId);

  function updateElement(id: string, changes: Partial<StudioElement>) {
    setElements((previous) =>
      previous.map((element) =>
        element.id === id && !element.locked
          ? ({ ...element, ...changes } as StudioElement)
          : element,
      ),
    );
  }

  function addText() {
    const id = crypto.randomUUID();

    setElements((previous) => [
      ...previous,
      {
        id,
        type: "text",
        x: 130,
        y: 200,
        width: 820,
        rotation: 0,
        opacity: 100,
        content: "New text",
        color: "deep-plum",
        fontSize: 40,
        fontWeight: 700,
        visible: true,
        locked: false,
      },
    ]);

    setSelectedId(id);
  }

  function addCard() {
    const id = crypto.randomUUID();

    setElements((previous) => [
      ...previous,
      {
        id,
        type: "card",
        x: 130,
        y: 340,
        width: 820,
        height: 340,
        rotation: 0,
        opacity: 100,
        color: "glass",
        radius: 24,
        visible: true,
        locked: false,
      },
    ]);

    setSelectedId(id);
  }

  function deleteSelected() {
    if (!selectedId) return;

    const selectedElement = elements.find((element) => element.id === selectedId);

    if (!selectedElement || selectedElement.locked) {
      return;
    }

    setElements((previous) =>
      previous.filter((element) => element.id !== selectedId || element.locked),
    );

    setSelectedId(null);
  }

  function toggleVisibility(id: string) {
    setElements((previous) =>
      previous.map((element) =>
        element.id === id ? { ...element, visible: !element.visible } : element,
      ),
    );
  }

  function toggleLock(id: string) {
    setElements((previous) =>
      previous.map((element) =>
        element.id === id ? { ...element, locked: !element.locked } : element,
      ),
    );
  }

  type LayerMove = "front" | "forward" | "backward" | "back";

  function moveLayer(id: string, direction: LayerMove) {
    setElements((previous) => {
      const currentIndex = previous.findIndex((element) => element.id === id);

      if (currentIndex === -1) return previous;

      const element = previous[currentIndex];

      // Locked layers cannot be reordered.
      if (element.locked) return previous;

      const lastIndex = previous.length - 1;

      const targetIndex =
        direction === "front"
          ? lastIndex
          : direction === "forward"
            ? Math.min(currentIndex + 1, lastIndex)
            : direction === "backward"
              ? Math.max(currentIndex - 1, 0)
              : 0;

      if (targetIndex === currentIndex) return previous;

      const updated = [...previous];

      updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, element);

      return updated;
    });
  }

  function snapValue(value: number) {
    if (!snapToGrid) {
      return Math.round(value);
    }

    return Math.round(value / gridSize) * gridSize;
  }

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    const measureWorkspace = () => {
      setWorkspaceSize({
        width: workspace.clientWidth,
        height: workspace.clientHeight,
      });
    };

    measureWorkspace();

    const observer = new ResizeObserver(measureWorkspace);
    observer.observe(workspace);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <div
        className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
        style={{
          background: brandColor("surface"),
          color: brandColor("foreground"),
          borderColor: brandColor("border"),
        }}
      >
        <span className="font-semibold">Design Editor</span>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addText} className="rounded-xl border px-3 py-2 text-sm">
            + Text
          </button>
          <button type="button" onClick={addCard} className="rounded-xl border px-3 py-2 text-sm">
            + Card
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            {mode === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <select
            aria-label="Canvas format"
            value={canvasPreset}
            onChange={(event) => setCanvasPreset(event.target.value as CanvasPreset)}
            className="rounded-xl border px-3 py-2 text-sm text-[#241C22]"
          >
            {Object.entries(canvasPresets).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.label} ({preset.width} × {preset.height})
              </option>
            ))}
          </select>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(event) => setShowGrid(event.target.checked)}
                className="accent-pink-500"
              />
              Show Grid
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(event) => setSnapToGrid(event.target.checked)}
                className="accent-pink-500"
              />
              Snap
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCenterlines}
                onChange={(event) => setShowCenterlines(event.target.checked)}
              />
              Centerlines
            </label>

            <label className="flex items-center gap-2 text-sm">
              Spacing
              <select
                aria-label="Grid spacing"
                value={gridSize}
                onChange={(event) => setGridSize(Number(event.target.value))}
                className="rounded-lg border px-2 py-1 text-[#241C22]"
              >
                {[10, 20, 25, 40, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-xl border p-1">
            <button
              type="button"
              onClick={() => setActiveTool("select")}
              aria-pressed={activeTool === "select"}
              className={`rounded-lg px-3 py-2 text-sm ${
                activeTool === "select" ? "bg-pink-500 text-white" : "hover:bg-pink-50"
              }`}
            >
              Select
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("hand")}
              aria-pressed={activeTool === "hand"}
              className={`rounded-lg px-3 py-2 text-sm ${
                activeTool === "hand" ? "bg-pink-500 text-white" : "hover:bg-pink-50"
              }`}
            >
              Hand
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
            <button
              type="button"
              onClick={() => changeZoom(displayedZoom - 25)}
              aria-label="Zoom out"
              className="rounded-lg border px-2 py-1 text-sm"
            >
              −
            </button>

            <span className="min-w-12 text-center text-sm tabular-nums">{displayedZoom}%</span>

            <button
              type="button"
              onClick={() => changeZoom(displayedZoom + 25)}
              aria-label="Zoom in"
              className="rounded-lg border px-2 py-1 text-sm"
            >
              +
            </button>

            <button
              type="button"
              onClick={() => setZoom("fit")}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              Fit
            </button>

            <button
              type="button"
              onClick={() => setZoom(100)}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      <div
        className="grid min-h-150 items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)_280px]"
        style={{ color: brandColor("foreground") }}
      >
        {/* Layers */}
        <aside
          className="rounded-2xl border p-4"
          style={{
            background: brandColor("surface"),
            borderColor: brandColor("border"),
          }}
        >
          <h2 className="mb-4 font-bold">Layers</h2>

          <div className="space-y-2">
            {[...elements].reverse().map((element) => (
              <div
                key={element.id}
                className={`flex items-center gap-2 rounded-lg border p-2 ${
                  selectedId === element.id ? "border-pink-400 bg-pink-50" : "border-neutral-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(element.id)}
                  className={`min-w-0 flex-1 truncate text-left text-sm ${
                    element.visible ? "" : "opacity-40"
                  }`}
                >
                  {element.type === "text" ? element.content || "Text" : "Glass Card"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleVisibility(element.id)}
                  title={element.visible ? "Hide layer" : "Show layer"}
                  aria-label={element.visible ? "Hide layer" : "Show layer"}
                  className="shrink-0 rounded-md p-1.5 hover:bg-neutral-100"
                >
                  {element.visible ? "◉" : "○"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleLock(element.id)}
                  title={element.locked ? "Unlock layer" : "Lock layer"}
                  aria-label={element.locked ? "Unlock layer" : "Lock layer"}
                  className="shrink-0 rounded-md p-1.5 text-xs hover:bg-neutral-100"
                >
                  {element.locked ? "🔒" : "🔓"}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="w-full rounded-xl border p-3 text-left text-sm"
            >
              Background
            </button>
          </div>
        </aside>

        {/* Canvas */}
        <section
          ref={workspaceRef}
          className="h-150 min-w-0 overflow-auto rounded-2xl border bg-neutral-200 p-6"
          onPointerDownCapture={(event) => {
            if (activeTool === "hand") {
              handlePanStart(event);
            }
          }}
          onPointerMove={handlePanMove}
          onPointerUp={handlePanEnd}
          onPointerCancel={handlePanEnd}
          style={{
            cursor: activeTool === "hand" ? "grab" : "default",
            touchAction: activeTool === "hand" ? "none" : "auto",
          }}
        >
          <div className="flex min-h-full w-max min-w-full items-center justify-center">
            <div
              className="relative shrink-0 overflow-hidden shadow-xl"
              style={{
                width: previewWidth,
                height: previewHeight,

                background: brandColor(backgroundColor),
              }}
              data-studio-canvas="true"
              onClick={() => {
                if (activeTool === "select") {
                  setSelectedId(null);
                }
              }}
            >
              {showGrid && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    backgroundImage: `
                  linear-gradient(
                  to right,
                rgba(180, 75, 125, 0.25) 1px,
                  transparent 1px
                  ),
                  linear-gradient(
                  to bottom,
                  rgba(180, 75, 125, 0.25) 1px,
                  transparent 1px
                  )
                  `,
                    backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
                  }}
                />
              )}

              {showCenterlines && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30">
                  {/* Vertical centerline */}
                  <div
                    className="absolute inset-y-0"
                    style={{
                      left: "50%",
                      width: 1,
                      backgroundColor: "#00B8D9",
                    }}
                  />

                  {/* Horizontal centerline */}
                  <div
                    className="absolute inset-x-0"
                    style={{
                      top: "50%",
                      height: 1,
                      backgroundColor: "#00B8D9",
                    }}
                  />

                  {/* Center intersection */}
                  <div
                    className="absolute size-2 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      backgroundColor: "#00B8D9",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
              )}

              {(alignmentGuides.vertical !== null || alignmentGuides.horizontal !== null) && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-40">
                  {alignmentGuides.vertical !== null && (
                    <div
                      className="absolute inset-y-0"
                      style={{
                        left: alignmentGuides.vertical * scale,
                        width: 1,
                        backgroundColor: "#E11D8A",
                      }}
                    />
                  )}

                  {alignmentGuides.horizontal !== null && (
                    <div
                      className="absolute inset-x-0"
                      style={{
                        top: alignmentGuides.horizontal * scale,
                        height: 1,
                        backgroundColor: "#E11D8A",
                      }}
                    />
                  )}
                </div>
              )}

              {elements
                .filter((element) => element.visible)
                .map((element) => {
                  const commonStyle = {
                    position: "absolute" as const,
                    left: element.x * scale,
                    top: element.y * scale,
                    width: element.width * scale,
                    opacity: element.opacity / 100,
                    transform: `rotate(${element.rotation}deg)`,
                    cursor: "pointer",
                    outline:
                      selectedId === element.id ? `2px solid ${brandColor("accent")}` : "none",
                    touchAction: "none" as const,
                    userSelect: "none" as const,
                  };

                  if (element.type === "card") {
                    return (
                      <div
                        key={element.id}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (activeTool === "select") {
                            setSelectedId(element.id);
                          }
                        }}
                        style={{
                          ...commonStyle,
                          height: element.height * scale,
                          background: brandColor(element.color),
                          borderRadius: element.radius * scale,
                          border: `1px solid ${brandColor("glass-border")}`,
                          backdropFilter: "blur(16px)",
                        }}
                        onPointerDown={(event) => handleDragStart(event, element)}
                        onPointerMove={handleDragMove}
                        onPointerUp={handleDragEnd}
                        onPointerCancel={handleDragEnd}
                      >
                        {selectedId === element.id && !element.locked && (
                          <button
                            type="button"
                            aria-label={`Resize ${element.type}`}
                            title="Drag to resize"
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => handleResizeStart(event, element)}
                            onPointerMove={handleResizeMove}
                            onPointerUp={handleResizeEnd}
                            onPointerCancel={handleResizeEnd}
                            className="absolute -right-1.5 -bottom-1.5 z-10 size-3 cursor-nwse-resize rounded-sm border-2 border-white bg-[#C42B70] shadow-sm"
                            style={{ touchAction: "none" }}
                          />
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={element.id}
                      onClick={(event) => {
                        event.stopPropagation();

                        if (activeTool === "select") {
                          setSelectedId(element.id);
                        }
                      }}
                      style={{
                        ...commonStyle,
                        color: brandColor(element.color),
                        fontSize: element.fontSize * scale,
                        fontWeight: element.fontWeight,
                        lineHeight: 1.15,
                        overflowWrap: "anywhere",
                      }}
                      onPointerDown={(event) => handleDragStart(event, element)}
                      onPointerMove={handleDragMove}
                      onPointerUp={handleDragEnd}
                      onPointerCancel={handleDragEnd}
                    >
                      {element.content}

                      {selectedId === element.id && !element.locked && (
                        <button
                          type="button"
                          aria-label={`Resize ${element.type}`}
                          title="Drag to resize"
                          onClick={(event) => event.stopPropagation()}
                          onPointerDown={(event) => handleResizeStart(event, element)}
                          onPointerMove={handleResizeMove}
                          onPointerUp={handleResizeEnd}
                          onPointerCancel={handleResizeEnd}
                          className="absolute -right-1.5 -bottom-1.5 z-10 size-3 cursor-nwse-resize rounded-sm border-2 border-white bg-[#C42B70] shadow-sm"
                          style={{ touchAction: "none" }}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Properties */}
        <aside
          className="min-h-0 rounded-2xl border p-4 lg:h-150 lg:overflow-y-auto"
          style={{
            background: brandColor("surface"),
            borderColor: brandColor("border"),
          }}
        >
          <h2 className="mb-4 font-bold">Properties</h2>

          {selected ? (
            <div className="space-y-5">
              <p className="text-sm capitalize">Selected: {selected.type}</p>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Layer order</p>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["front", "To Front"],
                      ["forward", "Forward"],
                      ["backward", "Backward"],
                      ["back", "To Back"],
                    ] as const
                  ).map(([direction, label]) => (
                    <button
                      key={direction}
                      type="button"
                      disabled={selected.locked}
                      onClick={() => moveLayer(selected.id, direction)}
                      className="rounded-lg border px-2 py-2 text-xs transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {selected.type === "text" && (
                <>
                  <label className="block text-sm">
                    Text content
                    <textarea
                      value={selected.content}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          content: e.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-lg border p-2 text-[#241C22]"
                      rows={3}
                    />
                  </label>

                  <label className="block text-sm">
                    Font size: {selected.fontSize}px
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={selected.fontSize}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>

                  <label className="block text-sm">
                    Font weight
                    <select
                      value={selected.fontWeight}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          fontWeight: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full rounded-lg border p-2 text-[#241C22]"
                    >
                      {[400, 500, 600, 700, 800].map((weight) => (
                        <option key={weight} value={weight}>
                          {weight}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {selected.type === "card" && (
                <label className="block text-sm">
                  Corner radius: {selected.radius}px
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={selected.radius}
                    onChange={(e) =>
                      updateElement(selected.id, {
                        radius: Number(e.target.value),
                      })
                    }
                    className="mt-2 w-full"
                  />
                </label>
              )}

              <label className="block text-sm">
                Width: {selected.width}px
                <input
                  type="number"
                  min={80}
                  max={canvasSize.width}
                  value={selected.width}
                  onChange={(event) =>
                    updateElement(selected.id, {
                      width: Math.max(
                        80,
                        Math.min(canvasSize.width - selected.x, Number(event.target.value) || 80),
                      ),
                    })
                  }
                  className="mt-2 w-full rounded-lg border p-2"
                />
              </label>

              {selected.type === "card" && (
                <label className="block text-sm">
                  Height: {selected.height}px
                  <input
                    type="number"
                    min={60}
                    max={canvasSize.height}
                    value={selected.height}
                    onChange={(event) =>
                      updateElement(selected.id, {
                        height: Math.max(
                          60,
                          Math.min(
                            canvasSize.height - selected.y,
                            Number(event.target.value) || 60,
                          ),
                        ),
                      })
                    }
                    className="mt-2 w-full rounded-lg border p-2"
                  />
                </label>
              )}

              {(["x", "y", "rotation", "opacity"] as const).map((property) => {
                const ranges = {
                  x: [0, canvasSize.width],
                  y: [0, canvasSize.height],
                  rotation: [-180, 180],
                  opacity: [0, 100],
                };

                return (
                  <label key={property} className="block text-sm">
                    <span className="capitalize">
                      {property}: {selected[property]}
                    </span>
                    <input
                      type="range"
                      min={ranges[property][0]}
                      max={ranges[property][1]}
                      value={selected[property]}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          [property]: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                  </label>
                );
              })}

              <BrandColorPicker
                label="Element color"
                value={selected.color}
                onChange={(color) => updateElement(selected.id, { color })}
                mode={mode}
              />

              <button
                type="button"
                onClick={deleteSelected}
                disabled={selected.locked}
                title={
                  selected.locked
                    ? "Unlock this layer before deleting it"
                    : "Delete selected element"
                }
                className="w-full rounded-xl border border-red-400 p-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {selected.locked ? "Layer Locked" : "Delete Element"}
              </button>
            </div>
          ) : (
            <BrandColorPicker
              label="Background color"
              value={backgroundColor}
              onChange={setBackgroundColor}
              mode={mode}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

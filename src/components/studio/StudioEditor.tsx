"use client";

import { useRef, useState } from "react";
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

export default function StudioEditor() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [elements, setElements] = useState<StudioElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>("text-1");
  const [backgroundColor, setBackgroundColor] = useState<BrandColorToken>("background");
  const [canvasPreset, setCanvasPreset] = useState<CanvasPreset>("instagramPortrait");

  const canvasSize = canvasPresets[canvasPreset];

  const dragSession = useRef<DragSession | null>(null);

  function handleDragStart(event: React.PointerEvent<HTMLDivElement>, element: StudioElement) {
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

    setElements((previous) =>
      previous.map((element) => {
        if (element.id !== session.elementId) return element;

        return {
          ...element,
          x: Math.round(
            Math.max(0, Math.min(canvasSize.width - element.width, session.startX + deltaX)),
          ),
          y: Math.round(
            Math.max(
              0,
              Math.min(
                canvasSize.height - (element.type === "card" ? element.height : 0),
                session.startY + deltaY,
              ),
            ),
          ),
        };
      }),
    );
  }

  function handleDragEnd(event: React.PointerEvent<HTMLDivElement>) {
    if (dragSession.current?.pointerId !== event.pointerId) {
      return;
    }

    dragSession.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const resizeSession = useRef<ResizeSession | null>(null);

  function handleResizeStart(event: React.PointerEvent<HTMLButtonElement>, element: StudioElement) {
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

        const newWidth = Math.round(
          Math.max(80, Math.min(canvasSize.width - element.x, session.startWidth + deltaX)),
        );

        if (element.type === "card") {
          const newHeight = Math.round(
            Math.max(60, Math.min(canvasSize.height - element.y, session.startHeight + deltaY)),
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

  const previewMaxWidth = 400;
  const previewMaxHeight = 500;

  const scale = Math.min(previewMaxWidth / canvasSize.width, previewMaxHeight / canvasSize.height);

  const previewWidth = canvasSize.width * scale;
  const previewHeight = canvasSize.height * scale;

  const selected = elements.find((el) => el.id === selectedId);

  function updateElement(id: string, changes: Partial<StudioElement>) {
    setElements((previous) =>
      previous.map((element) =>
        element.id === id ? ({ ...element, ...changes } as StudioElement) : element,
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
      },
    ]);

    setSelectedId(id);
  }

  function deleteSelected() {
    if (!selectedId) return;

    setElements((previous) => previous.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }

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
              <button
                key={element.id}
                type="button"
                onClick={() => setSelectedId(element.id)}
                className="w-full rounded-xl border p-3 text-left text-sm"
                style={{
                  borderColor:
                    selectedId === element.id ? brandColor("accent") : brandColor("border"),
                  background:
                    selectedId === element.id ? brandColor("surface-soft") : "transparent",
                }}
              >
                {element.type === "text" ? element.content.slice(0, 24) : "Glass Card"}
              </button>
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
        <section className="flex h-150 min-w-0 items-center justify-center overflow-auto rounded-2xl border bg-neutral-200 p-6">
          <div
            className="relative shrink-0 overflow-hidden shadow-xl"
            style={{
              width: previewWidth,
              height: previewHeight,
              maxWidth: "100%",
              background: brandColor(backgroundColor),
            }}
            data-studio-canvas="true"
            onClick={() => setSelectedId(null)}
          >
            {elements.map((element) => {
              const commonStyle = {
                position: "absolute" as const,
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                opacity: element.opacity / 100,
                transform: `rotate(${element.rotation}deg)`,
                cursor: "pointer",
                outline: selectedId === element.id ? `2px solid ${brandColor("accent")}` : "none",
                touchAction: "none" as const,
                userSelect: "none" as const,
              };

              if (element.type === "card") {
                return (
                  <div
                    key={element.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(element.id);
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
                    {selectedId === element.id && (
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
                    setSelectedId(element.id);
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

                  {selectedId === element.id && (
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
                className="w-full rounded-xl border border-red-400 p-3 text-sm"
              >
                Delete Element
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

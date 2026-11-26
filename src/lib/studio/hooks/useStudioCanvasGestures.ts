"use client";

import { useEffect, useRef } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from "react";
import { flushSync } from "react-dom";

type Point = {
  x: number;
  y: number;
};

type GestureSession = {
  pointerIds: [number, number];
  startDistance: number;
  startZoom: number;
  anchorX: number;
  anchorY: number;
};

type StudioCanvasGestureOptions = {
  workspaceRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
  scale: number;
  minZoom: number;
  maxZoom: number;
  disabled: boolean;
  onZoomChange: (zoom: number) => void;
  onCancelInteraction: () => void;
};

function getPoint(event: ReactPointerEvent<HTMLElement>): Point {
  return {
    x: event.clientX,
    y: event.clientY,
  };
}

function getDistance(first: Point, second: Point): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function getMidpoint(first: Point, second: Point): Point {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

export default function useStudioCanvasGestures({
  workspaceRef,
  canvasRef,
  scale,
  minZoom,
  maxZoom,
  disabled,
  onZoomChange,
  onCancelInteraction,
}: StudioCanvasGestureOptions) {
  const touchesRef = useRef(new Map<number, Point>());

  const gestureRef = useRef<GestureSession | null>(null);

  const pencilPointerRef = useRef<number | null>(null);

  const blockedPointersRef = useRef(new Set<number>());

  const suppressClickRef = useRef(false);

  function consumeEvent(event: ReactPointerEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function capturePointer(workspace: HTMLElement, pointerId: number) {
    try {
      workspace.setPointerCapture(pointerId);
    } catch {
      // The pointer may have already ended.
    }
  }

  function releasePointer(workspace: HTMLElement, pointerId: number) {
    if (workspace.hasPointerCapture(pointerId)) {
      workspace.releasePointerCapture(pointerId);
    }
  }

  function handlePointerDownCapture(event: ReactPointerEvent<HTMLElement>): boolean {
    if (disabled) return true;

    const workspace = workspaceRef.current;
    const canvas = canvasRef.current;

    if (!workspace || !canvas) return false;

    const pointerId = event.pointerId;

    if (
      touchesRef.current.size === 0 &&
      pencilPointerRef.current === null &&
      blockedPointersRef.current.size === 0
    ) {
      suppressClickRef.current = false;
    }

    // Preserve native editing interactions.
    if (
      event.target instanceof Element &&
      event.target.closest("textarea, input, select, [contenteditable='true']")
    ) {
      return false;
    }

    // Apple Pencil takes priority over finger contact.
    if (event.pointerType === "pen") {
      if (pencilPointerRef.current !== null) {
        consumeEvent(event);
        return true;
      }

      if (touchesRef.current.size > 0) {
        onCancelInteraction();

        for (const id of touchesRef.current.keys()) {
          blockedPointersRef.current.add(id);
          capturePointer(workspace, id);
        }

        touchesRef.current.clear();
        gestureRef.current = null;
      }

      pencilPointerRef.current = pointerId;

      return false;
    }

    // Preserve standard desktop pointer behavior.
    if (event.pointerType !== "touch") {
      return false;
    }

    // Ignore palm/finger contact during Pencil editing.
    if (pencilPointerRef.current !== null) {
      blockedPointersRef.current.add(pointerId);

      capturePointer(workspace, pointerId);
      consumeEvent(event);

      return true;
    }

    touchesRef.current.set(pointerId, getPoint(event));

    // First finger continues through the existing editor.
    if (touchesRef.current.size === 1) {
      return false;
    }

    suppressClickRef.current = true;

    // Additional fingers must not start element interactions.
    if (gestureRef.current) {
      capturePointer(workspace, pointerId);
      consumeEvent(event);

      return true;
    }

    const entries = Array.from(touchesRef.current.entries());

    const [firstId, first] = entries[0];
    const [secondId, second] = entries[1];

    const midpoint = getMidpoint(first, second);

    const canvasRect = canvas.getBoundingClientRect();

    const startDistance = Math.max(1, getDistance(first, second));

    // Cancel accidental single-finger edits before navigating.
    onCancelInteraction();

    gestureRef.current = {
      pointerIds: [firstId, secondId],
      startDistance,
      startZoom: scale * 100,
      anchorX: (midpoint.x - canvasRect.left) / scale,
      anchorY: (midpoint.y - canvasRect.top) / scale,
    };

    for (const id of touchesRef.current.keys()) {
      capturePointer(workspace, id);
    }

    consumeEvent(event);

    return true;
  }

  function handlePointerMoveCapture(event: ReactPointerEvent<HTMLElement>): boolean {
    if (disabled) return true;

    const pointerId = event.pointerId;

    if (blockedPointersRef.current.has(pointerId)) {
      consumeEvent(event);
      return true;
    }

    if (event.pointerType !== "touch") {
      return false;
    }

    if (!touchesRef.current.has(pointerId)) {
      return false;
    }

    touchesRef.current.set(pointerId, getPoint(event));

    const gesture = gestureRef.current;

    if (!gesture) {
      return false;
    }

    const workspace = workspaceRef.current;
    const canvas = canvasRef.current;

    if (!workspace || !canvas) {
      consumeEvent(event);
      return true;
    }

    const first = touchesRef.current.get(gesture.pointerIds[0]);

    const second = touchesRef.current.get(gesture.pointerIds[1]);

    if (!first || !second) {
      consumeEvent(event);
      return true;
    }

    const midpoint = getMidpoint(first, second);

    const distance = getDistance(first, second);

    const ratio = distance / gesture.startDistance;

    const nextZoom = Math.max(minZoom, Math.min(maxZoom, gesture.startZoom * ratio));

    const nextScale = nextZoom / 100;

    // Apply zoom before measuring the new canvas position.
    if (Math.abs(nextZoom - scale * 100) > 0.01) {
      flushSync(() => {
        onZoomChange(nextZoom);
      });
    }

    const nextCanvasRect = canvas.getBoundingClientRect();

    const anchorClientX = nextCanvasRect.left + gesture.anchorX * nextScale;

    const anchorClientY = nextCanvasRect.top + gesture.anchorY * nextScale;

    // Keep the same artwork point under the gesture midpoint.
    // Movement of the midpoint also creates two-finger panning.
    workspace.scrollLeft += anchorClientX - midpoint.x;
    workspace.scrollTop += anchorClientY - midpoint.y;

    consumeEvent(event);

    return true;
  }

  function handlePointerEndCapture(event: ReactPointerEvent<HTMLElement>): boolean {
    const pointerId = event.pointerId;
    const workspace = workspaceRef.current;

    if (blockedPointersRef.current.has(pointerId)) {
      blockedPointersRef.current.delete(pointerId);

      if (workspace) {
        releasePointer(workspace, pointerId);
      }

      consumeEvent(event);

      return true;
    }

    if (pencilPointerRef.current === pointerId) {
      pencilPointerRef.current = null;

      return false;
    }

    const gesture = gestureRef.current;

    const wasTracked = touchesRef.current.delete(pointerId);

    if (!wasTracked || !gesture) {
      return false;
    }

    // Do not allow the remaining finger to begin dragging artwork
    // after one finger has been lifted.
    if (gesture.pointerIds.includes(pointerId)) {
      gestureRef.current = null;

      for (const id of touchesRef.current.keys()) {
        blockedPointersRef.current.add(id);
      }

      touchesRef.current.clear();
    }

    if (workspace) {
      releasePointer(workspace, pointerId);
    }

    suppressClickRef.current = true;

    consumeEvent(event);

    return true;
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLElement>) {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    const touches = touchesRef.current;
    const blockedPointers = blockedPointersRef.current;

    function resetGestures() {
      const workspace = workspaceRef.current;

      if (workspace) {
        for (const id of touches.keys()) {
          releasePointer(workspace, id);
        }

        for (const id of blockedPointers) {
          releasePointer(workspace, id);
        }
      }

      touches.clear();
      blockedPointers.clear();

      gestureRef.current = null;
      pencilPointerRef.current = null;
      suppressClickRef.current = false;
    }

    window.addEventListener("blur", resetGestures);

    return () => {
      window.removeEventListener("blur", resetGestures);
      resetGestures();
    };
  }, [workspaceRef]);

  return {
    handlePointerDownCapture,
    handlePointerMoveCapture,
    handlePointerEndCapture,
    handleClickCapture,
  };
}

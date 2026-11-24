"use client";

import { useEffect, useState } from "react";
import { ImageIcon, RefreshCw } from "lucide-react";

import type { StudioProject } from "@/lib/studio/types";
import { canvasPresets } from "@/lib/studio/canvasPresets";
import type { CloudProjectRecord } from "@/lib/studio/cloudTypes";

import StudioSlidePreview from "./StudioSlidePreview";

type StudioCloudProjectPreviewProps = {
  projectId: string;
  revision: number;
  showMetadata?: boolean;
};

type PreviewResult =
  | {
      key: string;
      project: StudioProject;
      error: false;
    }
  | {
      key: string;
      project: null;
      error: true;
    };

const previewCache = new Map<string, StudioProject>();

const MAX_CACHED_PREVIEWS = 20;

export default function StudioCloudProjectPreview({
  projectId,
  revision,
  showMetadata = true,
}: StudioCloudProjectPreviewProps) {
  const cacheKey = `${projectId}:${revision}`;

  const [result, setResult] = useState<PreviewResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    const controller = new AbortController();

    async function loadPreview() {
      const cached = previewCache.get(cacheKey);

      if (cached) {
        if (!cancelled) {
          setResult({
            key: cacheKey,
            project: cached,
            error: false,
          });
        }

        return;
      }

      try {
        const response = await fetch(`/api/studio/projects/${encodeURIComponent(projectId)}`, {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load project preview.");
        }

        const data = await response.json();

        const record = data.project as CloudProjectRecord;

        if (
          !record.document ||
          record.id !== projectId ||
          record.document.id !== projectId ||
          !Array.isArray(record.document.slides) ||
          record.document.slides.length === 0 ||
          !Object.hasOwn(canvasPresets, record.document.canvasPreset)
        ) {
          throw new Error("Invalid preview document.");
        }

        if (cancelled) return;

        if (record.revision === revision) {
          previewCache.set(cacheKey, record.document);

          if (previewCache.size > MAX_CACHED_PREVIEWS) {
            const oldestKey = previewCache.keys().next().value;

            if (oldestKey !== undefined) {
              previewCache.delete(oldestKey);
            }
          }
        }

        setResult({
          key: cacheKey,
          project: record.document,
          error: false,
        });
      } catch {
        if (!cancelled && !controller.signal.aborted) {
          setResult({
            key: cacheKey,
            project: null,
            error: true,
          });
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [projectId, revision, cacheKey]);

  const currentResult = result?.key === cacheKey ? result : null;

  const loading = currentResult === null;

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="border-default bg-surface flex h-48 items-center justify-center rounded-md border">
          <RefreshCw size={20} className="text-accent animate-spin" />
        </div>

        <p className="text-muted text-xs">Loading preview…</p>
      </div>
    );
  }

  if (currentResult.error || !currentResult.project) {
    return (
      <div className="flex flex-col gap-2">
        <div className="border-default bg-surface flex h-48 flex-col items-center justify-center gap-2 rounded-md border">
          <ImageIcon size={24} className="text-muted" strokeWidth={1.5} />

          <p className="text-muted text-xs">Preview unavailable</p>
        </div>
      </div>
    );
  }

  const project = currentResult.project;
  const canvasSize = canvasPresets[project.canvasPreset];
  const slideCount = project.slides.length;

  const previewWidth = Math.min(100, (100 * canvasSize.width) / canvasSize.height);

  const presetName = project.canvasPreset
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <div className="flex flex-col gap-2">
      <div className="border-default bg-surface flex h-48 items-center justify-center overflow-hidden rounded-md border p-3">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="w-full"
            style={{
              maxWidth: `${previewWidth}%`,
              width: `min(100%, ${(168 * canvasSize.width) / canvasSize.height}px)`,
            }}
          >
            <StudioSlidePreview project={project} className="shadow-sm" />
          </div>
        </div>
      </div>

      {showMetadata && (
        <>
          <div className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span>
              {slideCount} {slideCount === 1 ? "slide" : "slides"}
            </span>

            <span aria-hidden="true">·</span>

            <span>
              {canvasSize.width} × {canvasSize.height}
            </span>
          </div>

          <p className="text-muted text-xs">{presetName}</p>
        </>
      )}
    </div>
  );
}

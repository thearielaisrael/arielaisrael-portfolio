"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

import StudioSlidePreview from "../StudioSlidePreview";

import { canvasPresets } from "@/lib/studio/canvasPresets";

import { getStudioTemplate } from "@/lib/studio/templateLibrary";

import type { StudioProject } from "@/lib/studio/types";

type StudioTemplatePreviewProps = {
  templateId: string;
  updatedAt: string;
};

type PreviewState =
  | {
      key: string;
      status: "ready";
      document: StudioProject;
    }
  | {
      key: string;
      status: "error";
    };

export default function StudioTemplatePreview({
  templateId,
  updatedAt,
}: StudioTemplatePreviewProps) {
  const previewKey = `${templateId}:${updatedAt}`;

  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPreview() {
      try {
        const template = await getStudioTemplate(templateId, controller.signal);

        const document = template.document;

        if (
          !Array.isArray(document.slides) ||
          document.slides.length === 0 ||
          !Object.hasOwn(canvasPresets, document.canvasPreset)
        ) {
          throw new Error("Invalid template artwork.");
        }

        if (!controller.signal.aborted) {
          setPreview({
            key: previewKey,
            status: "ready",
            document,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setPreview({
            key: previewKey,
            status: "error",
          });
        }
      }
    }

    void loadPreview();

    return () => controller.abort();
  }, [templateId, previewKey]);

  if (!preview || preview.key !== previewKey) {
    return (
      <div className="studio-template-preview studio-template-preview-loading" aria-busy="true">
        <span className="sr-only">Loading template preview</span>
      </div>
    );
  }

  if (preview.status === "error") {
    return (
      <div className="studio-template-preview">
        <div className="studio-template-preview-error">
          <ImageOff size={24} strokeWidth={1.5} />
          <span>Preview unavailable</span>
        </div>
      </div>
    );
  }

  const document = preview.document;

  const canvasSize = canvasPresets[document.canvasPreset];

  const artworkWidth = (176 * canvasSize.width) / canvasSize.height;

  return (
    <div className="studio-template-preview">
      <div
        className="studio-template-preview-artwork"
        style={{
          width: `min(100%, ${artworkWidth}px)`,
        }}
      >
        <StudioSlidePreview
          project={document}
          slideId={document.slides[0].id}
          className="shadow-sm"
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { StudioProject } from "@/lib/studio/types";
import { canvasPresets } from "@/lib/studio/canvasPresets";
import { brandColor } from "@/lib/studio/brandColors";
import { studioFonts } from "@/lib/studio/fonts";
import { studioGradientToCSS } from "@/lib/studio/gradientPresets";

import StudioShape from "./StudioShape";
import StudioTextContent from "./StudioTextContent";
import StudioBackgroundEffects from "./StudioBackgroundEffects";

type StudioSlidePreviewProps = {
  project: StudioProject;
  slideId?: string;
  className?: string;
};

const ignoreOverflow = (_overflowing: boolean) => {
  void _overflowing;
};

export default function StudioSlidePreview({
  project,
  slideId,
  className = "",
}: StudioSlidePreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const canvasSize = canvasPresets[project.canvasPreset];

  const slide = project.slides.find((item) => item.id === slideId) ?? project.slides[0];

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  if (!canvasSize || !slide) {
    return (
      <div className="bg-surface text-muted flex aspect-square items-center justify-center rounded-md text-xs">
        Preview unavailable
      </div>
    );
  }

  const scale = containerWidth / canvasSize.width;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: `${canvasSize.width} / ${canvasSize.height}`,
        backgroundColor: brandColor(slide.backgroundColor),
      }}
      role="img"
      aria-label={`${project.name} — ${slide.name} preview`}
    >
      {containerWidth > 0 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 isolate origin-top-left overflow-hidden select-none"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `scale(${scale})`,
            background: brandColor(slide.backgroundColor),
          }}
        >
          <StudioBackgroundEffects
            effects={slide.backgroundEffects ?? []}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
          />

          {slide.elements
            .filter((element) => element.visible)
            .map((element) => {
              const commonStyle = {
                position: "absolute" as const,
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                opacity: element.opacity / 100,
                transform: `rotate(${element.rotation}deg)`,
              };

              if (element.type === "shape") {
                return (
                  <div key={element.id} style={commonStyle}>
                    <StudioShape element={element} />
                  </div>
                );
              }

              if (element.type === "card") {
                return (
                  <div
                    key={element.id}
                    style={{
                      ...commonStyle,
                      background:
                        element.fillType === "gradient" && element.gradient
                          ? studioGradientToCSS(element.gradient)
                          : brandColor(element.color),
                      borderRadius: element.radius,
                      border: `1px solid ${brandColor("glass-border")}`,
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {(element.effects?.length ?? 0) > 0 && (
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          borderRadius: "inherit",
                        }}
                      >
                        <StudioBackgroundEffects
                          effects={element.effects ?? []}
                          canvasWidth={element.width}
                          canvasHeight={element.height}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              if (element.type === "text") {
                return (
                  <div
                    key={element.id}
                    style={{
                      ...commonStyle,
                      color: brandColor(element.color),
                      fontFamily: studioFonts[element.fontFamily].family,
                      fontSize: element.fontSize,
                      fontWeight: element.fontWeight,
                      fontStyle: element.italic ? "italic" : "normal",
                      lineHeight: element.lineHeight,
                      letterSpacing: `${element.letterSpacing}px`,
                      textAlign: element.textAlign,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    <div className="h-full w-full overflow-hidden">
                      <StudioTextContent
                        content={element.content}
                        onOverflowChange={ignoreOverflow}
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}
        </div>
      )}
    </div>
  );
}

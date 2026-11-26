"use client";

import type { StudioAmbientGlowSource } from "@/lib/studio/types";

type StudioGlowSourcesProps = {
  sources: StudioAmbientGlowSource[];
  opacity?: number;
  intensity?: number;
  scale?: number;
  presetId?: string;
  originalSources?: StudioAmbientGlowSource[];
};

export default function StudioGlowSources({
  sources,
  opacity = 100,
  intensity = 50,
  scale = 100,
  presetId,
  originalSources,
}: StudioGlowSourcesProps) {
  const layerOpacity = Math.max(0, Math.min(100, opacity)) / 100;
  const intensityMultiplier = Math.max(0, intensity) / 50;
  const scaleMultiplier = Math.max(0, scale) / 100;

  const isOriginalArrangement =
    originalSources?.length === sources.length &&
    sources.every((source, index) => {
      const original = originalSources[index];

      return original && source.x === original.x && source.y === original.y;
    });

  const useWebsiteBackgroundFX =
    presetId === "website-ambient-fx" && isOriginalArrangement && intensity === 50 && scale === 100;

  const useEditorialSoftWash =
    presetId === "editorial-soft-wash" &&
    isOriginalArrangement &&
    intensity === 50 &&
    scale === 100;

  if (useWebsiteBackgroundFX) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          opacity: (Math.max(0, Math.min(100, opacity)) / 100) * 0.12,
          containerType: "size",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
            radial-gradient(
              60% 100% at 10% 10%,
              #FF699E,
              transparent 100%
            ),
            radial-gradient(
              70% 100% at 90% 20%,
              #24C7C9,
              transparent 100%
            ),
            radial-gradient(
              50% 100% at 50% 90%,
              #A78BFA,
              transparent 100%
            )
          `,
            filter: "blur(6cqh)",
          }}
        />
      </div>
    );
  }

  if (useEditorialSoftWash) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          opacity: Math.max(0, Math.min(100, opacity)) / 100,
          background: `
          linear-gradient(
            135deg,
            rgba(255, 145, 184, 0.34),
            rgba(167, 139, 250, 0.28),
            rgba(36, 199, 201, 0.12)
          ),
          rgba(255, 253, 248, 0.88)
        `,
        }}
      />
    );
  }

  const isPinkInformaticsNight = presetId === "pink-informatics-night";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: layerOpacity }}
    >
      {isPinkInformaticsNight && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "#160D1A",
          }}
        />
      )}

      {sources.map((source) => {
        const radius = source.radius * scaleMultiplier;
        const diameter = radius * 2;
        const sourceOpacity = Math.min(1, (source.opacity / 100) * intensityMultiplier);

        return (
          <div
            key={source.id}
            className="pointer-events-none absolute"
            style={{
              left: `${source.x}%`,
              top: `${source.y}%`,
              width: `${diameter}%`,
              height: `${diameter}%`,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `radial-gradient(
                ellipse,
                color-mix(in srgb, ${source.color} ${sourceOpacity * 100}%, transparent) 0%,
                color-mix(in srgb, ${source.color} ${sourceOpacity * 65}%, transparent) 18%,
                color-mix(in srgb, ${source.color} ${sourceOpacity * 28}%, transparent) 43%,
                transparent 75%
              )`,
              mixBlendMode: isPinkInformaticsNight ? "screen" : "normal",
            }}
          />
        );
      })}
    </div>
  );
}

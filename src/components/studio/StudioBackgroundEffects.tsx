import type { StudioBackgroundEffect } from "../../lib/studio/types";
import { studioGradientToCSS } from "../../lib/studio/gradientPresets";
import StudioGlowSources from "./StudioGlowSources";

type StudioBackgroundEffectsProps = {
  effects: StudioBackgroundEffect[];
};

export default function StudioBackgroundEffects({ effects }: StudioBackgroundEffectsProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {effects
        .filter((effect) => effect.enabled)
        .map((effect) => {
          if (effect.type === "ambient-glow") {
            return (
              <StudioGlowSources
                key={effect.id}
                sources={effect.glowSources ?? []}
                originalSources={effect.originalGlowSources}
                presetId={effect.ambientGlowPresetId}
                opacity={effect.opacity}
                intensity={effect.intensity}
                scale={effect.scale}
              />
            );
          }

          if (effect.type === "gradient") {
            return (
              <div
                key={effect.id}
                className="absolute inset-0"
                style={{
                  background: effect.gradient
                    ? studioGradientToCSS(effect.gradient)
                    : `linear-gradient(135deg, ${effect.color}, ${
                        effect.secondaryColor ?? "transparent"
                      })`,
                  opacity: effect.gradient ? 1 : effect.opacity / 100,
                }}
              />
            );
          }

          return null;
        })}
    </div>
  );
}

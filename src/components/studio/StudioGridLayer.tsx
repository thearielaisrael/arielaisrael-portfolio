import type { StudioBackgroundEffect } from "../../lib/studio/types";
import { brandColor, type BrandColorToken } from "../../lib/studio/brandColors";

type StudioGridLayerProps = {
  effect: StudioBackgroundEffect;
};

export default function StudioGridLayer({ effect }: StudioGridLayerProps) {
  if (!effect.enabled || effect.type !== "grid" || !effect.grid) {
    return null;
  }

  const grid = effect.grid;

  const gridColor = effect.color.startsWith("#")
    ? effect.color
    : brandColor(effect.color as BrandColorToken);

  const spacing = Math.max(4, grid.spacing * (effect.scale / 100));
  const lineWidth = Math.max(0.25, grid.lineWidth);

  const patternId = `studio-grid-${effect.id}`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      width="100%"
      height="100%"
      style={{ opacity: effect.opacity / 100 }}
    >
      <defs>
        <pattern id={patternId} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          {grid.style === "dots" ? (
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={lineWidth / 2}
              fill={gridColor}
              fillOpacity={effect.intensity / 100}
            />
          ) : (
            <path
              d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none"
              stroke={gridColor}
              strokeWidth={lineWidth}
              strokeOpacity={effect.intensity / 100}
            />
          )}
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

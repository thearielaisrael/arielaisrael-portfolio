import type { StudioBackgroundEffect } from "../../lib/studio/types";
import { brandColor, type BrandColorToken } from "../../lib/studio/brandColors";

type StudioPatternLayerProps = {
  effect: StudioBackgroundEffect;
};

export default function StudioPatternLayer({ effect }: StudioPatternLayerProps) {
  if (!effect.enabled || effect.type !== "pattern" || !effect.pattern) {
    return null;
  }

  const pattern = effect.pattern;

  const patternColor = effect.color.startsWith("#")
    ? effect.color
    : brandColor(effect.color as BrandColorToken);

  const spacing = Math.max(8, pattern.spacing * (effect.scale / 100));

  const lineWidth = Math.max(0.25, pattern.lineWidth);

  const patternId = `studio-pattern-${effect.id}`;

  function renderPattern() {
    switch (pattern.style) {
      case "waves":
        return (
          <path
            d={`M 0 ${spacing / 2}
                Q ${spacing / 4} 0 ${spacing / 2} ${spacing / 2}
                T ${spacing} ${spacing / 2}`}
            fill="none"
            stroke={patternColor}
            strokeWidth={lineWidth}
            strokeOpacity={effect.intensity / 100}
          />
        );

      case "diagonal-lines":
        return (
          <path
            d={`M 0 0 L ${spacing} ${spacing}`}
            fill="none"
            stroke={patternColor}
            strokeWidth={lineWidth}
            strokeOpacity={effect.intensity / 100}
          />
        );

      case "crosses":
        return (
          <path
            d={`M ${spacing * 0.3} ${spacing / 2}
                H ${spacing * 0.7}
                M ${spacing / 2} ${spacing * 0.3}
                V ${spacing * 0.7}`}
            fill="none"
            stroke={patternColor}
            strokeWidth={lineWidth}
            strokeOpacity={effect.intensity / 100}
          />
        );

      case "diamonds":
        return (
          <path
            d={`M ${spacing / 2} ${spacing * 0.1}
                L ${spacing * 0.9} ${spacing / 2}
                L ${spacing / 2} ${spacing * 0.9}
                L ${spacing * 0.1} ${spacing / 2}
                Z`}
            fill="none"
            stroke={patternColor}
            strokeWidth={lineWidth}
            strokeOpacity={effect.intensity / 100}
          />
        );

      default:
        return null;
    }
  }

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      width="100%"
      height="100%"
      style={{ opacity: effect.opacity / 100 }}
    >
      <defs>
        <pattern
          id={patternId}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${pattern.rotation})`}
        >
          {renderPattern()}
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

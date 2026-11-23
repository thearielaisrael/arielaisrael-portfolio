import type { StudioBackgroundEffect } from "@/lib/studio/types";
import {
  generateStudioParticles,
  generateStudioParticleConnections,
} from "@/lib/studio/particleGenerator";
import { brandColor, type BrandColorToken } from "@/lib/studio/brandColors";

type StudioParticleLayerProps = {
  effect: StudioBackgroundEffect;
  canvasWidth: number;
  canvasHeight: number;
};

export default function StudioParticleLayer({
  effect,
  canvasWidth,
  canvasHeight,
}: StudioParticleLayerProps) {
  if (!effect.enabled || effect.type !== "particles" || !effect.particles) {
    return null;
  }

  const particleSettings = effect.particles;

  const viewBoxWidth = 1000;
  const viewBoxHeight = (canvasHeight / canvasWidth) * viewBoxWidth;

  const nodeColor = effect.color.startsWith("#")
    ? effect.color
    : brandColor(effect.color as BrandColorToken);

  const particles = generateStudioParticles(effect.particles, effect.seed);
  const connections = generateStudioParticleConnections(
    particles,
    particleSettings.connectionDistance ?? 12,
  );

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        opacity: effect.opacity / 100,
      }}
    >
      {connections.map((connection) => (
        <line
          key={connection.id}
          x1={(connection.from.x / 100) * viewBoxWidth}
          y1={(connection.from.y / 100) * viewBoxHeight}
          x2={(connection.to.x / 100) * viewBoxWidth}
          y2={(connection.to.y / 100) * viewBoxHeight}
          stroke={nodeColor}
          strokeWidth={0.75}
          strokeOpacity={connection.opacity * ((particleSettings.connectionOpacity ?? 12) / 100)}
        />
      ))}

      {particles.map((particle) => {
        const x = (particle.x / 100) * viewBoxWidth;
        const y = (particle.y / 100) * viewBoxHeight;
        const size = particle.size * (effect.scale / 100);
        const opacity = particle.opacity * (effect.intensity / 100);

        return (
          <circle key={particle.id} cx={x} cy={y} r={size / 2} fill={nodeColor} opacity={opacity} />
        );
      })}
    </svg>
  );
}

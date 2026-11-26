import type { StudioParticleSettings } from "./types";

export type StudioParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
};

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function generateStudioParticles(
  settings: StudioParticleSettings,
  seed: number,
): StudioParticle[] {
  const random = seededRandom(seed);
  const count = Math.max(0, Math.min(500, Math.floor(settings.count)));

  return Array.from({ length: count }, (_, index) => {
    const x = random() * 100;
    const y = random() * 100;

    return {
      id: index,
      x,
      y,
      size: Math.max(1, settings.size),
      rotation: random() * 360,
      opacity: 0.4 + random() * 0.6,
    };
  });
}

export type StudioParticleConnection = {
  id: string;
  from: StudioParticle;
  to: StudioParticle;
  opacity: number;
};

export function generateStudioParticleConnections(
  particles: StudioParticle[],
  maxDistance = 12,
): StudioParticleConnection[] {
  const connections: StudioParticleConnection[] = [];

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const from = particles[i];
      const to = particles[j];

      const dx = from.x - to.x;
      const dy = from.y - to.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > maxDistance) continue;

      connections.push({
        id: `${from.id}-${to.id}`,
        from,
        to,
        opacity: 1 - distance / maxDistance,
      });
    }
  }

  return connections;
}

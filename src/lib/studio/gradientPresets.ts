import type { StudioGradient } from "./types";

export type StudioGradientPreset = {
  id: string;
  name: string;
  category: "pink-academia" | "informatics-night";
  gradient: StudioGradient;
};

export const studioGradientPresets: StudioGradientPreset[] = [
  {
    id: "aura-blush",
    name: "Aura Blush",
    category: "pink-academia",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "aura-1", color: "#FF699E", position: 0 },
        { id: "aura-2", color: "#FFDBE2", position: 100 },
      ],
    },
  },
  {
    id: "scholars-dream",
    name: "Scholar's Dream",
    category: "pink-academia",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "scholar-1", color: "#FF91B8", position: 0 },
        { id: "scholar-2", color: "#A78BFA", position: 55 },
        { id: "scholar-3", color: "#FFF7FA", position: 100 },
      ],
    },
  },
  {
    id: "digital-bloom",
    name: "Digital Bloom",
    category: "pink-academia",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "digital-1", color: "#FF699E", position: 0 },
        { id: "digital-2", color: "#24C7C9", position: 55 },
        { id: "digital-3", color: "#A78BFA", position: 100 },
      ],
    },
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    category: "pink-academia",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "gold-1", color: "#F6C453", position: 0 },
        { id: "gold-2", color: "#FFB8CE", position: 55 },
        { id: "gold-3", color: "#FFFDF8", position: 100 },
      ],
    },
  },
  {
    id: "informatics-night",
    name: "Pink Informatics Night",
    category: "informatics-night",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "night-1", color: "#160D1A", position: 0 },
        { id: "night-2", color: "#351827", position: 55 },
        { id: "night-3", color: "#C42B70", position: 100 },
      ],
    },
  },
  {
    id: "luminous-research",
    name: "Luminous Research",
    category: "informatics-night",
    gradient: {
      type: "linear",
      angle: 135,
      opacity: 100,
      stops: [
        { id: "research-1", color: "#211125", position: 0 },
        { id: "research-2", color: "#7C83FD", position: 55 },
        { id: "research-3", color: "#5EE1E6", position: 100 },
      ],
    },
  },
];

export function studioGradientToCSS(gradient: StudioGradient): string {
  const alpha = Math.max(0, Math.min(100, gradient.opacity)) / 100;

  const stops = [...gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map(
      (stop) => `color-mix(in srgb, ${stop.color} ${alpha * 100}%, transparent) ${stop.position}%`,
    )
    .join(", ");

  if (gradient.type === "radial") {
    return `radial-gradient(circle at center, ${stops})`;
  }

  return `linear-gradient(${gradient.angle}deg, ${stops})`;
}

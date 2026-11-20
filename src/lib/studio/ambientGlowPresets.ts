import type { StudioAmbientGlowPreset, StudioAmbientGlowSource } from "./types";

type GlowSourceInput = Omit<StudioAmbientGlowSource, "id">;

function sources(items: GlowSourceInput[]): StudioAmbientGlowSource[] {
  return items.map((source, index) => ({
    ...source,
    id: `source-${index + 1}`,
  }));
}

export const studioAmbientGlowPresets: StudioAmbientGlowPreset[] = [
  {
    id: "signature-pink-aura",
    name: "Signature Pink Aura",
    category: "website",
    description: "Concentrated pink light dissolving into a soft blush veil.",
    sources: sources([
      { color: "#FF91B8", x: 50, y: 49, radius: 74, opacity: 72 },
      { color: "#FFA0C1", x: 48, y: 53, radius: 110, opacity: 48 },
      { color: "#FFDBE2", x: 50, y: 50, radius: 145, opacity: 28 },
    ]),
  },
  {
    id: "website-ambient-fx",
    name: "Website Ambient FX",
    category: "website",
    description: "Overlapping pink, lilac, and aqua atmospheric light.",
    sources: sources([
      { color: "#FF699E", x: 18, y: 24, radius: 90, opacity: 48 },
      { color: "#A78BFA", x: 82, y: 38, radius: 95, opacity: 27 },
      { color: "#24C7C9", x: 48, y: 82, radius: 85, opacity: 21 },
    ]),
  },
  {
    id: "editorial-soft-wash",
    name: "Editorial Soft Wash",
    category: "website",
    description: "A delicate atmospheric wash for editorial graphics.",
    sources: sources([
      { color: "#FFDBE2", x: 12, y: 20, radius: 115, opacity: 38 },
      { color: "#A78BFA", x: 88, y: 25, radius: 105, opacity: 13 },
      { color: "#24C7C9", x: 75, y: 88, radius: 100, opacity: 10 },
    ]),
  },
  {
    id: "pink-informatics-night",
    name: "Pink Informatics Night",
    category: "website",
    description: "Luminous pink and technical colors for dark backgrounds.",
    sources: sources([
      { color: "#FF699E", x: 20, y: 24, radius: 95, opacity: 46 },
      { color: "#C4A7FF", x: 82, y: 28, radius: 88, opacity: 32 },
      { color: "#5EE1E6", x: 65, y: 82, radius: 90, opacity: 25 },
      { color: "#9EA8FF", x: 38, y: 70, radius: 75, opacity: 19 },
    ]),
  },
  {
    id: "ethereal-pearl",
    name: "Ethereal Pearl",
    category: "ethereal",
    description: "Pearlescent cream, delicate pink, and soft lilac.",
    sources: sources([
      { color: "#FFFDF8", x: 48, y: 45, radius: 100, opacity: 58 },
      { color: "#FFB8CE", x: 22, y: 34, radius: 90, opacity: 42 },
      { color: "#C4A7FF", x: 82, y: 65, radius: 100, opacity: 22 },
    ]),
  },
  {
    id: "celestial-bloom",
    name: "Celestial Bloom",
    category: "ethereal",
    description: "Dreamlike pink, periwinkle, and lilac illumination.",
    sources: sources([
      { color: "#FF91B8", x: 24, y: 30, radius: 95, opacity: 50 },
      { color: "#7C83FD", x: 82, y: 45, radius: 95, opacity: 26 },
      { color: "#A78BFA", x: 45, y: 82, radius: 90, opacity: 32 },
    ]),
  },
];

export function cloneAmbientGlowSources(
  preset: StudioAmbientGlowPreset,
): StudioAmbientGlowSource[] {
  return preset.sources.map((source) => ({
    ...source,
    id: crypto.randomUUID(),
  }));
}

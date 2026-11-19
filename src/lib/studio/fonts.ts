export const studioFonts = {
  "plus-jakarta-sans": {
    label: "Plus Jakarta Sans",
    category: "Portfolio Fonts",
    family: "var(--font-heading), sans-serif",
    weights: [200, 300, 400, 500, 600, 700, 800],
  },
  "nunito-sans": {
    label: "Nunito Sans",
    category: "Portfolio Fonts",
    family: "var(--font-nunito-sans), sans-serif",
    weights: [200, 300, 400, 500, 600, 700, 800, 900],
  },
  "geist-mono": {
    label: "Geist Mono",
    category: "Portfolio Fonts",
    family: "var(--font-geist-mono), monospace",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  "cormorant-garamond": {
    label: "Cormorant Garamond",
    category: "Romantic & Editorial",
    family: "var(--font-cormorant-garamond), serif",
    weights: [300, 400, 500, 600, 700],
  },
  "playfair-display": {
    label: "Playfair Display",
    category: "Romantic & Editorial",
    family: "var(--font-playfair-display), serif",
    weights: [400, 500, 600, 700, 800, 900],
  },
  "great-vibes": {
    label: "Great Vibes",
    category: "Romantic & Editorial",
    family: "var(--font-great-vibes), cursive",
    weights: [400],
  },
  "dm-sans": {
    label: "DM Sans",
    category: "Modern & Academic",
    family: "var(--font-dm-sans), sans-serif",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
} as const;

export type StudioFont = keyof typeof studioFonts;

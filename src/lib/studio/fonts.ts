export const studioFonts = {
  "plus-jakarta-sans": {
    label: "Plus Jakarta Sans",
    category: "Portfolio Fonts",
    family: "var(--font-heading), sans-serif",
  },
  "nunito-sans": {
    label: "Nunito Sans",
    category: "Portfolio Fonts",
    family: "var(--font-nunito-sans), sans-serif",
  },
  "geist-mono": {
    label: "Geist Mono",
    category: "Portfolio Fonts",
    family: "var(--font-geist-mono), monospace",
  },
  "cormorant-garamond": {
    label: "Cormorant Garamond",
    category: "Romantic & Editorial",
    family: "var(--font-cormorant-garamond), serif",
  },
  "playfair-display": {
    label: "Playfair Display",
    category: "Romantic & Editorial",
    family: "var(--font-playfair-display), serif",
  },
  "great-vibes": {
    label: "Great Vibes",
    category: "Romantic & Editorial",
    family: "var(--font-great-vibes), cursive",
  },
  "dm-sans": {
    label: "DM Sans",
    category: "Modern & Academic",
    family: "var(--font-dm-sans), sans-serif",
  },
} as const;

export type StudioFont = keyof typeof studioFonts;

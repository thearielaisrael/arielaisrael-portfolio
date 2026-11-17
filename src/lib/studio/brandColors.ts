export const brandColors = [
  {
    group: "Signature Pinks",
    colors: [
      ["Signature Aura Pink", "signature-aura-pink"],
      ["Accessible Rose", "accessible-rose"],
      ["Signature Text", "signature-text"],
      ["Aura Center", "aura-center"],
      ["Aura Bloom", "aura-bloom"],
      ["Aura Blush", "aura-blush"],
      ["Aura Petal", "aura-petal"],
      ["Aura Veil", "aura-veil"],
      ["Aura Mist", "aura-mist"],
      ["Aura Cloud", "aura-cloud"],
    ],
  },
  {
    group: "Healthcare & Academic Accents",
    colors: [
      ["Digital Aqua", "digital-aqua"],
      ["Aqua Ink", "aqua-ink"],
      ["Data Periwinkle", "data-periwinkle"],
      ["Periwinkle Ink", "periwinkle-ink"],
      ["Scholar Lilac", "scholar-lilac"],
      ["Lilac Ink", "lilac-ink"],
      ["Clinical Mint", "clinical-mint"],
      ["Mint Ink", "mint-ink"],
      ["Insight Gold", "insight-gold"],
      ["Gold Ink", "gold-ink"],
    ],
  },
  {
    group: "Neutrals",
    colors: [
      ["Blush Paper", "blush-paper"],
      ["Warm Cream", "warm-cream"],
      ["Pure White", "pure-white"],
      ["Text Charcoal", "text-charcoal"],
      ["Deep Plum", "deep-plum"],
    ],
  },
  {
    group: "Dark Mode",
    colors: [
      ["Night Plum", "night-plum"],
      ["Deep Aubergine", "deep-aubergine"],
      ["Night Surface", "night-surface"],
      ["Elevated Plum", "elevated-plum"],
      ["Blush White", "blush-white"],
      ["Muted Orchid Gray", "muted-orchid-gray"],
      ["Luminous Aqua", "luminous-aqua"],
      ["Luminous Periwinkle", "luminous-periwinkle"],
      ["Luminous Lilac", "luminous-lilac"],
      ["Luminous Mint", "luminous-mint"],
      ["Luminous Gold", "luminous-gold"],
    ],
  },
  {
    group: "Theme-Aware Colors",
    colors: [
      ["Background", "background"],
      ["Foreground", "foreground"],
      ["Surface", "surface"],
      ["Surface Soft", "surface-soft"],
      ["Surface Aqua", "surface-aqua"],
      ["Surface Elevated", "surface-elevated"],
      ["Card", "card"],
      ["Glass", "glass"],
      ["Border", "border"],
      ["Border Strong", "border-strong"],
      ["Glass Border", "glass-border"],
      ["Muted", "muted"],
      ["Subtle", "subtle"],
      ["Primary", "primary"],
      ["Secondary", "secondary"],
      ["Accent", "accent"],
      ["Accent Soft", "accent-soft"],
      ["Accent Muted", "accent-muted"],
      ["Link", "link"],
      ["CTA", "cta"],
      ["CTA Foreground", "cta-foreground"],
    ],
  },
] as const;

export type BrandColorToken = (typeof brandColors)[number]["colors"][number][1];

export function brandColor(token: BrandColorToken) {
  return `var(--color-${token})`;
}

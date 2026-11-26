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
] as const;

export type BrandColorToken = (typeof brandColors)[number]["colors"][number][1];


type StudioUIcolor = "surface" | "foreground" | "border" | "accent" | "glass-border";

export function brandColor(token: BrandColorToken | StudioUIcolor): string {
  return `var(--color-${token})`;
}


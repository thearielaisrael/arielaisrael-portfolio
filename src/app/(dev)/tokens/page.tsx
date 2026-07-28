"use client";

import { useEffect, useState } from "react";

import { PrimaryCTA, PrimaryBtn, SecondaryCTA, TertiaryCTA } from "@/src/components/ui/Buttons";
import {
  Card,
  CardWithGlow,
  EditorialCard,
  GlassCard,
  SoftWashCard,
} from "@/src/components/ui/Cards";
import {
  ChipAccent,
  ChipContext,
  ChipMono,
  ChipPrimary,
  ChipRegBorder,
  ChipStatus,
  ChipTech,
  ChipThinBorder,
} from "@/src/components/ui/Chips";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import { StackBadge } from "@/src/components/projects/StackBadge";

type ThemeMode = "light" | "dark";

type PaletteToken = {
  label: string;
  variable: string;
  value: string;
  purpose: string;
};

type DynamicColorToken = {
  label: string;
  variable: string;
  lightValue: string;
  darkValue: string;
  lightPurpose: string;
  darkPurpose: string;
};

function useGlobalTheme(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const documentRoot = document.documentElement;

    const updateMode = () => {
      setMode(documentRoot.classList.contains("dark") ? "dark" : "light");
    };

    updateMode();

    const themeObserver = new MutationObserver(updateMode);

    themeObserver.observe(documentRoot, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      themeObserver.disconnect();
    };
  }, []);

  return mode;
}

const lightPaletteTokens: PaletteToken[] = [
  {
    label: "Blush Paper",
    variable: "--color-blush-paper",
    value: "#FFF7FA",
    purpose: "Primary light-mode page background",
  },
  {
    label: "Warm Cream",
    variable: "--color-warm-cream",
    value: "#FFFDF8",
    purpose: "Cards, panels, and warm neutral surfaces",
  },
  {
    label: "Pure White",
    variable: "--color-pure-white",
    value: "#FFFFFF",
    purpose: "Elevated surfaces and crisp highlights",
  },
  {
    label: "Text Charcoal",
    variable: "--color-text-charcoal",
    value: "#241C22",
    purpose: "Body copy and high-contrast interface text",
  },
  {
    label: "Deep Plum",
    variable: "--color-deep-plum",
    value: "#351827",
    purpose: "Headings and dark brand anchors",
  },
  {
    label: "Signature Aura Pink",
    variable: "--color-signature-aura-pink",
    value: "#FF699E",
    purpose: "Glows, icons, decorative emphasis, and recognizable brand highlights",
  },
  {
    label: "Accessible Rose",
    variable: "--color-accessible-rose",
    value: "#C42B70",
    purpose: "Functional buttons, active states, links, labels, and focus cues",
  },
  {
    label: "Aura Center",
    variable: "--color-aura-center",
    value: "#FF91B8",
    purpose: "Strong aura glow and feature highlights",
  },
  {
    label: "Aura Bloom",
    variable: "--color-aura-bloom",
    value: "#FFA0C1",
    purpose: "Gradient transitions and decorative blooms",
  },
  {
    label: "Aura Blush",
    variable: "--color-aura-blush",
    value: "#FFAEC8",
    purpose: "Illustration fills and soft visual accents",
  },
  {
    label: "Aura Petal",
    variable: "--color-aura-petal",
    value: "#FFB8CE",
    purpose: "Soft borders, panels, and gradient layers",
  },
  {
    label: "Aura Veil",
    variable: "--color-aura-veil",
    value: "#FFC5D4",
    purpose: "Low-emphasis pink surfaces",
  },
  {
    label: "Aura Mist",
    variable: "--color-aura-mist",
    value: "#FFDBE2",
    purpose: "Section backgrounds and delicate card tinting",
  },
  {
    label: "Aura Cloud",
    variable: "--color-aura-cloud",
    value: "#FFECEA",
    purpose: "Near-neutral pink highlights and backdrops",
  },
  {
    label: "Digital Aqua",
    variable: "--color-digital-aqua",
    value: "#24C7C9",
    purpose: "Data nodes and technical visual signals",
  },
  {
    label: "Aqua Ink",
    variable: "--color-aqua-ink",
    value: "#14777D",
    purpose: "Accessible aqua text and technical labels",
  },
  {
    label: "Data Periwinkle",
    variable: "--color-data-periwinkle",
    value: "#7C83FD",
    purpose: "Informatics accents and diagrams",
  },
  {
    label: "Periwinkle Ink",
    variable: "--color-periwinkle-ink",
    value: "#4E5BC7",
    purpose: "Accessible periwinkle interface details",
  },
  {
    label: "Scholar Lilac",
    variable: "--color-scholar-lilac",
    value: "#A78BFA",
    purpose: "Academic accents and soft gradients",
  },
  {
    label: "Lilac Ink",
    variable: "--color-lilac-ink",
    value: "#6D3BC2",
    purpose: "Accessible lilac text and scholarly labels",
  },
  {
    label: "Clinical Mint",
    variable: "--color-clinical-mint",
    value: "#4FD1A5",
    purpose: "Healthcare-system accents and calm supporting details",
  },
  {
    label: "Mint Ink",
    variable: "--color-mint-ink",
    value: "#167455",
    purpose: "Accessible mint text and compact labels",
  },
  {
    label: "Insight Gold",
    variable: "--color-insight-gold",
    value: "#F6C453",
    purpose: "Sparse scholarship and achievement highlights",
  },
  {
    label: "Gold Ink",
    variable: "--color-gold-ink",
    value: "#8A5A00",
    purpose: "Accessible gold text and academic markers",
  },
];

const darkPaletteTokens: PaletteToken[] = [
  {
    label: "Night Plum",
    variable: "--color-night-plum",
    value: "#160D1A",
    purpose: "Primary dark-mode page background",
  },
  {
    label: "Deep Aubergine",
    variable: "--color-deep-aubergine",
    value: "#211125",
    purpose: "Primary dark cards and grounded panels",
  },
  {
    label: "Night Surface",
    variable: "--color-night-surface",
    value: "#2B172D",
    purpose: "Secondary surfaces, chips, and navigation fields",
  },
  {
    label: "Elevated Plum",
    variable: "--color-elevated-plum",
    value: "#321A35",
    purpose: "Hover surfaces and elevated dark panels",
  },
  {
    label: "Blush White",
    variable: "--color-blush-white",
    value: "#FFF7FA",
    purpose: "Primary dark-mode headings and body text",
  },
  {
    label: "Muted Orchid Gray",
    variable: "--color-muted-orchid-gray",
    value: "#D9C8D2",
    purpose: "Secondary copy and metadata on dark surfaces",
  },
  {
    label: "Signature Aura Pink",
    variable: "--color-signature-aura-pink",
    value: "#FF699E",
    purpose: "Luminous glows, icons, decorative emphasis, and signature highlights",
  },
  {
    label: "Accessible Rose",
    variable: "--color-accessible-rose",
    value: "#C42B70",
    purpose: "Functional controls and active states requiring light text",
  },
  {
    label: "Luminous Aqua",
    variable: "--color-luminous-aqua",
    value: "#5EE1E6",
    purpose: "Dark-mode data nodes and technical indicators",
  },
  {
    label: "Luminous Periwinkle",
    variable: "--color-luminous-periwinkle",
    value: "#9EA8FF",
    purpose: "Dark-mode informatics accents and diagrams",
  },
  {
    label: "Luminous Lilac",
    variable: "--color-luminous-lilac",
    value: "#C4A7FF",
    purpose: "Dark-mode academic accents",
  },
  {
    label: "Luminous Mint",
    variable: "--color-luminous-mint",
    value: "#7BE0BD",
    purpose: "Dark-mode healthcare accents",
  },
  {
    label: "Luminous Gold",
    variable: "--color-luminous-gold",
    value: "#FFD166",
    purpose: "Dark-mode scholarship and achievement highlights",
  },
];

const interfaceTokens: DynamicColorToken[] = [
  {
    label: "Background",
    variable: "--color-background",
    lightValue: "#FFF7FA",
    darkValue: "#160D1A",
    lightPurpose: "Blush Paper page background",
    darkPurpose: "Night Plum page background",
  },
  {
    label: "Foreground",
    variable: "--color-foreground",
    lightValue: "#241C22",
    darkValue: "#FFF7FA",
    lightPurpose: "Text Charcoal primary text",
    darkPurpose: "Blush White primary text",
  },
  {
    label: "Surface",
    variable: "--color-surface",
    lightValue: "#FFFDF8",
    darkValue: "#211125",
    lightPurpose: "Warm Cream cards and controls",
    darkPurpose: "Deep Aubergine cards and controls",
  },
  {
    label: "Soft Surface",
    variable: "--color-surface-soft",
    lightValue: "#FFECEA",
    darkValue: "#2B172D",
    lightPurpose: "Aura Cloud supporting areas",
    darkPurpose: "Night Surface supporting areas",
  },
  {
    label: "Aqua Surface",
    variable: "--color-surface-aqua",
    lightValue: "#EFFCFC",
    darkValue: "#10292D",
    lightPurpose: "Subtle technical and data emphasis",
    darkPurpose: "Dark technical and data emphasis",
  },
  {
    label: "Elevated Surface",
    variable: "--color-surface-elevated",
    lightValue: "#FFFFFF",
    darkValue: "#321A35",
    lightPurpose: "Pure White elevated surface",
    darkPurpose: "Elevated Plum surface",
  },
  {
    label: "Card",
    variable: "--color-card",
    lightValue: "rgba(255, 253, 248, 0.82)",
    darkValue: "rgba(255, 247, 250, 0.045)",
    lightPurpose: "Translucent Warm Cream card",
    darkPurpose: "Translucent Blush White card",
  },
  {
    label: "Glass",
    variable: "--color-glass",
    lightValue: "rgba(255, 253, 248, 0.68)",
    darkValue: "rgba(255, 247, 250, 0.06)",
    lightPurpose: "Light glass panel",
    darkPurpose: "Dark glass panel",
  },
  {
    label: "Border",
    variable: "--color-border",
    lightValue: "rgba(196, 43, 112, 0.14)",
    darkValue: "rgba(255, 247, 250, 0.12)",
    lightPurpose: "Accessible Rose separation",
    darkPurpose: "Subtle Blush White separation",
  },
  {
    label: "Strong Border",
    variable: "--color-border-strong",
    lightValue: "rgba(196, 43, 112, 0.24)",
    darkValue: "rgba(255, 247, 250, 0.20)",
    lightPurpose: "Interactive light-mode emphasis",
    darkPurpose: "Interactive dark-mode emphasis",
  },
  {
    label: "Glass Border",
    variable: "--color-glass-border",
    lightValue: "rgba(255, 105, 158, 0.18)",
    darkValue: "rgba(255, 145, 184, 0.16)",
    lightPurpose: "Signature Aura Pink glass outline",
    darkPurpose: "Aura Center glass outline",
  },
  {
    label: "Muted Text",
    variable: "--color-muted",
    lightValue: "#6B4E57",
    darkValue: "#D9C8D2",
    lightPurpose: "Secondary light-mode body copy",
    darkPurpose: "Muted Orchid Gray secondary copy",
  },
  {
    label: "Subtle Text",
    variable: "--color-subtle",
    lightValue: "rgba(107, 78, 87, 0.78)",
    darkValue: "rgba(217, 200, 210, 0.78)",
    lightPurpose: "Light metadata and supporting details",
    darkPurpose: "Dark metadata and supporting details",
  },
  {
    label: "Primary",
    variable: "--color-primary",
    lightValue: "#351827",
    darkValue: "#FFF7FA",
    lightPurpose: "Deep Plum headings",
    darkPurpose: "Blush White headings",
  },
  {
    label: "Secondary",
    variable: "--color-secondary",
    lightValue: "#14777D",
    darkValue: "#5EE1E6",
    lightPurpose: "Aqua Ink technical text",
    darkPurpose: "Luminous Aqua technical text",
  },
  {
    label: "Accent",
    variable: "--color-accent",
    lightValue: "#C42B70",
    darkValue: "#FF91B8",
    lightPurpose: "Accessible Rose labels and links",
    darkPurpose: "Aura Center labels and links",
  },
  {
    label: "Accent Soft",
    variable: "--color-accent-soft",
    lightValue: "#FFAEC8",
    darkValue: "#FFB8CE",
    lightPurpose: "Aura Blush supporting emphasis",
    darkPurpose: "Aura Petal supporting emphasis",
  },
  {
    label: "Accent Muted",
    variable: "--color-accent-muted",
    lightValue: "#FFECEA",
    darkValue: "rgba(255, 145, 184, 0.12)",
    lightPurpose: "Aura Cloud supporting surface",
    darkPurpose: "Translucent Aura Center surface",
  },
  {
    label: "Link",
    variable: "--color-link",
    lightValue: "#C42B70",
    darkValue: "#FF91B8",
    lightPurpose: "Accessible Rose text link",
    darkPurpose: "Aura Center text link",
  },
  {
    label: "Primary CTA",
    variable: "--color-cta",
    lightValue: "#C42B70",
    darkValue: "#C42B70",
    lightPurpose: "Accessible Rose control with light text",
    darkPurpose: "Accessible Rose control with light text",
  },
  {
    label: "CTA Foreground",
    variable: "--color-cta-foreground",
    lightValue: "#FFF7FA",
    darkValue: "#FFF7FA",
    lightPurpose: "Blush White CTA text",
    darkPurpose: "Blush White CTA text",
  },
];

const professionalStrengths = [
  "Structured Data",
  "Documentation",
  "Information Accuracy",
  "Quality Assurance",
  "Workflow Analysis",
  "SQL",
  "PostgreSQL",
  "Accessibility",
  "Troubleshooting",
];

export default function TokenPage() {
  const mode = useGlobalTheme();
  const isDark = mode === "dark";

  const activePaletteTokens = isDark ? darkPaletteTokens : lightPaletteTokens;

  return (
    <main className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <section className="hero-ambient border-default relative isolate overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="data-grid data-grid-fade pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3 opacity-60"
        />

        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-4xl space-y-6">
            <Eyebrow>Ariela Israel Design System</Eyebrow>

            <div className="space-y-4">
              <h1 className="font-heading text-primary text-4xl leading-[0.98] font-extrabold tracking-[-0.035em] text-balance md:text-6xl">
                One identity, two visual expressions
              </h1>

              <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
                Pink Academia and Pink Informatics Night express different dimensions of the same
                academic-professional identity. They share one voice, one typography system, one
                pink foundation, and one direction toward women&apos;s health equity and
                informatics.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ChipThinBorder>Health Information</ChipThinBorder>
              <ChipRegBorder>Systems + Structured Data</ChipRegBorder>
              <ChipThinBorder>Healthcare Operations</ChipThinBorder>
              <ChipRegBorder>Women&apos;s Health Equity</ChipRegBorder>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-24 px-6 py-14 md:px-10 md:py-20">
        <DesignSection
          eyebrow="Typography"
          title="Three typefaces with clearly assigned roles"
          description="Plus Jakarta Sans creates the heading hierarchy. Nunito Sans handles body and interface copy. Geist Mono identifies metadata, categories, dates, technologies, and compact labels."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Specimen
              label="Display Heading"
              description="Plus Jakarta Sans ExtraBold for the homepage hero and the site's strongest statement."
            >
              <h2 className="font-heading text-primary text-4xl leading-[0.98] font-extrabold tracking-[-0.035em] text-balance md:text-5xl">
                Where software systems meet health information.
              </h2>
            </Specimen>

            <Specimen
              label="Page and Section Headings"
              description="Plus Jakarta Sans Bold for page titles, section headings, and major content transitions."
            >
              <h2 className="font-heading text-primary text-4xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl">
                Technology, information, and healthcare systems
              </h2>
            </Specimen>

            <Specimen
              label="Card and Supporting Headings"
              description="Plus Jakarta Sans SemiBold for cards, experience entries, project titles, and supporting hierarchy."
            >
              <h3 className="font-heading text-primary text-2xl leading-[1.12] font-semibold tracking-[-0.015em]">
                Health information and data workflows
              </h3>
            </Specimen>

            <Specimen
              label="Signature Statement"
              description="Plus Jakarta Sans Medium Italic for one selective brand-signature placement."
            >
              <p className="font-heading text-accent text-3xl leading-[1.08] font-medium tracking-[0.06em] uppercase italic md:text-4xl">
                Pink, precise, and patient-centered.
              </p>
            </Specimen>

            <Specimen
              label="Body Copy"
              description="Nunito Sans for readable paragraphs, descriptions, forms, and supporting content."
            >
              <p className="text-muted font-sans text-base leading-relaxed md:text-lg">
                I&apos;m a software developer and Health Services Management student bringing a
                systems-and-data foundation into health information, healthcare data, and
                informatics.
              </p>
            </Specimen>

            <Specimen
              label="Metadata and Technical Labels"
              description="Geist Mono for eyebrows, project states, categories, dates, and technology labels."
            >
              <div className="space-y-3">
                <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
                  Current Professional Focus
                </p>

                <p className="text-subtle font-mono text-sm">
                  HEALTH INFORMATION · MEDICAL RECORDS · DATA WORKFLOWS
                </p>
              </div>
            </Specimen>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Identity Hierarchy"
          title="Present foundation, immediate transition, and long-term direction"
          description="Recruiter-facing pages should establish proven experience first, clearly identify the current healthcare transition, and present the advocacy and informatics goal as the long-term direction."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <HierarchyCard
              number="01"
              label="Professional Foundation"
              title="Software, systems, and data"
              description="Professional software development, structured data, SQL and databases, documentation, accessibility, testing, troubleshooting, and production ownership."
            />

            <HierarchyCard
              number="02"
              label="Immediate Focus"
              title="Health information and medical records"
              description="Building hands-on healthcare experience through medical records, documentation workflows, information accuracy, data quality, and healthcare operations."
              highlighted
            />

            <HierarchyCard
              number="03"
              label="Long-Term Direction"
              title="Women's Health Equity Advocate & Informatician"
              description="Connecting health information, data, research, digital health, and patient-centered technology to support clearer and more equitable care."
              editorial
            />
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Brand Expressions"
          title="One identity with two coordinated visual languages"
          description="The active expression follows the purpose of the content. Pink Academia supports clarity, advocacy, education, and professional communication. Pink Informatics Night supports technical exploration, data, systems, research, and immersive digital work."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <ExpressionCard
              label="Light Expression"
              title="Pink Academia"
              tone="Warm, clear, scholarly"
              description="A feminine academic environment for healthcare, advocacy, education, professional communication, and reflective learning."
              uses={[
                "Healthcare and women’s health equity",
                "Patient education and health literacy",
                "Academic notes and course reflections",
                "Recruiter-facing and professional materials",
                "Long-form writing and research summaries",
              ]}
              visualLanguage={[
                "Blush Paper and Warm Cream",
                "Deep Plum typography",
                "Accessible Rose controls",
                "Warm aura glows",
                "Lilac, aqua, mint, and gold signals",
              ]}
            />

            <ExpressionCard
              label="Dark Expression"
              title="Pink Informatics Night"
              tone="Luminous, technical, immersive"
              description="A feminine digital research environment for informatics, data, systems, technical projects, and investigative work."
              uses={[
                "Health informatics and healthcare data",
                "Software and system workflows",
                "SQL, Python, and Power BI learning",
                "Research methods and project demonstrations",
                "Technical livestreams and build sessions",
              ]}
              visualLanguage={[
                "Night Plum and Deep Aubergine",
                "Blush White typography",
                "Luminous pink and aqua glows",
                "Periwinkle, lilac, mint, and gold signals",
                "Data grids, nodes, glass, and illuminated depth",
              ]}
              technical
            />
          </div>

          <div className="border-default bg-card shadow-card rounded-3xl border p-6 backdrop-blur md:p-8">
            <Eyebrow>Shared Brand Foundation</Eyebrow>

            <p className="text-muted mt-4 max-w-4xl text-base leading-relaxed md:text-lg">
              Both expressions use Plus Jakarta Sans, Nunito Sans, Geist Mono, the same warm pink
              family, spacious layouts, rounded forms, data-node motifs, and the same professional
              hierarchy. They should always feel like Ariela Israel, never like separate brands.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <ChipThinBorder>Feminine</ChipThinBorder>
              <ChipThinBorder>Academic</ChipThinBorder>
              <ChipRegBorder>Data-Informed</ChipRegBorder>
              <ChipRegBorder>Patient-Centered</ChipRegBorder>
              <ChipThinBorder>Precise</ChipThinBorder>
              <ChipRegBorder>Technically Grounded</ChipRegBorder>
            </div>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Dynamic Color System"
          title={isDark ? "Pink Informatics Night" : "Pink Academia"}
          description={
            isDark
              ? "The dark expression uses Night Plum surfaces, luminous pink glows, and technical aqua, periwinkle, lilac, mint, and gold signals."
              : "The light expression uses warm paper surfaces, concentrated pink emphasis, Deep Plum typography, and selective academic, healthcare, and data signals."
          }
        >
          <TokenGroup
            title={`${isDark ? "Dark" : "Light"} Brand Palette`}
            tokens={activePaletteTokens}
          />

          <DynamicTokenGroup
            title="Theme-Aware Interface Tokens"
            tokens={interfaceTokens}
            mode={mode}
          />
        </DesignSection>

        <DesignSection
          eyebrow="Background Treatments"
          title="Atmosphere without visual crowding"
          description="The portfolio uses three supporting treatments. They should establish tone without competing with text, professional evidence, or calls to action."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="hero-ambient border-default relative isolate min-h-64 overflow-hidden rounded-[2rem] border p-6">
              <div
                aria-hidden="true"
                className="data-grid data-grid-fade pointer-events-none absolute inset-0 -z-10 opacity-50"
              />

              <Eyebrow>Hero Ambient</Eyebrow>

              <h3 className="font-heading text-primary mt-4 text-2xl font-bold tracking-tight">
                Homepage atmosphere
              </h3>

              <p className="text-muted mt-3 text-sm leading-relaxed">
                Layered Aura Center, Scholar Lilac, and Digital Aqua light with the data-grid
                treatment reserved for high-level brand framing.
              </p>
            </div>

            <div className="soft-wash border-default shadow-card rounded-[2rem] border p-6">
              <Eyebrow>Soft Wash</Eyebrow>

              <h3 className="font-heading text-primary mt-4 text-2xl font-bold tracking-tight">
                Editorial emphasis
              </h3>

              <p className="text-muted mt-3 text-sm leading-relaxed">
                Used for the Informatics Diary, advocacy sections, and reflective content that
                benefits from a softer atmosphere.
              </p>
            </div>

            <div className="glass-panel shadow-glow rounded-[2rem] p-6">
              <Eyebrow>Glass Panel</Eyebrow>

              <h3 className="font-heading text-primary mt-4 text-2xl font-bold tracking-tight">
                Direction and summary
              </h3>

              <p className="text-muted mt-3 text-sm leading-relaxed">
                Used for current-direction cards, compact professional summaries, and information
                that needs gentle separation from the page.
              </p>
            </div>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Cards"
          title="Every reusable card treatment"
          description="Each existing card component has a distinct purpose. New layouts should reuse these components before introducing another card treatment."
        >
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardContent
                label="Card"
                title="Professional evidence"
                description="Default treatment for projects, experience summaries, principles, and highly scannable content."
              />
            </Card>

            <CardWithGlow>
              <CardContent
                label="Card With Glow"
                title="High-emphasis evidence"
                description="Used when an important professional item needs stronger separation without changing the core card structure."
              />
            </CardWithGlow>

            <GlassCard>
              <CardContent
                label="Glass Card"
                title="Direction and summary"
                description="Used for professional snapshots, focus areas, academic direction, and compact supporting information."
              />
            </GlassCard>

            <EditorialCard>
              <CardContent
                label="Editorial Card"
                title="Long-form context"
                description="Used for structured narrative content that needs a clean editorial surface without an atmospheric wash."
              />
            </EditorialCard>

            <SoftWashCard>
              <CardContent
                label="Soft-Wash Card"
                title="Editorial and advocacy"
                description="Used selectively for the Diary, equity-focused content, and reflective narrative sections."
              />
            </SoftWashCard>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Chips"
          title="Every reusable chip treatment"
          description="Readable chips communicate skills and focus areas. Monospaced chips identify technologies, context, and project status."
        >
          <div className="border-default bg-surface space-y-8 rounded-3xl border p-6">
            <ChipExample
              label="Readable chips"
              description="Used for competencies, professional focus areas, and language that should be read naturally."
            >
              <ChipThinBorder>Documentation</ChipThinBorder>
              <ChipRegBorder>Healthcare Data</ChipRegBorder>
              <ChipPrimary>Health Information</ChipPrimary>
              <ChipAccent>Quality Assurance</ChipAccent>
            </ChipExample>

            <ChipExample
              label="Metadata chips"
              description="Used for technologies, project context, evidence type, and build status."
            >
              <ChipTech>PostgreSQL</ChipTech>
              <ChipMono>Educational Project</ChipMono>
              <ChipContext>Professional Work</ChipContext>
              <ChipStatus>Built</ChipStatus>
              <ChipStatus>Planned</ChipStatus>
            </ChipExample>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Project Primitives"
          title="Reusable project labels and technology badges"
          description="These compact components keep project categories and technology labels consistent across standard and featured project cards."
        >
          <div className="border-default bg-surface shadow-card rounded-3xl border p-6 md:p-8">
            <SectionLabel>Health Information + Data Systems</SectionLabel>

            <h3 className="font-heading text-primary text-2xl font-semibold">
              Health Record Data Quality Lab
            </h3>

            <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
              A planned educational project using synthetic health-record data to explore missing
              information, inconsistent formatting, potential duplicate records, validation rules,
              and data-quality reporting.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StackBadge label="SQL" />
              <StackBadge label="PostgreSQL" />
              <StackBadge label="Python" />
              <StackBadge label="Synthetic Data" />
            </div>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Competencies"
          title="Shared language across bridge-role families"
          description="The portfolio demonstrates transferable capabilities rather than presenting a separate identity for every possible role."
        >
          <div className="border-default bg-card shadow-card rounded-3xl border p-6 backdrop-blur md:p-8">
            <div className="flex flex-wrap gap-3">
              {professionalStrengths.map((strength) => (
                <ChipRegBorder key={strength}>{strength}</ChipRegBorder>
              ))}
            </div>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Actions"
          title="Every reusable action treatment"
          description="Primary actions support professional evaluation. Secondary and tertiary actions provide context. Inline actions guide visitors without adding another prominent button."
        >
          <div className="border-default bg-surface space-y-8 rounded-3xl border p-6">
            <ActionExample
              label="Primary and disabled actions"
              description="Use one primary CTA within a local action group. Disabled treatment communicates genuinely unavailable work."
            >
              <PrimaryCTA link="/experience" label="View Experience" />

              <PrimaryCTA link="/projects" label="Coming Soon" status="disabled" />
            </ActionExample>

            <ActionExample
              label="Secondary and tertiary actions"
              description="Secondary actions provide professional context. Tertiary actions support technical or healthcare-data routes."
            >
              <SecondaryCTA link="/resume/arielaisrael-resume.pdf" label="View Resume" />

              <TertiaryCTA link="/projects" label="Explore Projects" />
            </ActionExample>

            <ActionExample
              label="Inline action"
              description="Use for compact card actions and low-emphasis navigation."
            >
              <PrimaryBtn link="/field-notes" label="Read Field Notes" />
            </ActionExample>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Interaction States"
          title="Active, inactive, and linked states"
          description="Interaction colors communicate state without changing the established shape or spacing of the component."
        >
          <div className="border-default bg-surface flex flex-wrap items-end gap-8 rounded-3xl border p-6">
            <div>
              <p className="text-subtle mb-3 text-sm font-semibold">Navigation pill</p>

              <div className="border-default bg-surface/70 shadow-card flex rounded-full border p-1">
                <span className="bg-chip-bg text-accent rounded-full px-4 py-2 font-mono text-[0.68rem] font-semibold tracking-[0.2em] uppercase">
                  Active
                </span>

                <span className="text-subtle px-4 py-2 font-mono text-[0.68rem] font-semibold tracking-[0.2em] uppercase">
                  Inactive
                </span>
              </div>
            </div>

            <div>
              <p className="text-subtle mb-3 text-sm font-semibold">Text link</p>

              <a
                href="#experimental-components"
                className="ring-brand text-link rounded-sm font-semibold transition hover:underline hover:underline-offset-4"
              >
                Explore experimental components
              </a>
            </div>

            <div>
              <p className="text-subtle mb-3 text-sm font-semibold">Focusable control</p>

              <button
                type="button"
                className="ring-brand border-default bg-surface text-foreground rounded-full border px-4 py-2 text-sm font-semibold"
              >
                Keyboard focus preview
              </button>
            </div>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Depth and Shape"
          title="Rounded, soft, and structured"
          description="Large radii and restrained shadows support the feminine visual identity while borders and consistent spacing preserve professional structure."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <ReferenceCard
              label="Radius"
              title="Cards and panels"
              description="Use rounded-2xl, rounded-3xl, or rounded-[2rem]. Reserve rounded-full for buttons, chips, and navigation pills."
            />

            <ReferenceCard
              label="Shadow"
              title="Subtle elevation"
              description="Use shadow-card by default, shadow-pop for hover states, and shadow-glow only for glass or high-emphasis panels."
            />

            <ReferenceCard
              label="Spacing"
              title="Room to scan"
              description="Use generous section spacing, compact card interiors, and controlled paragraph widths. Avoid adding content only to fill space."
            />
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Content and Visual Restraint"
          title="Professional first, expressive where it adds meaning"
          description="The portfolio should feel related to the social ecosystem without adopting the density or decoration of a social-media graphic."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Specimen
              label="Recruiter-Facing Areas"
              description="Homepage, Experience, professional projects, navigation, resume access, and contact form."
            >
              <ul className="text-muted space-y-3 text-sm leading-relaxed md:text-base">
                <li>Use concise, evidence-based language.</li>
                <li>Keep decorative imagery and emojis out of critical actions.</li>
                <li>Prioritize experience, accuracy, documentation, systems, and outcomes.</li>
                <li>Use standard cards, clear labels, and strong contrast.</li>
              </ul>
            </Specimen>

            <Specimen
              label="Editorial Areas"
              description="The Informatics Diary, advocacy sections, and selective future-facing project content."
            >
              <ul className="text-muted space-y-3 text-sm leading-relaxed md:text-base">
                <li>Use soft-wash surfaces and atmospheric spacing.</li>
                <li>Allow one intentional visual motif or editorial composition per page.</li>
                <li>Use emojis only when they support voice or meaning.</li>
                <li>Keep decoration away from paragraphs and interactive controls.</li>
              </ul>
            </Specimen>
          </div>
        </DesignSection>

        <DesignSection
          eyebrow="Writing Direction"
          title="Precise, grounded, and purpose-led"
          description="Professional experience, developing knowledge, advocacy, and future direction should remain clearly distinguished."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Specimen
              label="Recruiter-Facing"
              description="Concrete, evidence-based, and immediately relevant."
            >
              <p className="text-foreground text-base leading-relaxed">
                I bring professional experience managing production software, structured data,
                documentation, testing, troubleshooting, accessibility, and operational workflows.
                I&apos;m now applying that foundation within health information and healthcare
                systems.
              </p>
            </Specimen>

            <Specimen
              label="Long-Term Direction"
              description="Purposeful, personal, and clearly identified as future-facing."
            >
              <p className="font-heading text-primary text-3xl leading-[1.08] font-medium tracking-[-0.02em]">
                I&apos;m building toward becoming a Women&apos;s Health Equity Advocate &amp;
                Informatician.
              </p>

              <p className="text-muted mt-4 text-sm leading-relaxed">
                My advocacy centers racially underserved and underrepresented women who are too
                often dismissed, diagnosed late, undertreated, overlooked in research, or left
                without clear information and coordinated care.
              </p>
            </Specimen>
          </div>
        </DesignSection>

        <section id="experimental-components" className="scroll-mt-10 space-y-7">
          <div className="max-w-3xl">
            <Eyebrow>Experimental Components</Eyebrow>

            <h2 className="font-heading text-primary mt-3 text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl">
              Focused patterns worth testing
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
              These additions should only move into the main portfolio when they improve
              comprehension, professional evaluation, or access to meaningful work.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <RecruiterSnapshot />

            <ProfessionalEvidenceBanner />

            <LearningProjectPreview />

            <FieldNotePreview />
          </div>
        </section>
      </div>
    </main>
  );
}

function DesignSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-7">
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h2 className="font-heading text-primary mt-3 text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl">
          {title}
        </h2>

        <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">{description}</p>
      </div>

      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
      {children}
    </p>
  );
}

function Specimen({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border-default bg-surface shadow-card rounded-3xl border p-6 md:p-8">
      <div className="mb-6">
        <p className="text-accent font-mono text-xs font-semibold tracking-[0.2em] uppercase">
          {label}
        </p>

        <p className="text-subtle mt-2 text-sm leading-relaxed">{description}</p>
      </div>

      {children}
    </article>
  );
}

function HierarchyCard({
  number,
  label,
  title,
  description,
  highlighted = false,
  editorial = false,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
  highlighted?: boolean;
  editorial?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-6 ${
        highlighted
          ? "border-tech-chip-border bg-surface-aqua shadow-card"
          : editorial
            ? "border-default soft-wash shadow-card"
            : "border-default bg-surface shadow-card"
      }`}
    >
      <p className="text-accent font-mono text-xs font-semibold tracking-[0.2em]">{number}</p>

      <p className="text-subtle mt-6 text-xs font-bold tracking-[0.16em] uppercase">{label}</p>

      <h3 className="font-heading text-primary mt-3 text-2xl leading-[1.12] font-semibold tracking-[-0.015em]">
        {title}
      </h3>

      <p className="text-muted mt-4 text-sm leading-relaxed">{description}</p>
    </article>
  );
}

function TokenGroup({ title, tokens }: { title: string; tokens: PaletteToken[] }) {
  return (
    <div className="mt-10 space-y-4">
      <h3 className="font-heading text-primary text-xl leading-[1.12] font-semibold tracking-[-0.015em]">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {tokens.map((token) => (
          <PaletteSwatch key={token.variable} token={token} />
        ))}
      </div>
    </div>
  );
}

function DynamicTokenGroup({
  title,
  tokens,
  mode,
}: {
  title: string;
  tokens: DynamicColorToken[];
  mode: ThemeMode;
}) {
  return (
    <div className="mt-12 space-y-4">
      <h3 className="font-heading text-primary text-xl leading-[1.12] font-semibold tracking-[-0.015em]">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {tokens.map((token) => (
          <DynamicColorSwatch key={token.variable} token={token} mode={mode} />
        ))}
      </div>
    </div>
  );
}

function PaletteSwatch({ token }: { token: PaletteToken }) {
  return (
    <article className="border-default bg-surface overflow-hidden rounded-2xl border">
      <div
        className="border-default h-24 border-b"
        style={{ backgroundColor: `var(${token.variable})` }}
      />

      <div className="p-4">
        <p className="text-foreground text-sm font-bold">{token.label}</p>

        <p className="text-accent mt-2 font-mono text-xs font-semibold">{token.value}</p>

        <p className="text-subtle mt-1 font-mono text-[0.68rem]">{token.variable}</p>

        <p className="text-muted mt-3 text-xs leading-relaxed">{token.purpose}</p>
      </div>
    </article>
  );
}

function DynamicColorSwatch({ token, mode }: { token: DynamicColorToken; mode: ThemeMode }) {
  const value = mode === "dark" ? token.darkValue : token.lightValue;

  const purpose = mode === "dark" ? token.darkPurpose : token.lightPurpose;

  return (
    <article className="border-default bg-surface overflow-hidden rounded-2xl border">
      <div
        className="border-default h-24 border-b"
        style={{ backgroundColor: `var(${token.variable})` }}
      />

      <div className="p-4">
        <p className="text-foreground text-sm font-bold">{token.label}</p>

        <p className="text-accent mt-2 font-mono text-xs font-semibold">{value}</p>

        <p className="text-subtle mt-1 font-mono text-[0.68rem]">{token.variable}</p>

        <p className="text-muted mt-3 text-xs leading-relaxed">{purpose}</p>
      </div>
    </article>
  );
}

function CardContent({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <>
      <Eyebrow>{label}</Eyebrow>

      <h3 className="font-heading text-primary mt-4 text-2xl font-semibold">{title}</h3>

      <p className="text-muted mt-3 text-sm leading-relaxed">{description}</p>
    </>
  );
}

function ChipExample({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold">{label}</p>

      <p className="text-subtle mt-1 text-sm leading-relaxed">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ActionExample({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold">{label}</p>

      <p className="text-subtle mt-1 max-w-2xl text-sm leading-relaxed">{description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

function ReferenceCard({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <article className="border-default bg-surface shadow-card rounded-3xl border p-6">
      <Eyebrow>{label}</Eyebrow>

      <h3 className="font-heading text-primary mt-4 text-2xl font-semibold">{title}</h3>

      <p className="text-muted mt-3 text-sm leading-relaxed">{description}</p>
    </article>
  );
}

function RecruiterSnapshot() {
  return (
    <article className="border-default bg-surface shadow-card rounded-[2rem] border p-6 md:p-8">
      <Eyebrow>Experiment 01</Eyebrow>

      <h3 className="font-heading text-primary mt-4 text-3xl leading-tight font-bold tracking-tight">
        Recruiter snapshot
      </h3>

      <p className="text-muted mt-3 text-sm leading-relaxed">
        A compact professional hierarchy for pages where a visitor needs the full direction without
        reading a longer biography.
      </p>

      <div className="border-default mt-7 divide-y border-y">
        <SnapshotRow
          label="Proven"
          value="Production software, structured data, documentation, quality assurance, accessibility, and operational workflows."
        />

        <SnapshotRow
          label="Seeking"
          value="Hands-on experience in health information, medical records, documentation workflows, and healthcare data support."
        />

        <SnapshotRow label="Direction" value="Women's Health Equity Advocate & Informatician." />
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <PrimaryCTA link="/experience" label="View Experience" />

        <SecondaryCTA link="/resume/arielaisrael-resume.pdf" label="View Resume" />
      </div>
    </article>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
      <p className="text-accent font-mono text-xs font-semibold tracking-[0.16em] uppercase">
        {label}
      </p>

      <p className="text-muted text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function ProfessionalEvidenceBanner() {
  return (
    <article className="glass-panel shadow-glow rounded-[2rem] p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        <ChipContext>Professional Foundation</ChipContext>
        <ChipStatus>Proven Experience</ChipStatus>
      </div>

      <h3 className="font-heading text-primary mt-5 text-3xl leading-tight font-bold tracking-tight">
        Production systems and operational workflows
      </h3>

      <p className="text-muted mt-4 text-sm leading-relaxed">
        Professional software experience demonstrating structured information, technical ownership,
        documentation, testing, accessibility, troubleshooting, and systems designed around real
        operational needs.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <ChipThinBorder>Structured Data</ChipThinBorder>
        <ChipThinBorder>Documentation</ChipThinBorder>
        <ChipRegBorder>Workflow Analysis</ChipRegBorder>
        <ChipRegBorder>Accessibility</ChipRegBorder>
      </div>

      <div className="mt-7">
        <PrimaryBtn link="/experience" label="Review Professional Experience" />
      </div>
    </article>
  );
}

function LearningProjectPreview() {
  return (
    <article className="border-tech-chip-border bg-surface-aqua shadow-card rounded-[2rem] border p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        <ChipMono>Educational Lab</ChipMono>
        <ChipStatus>Planned</ChipStatus>
      </div>

      <h3 className="font-heading text-primary mt-5 text-3xl leading-tight font-bold tracking-tight">
        Health Record Data Quality Lab
      </h3>

      <p className="text-muted mt-4 text-sm leading-relaxed">
        A synthetic-data learning project exploring missing information, inconsistent formatting,
        potential duplicate records, validation rules, and data-quality reporting.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <ChipTech>SQL</ChipTech>
        <ChipTech>PostgreSQL</ChipTech>
        <ChipTech>Python</ChipTech>
        <ChipRegBorder>Data Quality</ChipRegBorder>
        <ChipRegBorder>Synthetic Data</ChipRegBorder>
      </div>

      <div className="border-default mt-7 border-t pt-6">
        <p className="text-subtle font-mono text-xs font-semibold tracking-[0.16em] uppercase">
          Why this treatment may help
        </p>

        <p className="text-muted mt-3 text-sm leading-relaxed">
          It separates a developing educational lab from completed professional work while still
          showing its relevance to the health-information transition.
        </p>
      </div>

      <div className="mt-7">
        <SecondaryCTA link="/projects" label="View Project Roadmap" />
      </div>
    </article>
  );
}

function FieldNotePreview() {
  return (
    <article className="soft-wash border-default shadow-card rounded-[2rem] border p-6 md:p-8">
      <div className="flex flex-wrap gap-2">
        <ChipContext>The Informatics Diary</ChipContext>
        <ChipStatus>Field Note</ChipStatus>
      </div>

      <p className="text-subtle mt-6 font-mono text-xs font-semibold tracking-[0.16em] uppercase">
        Academic Becoming
      </p>

      <h3 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight">
        Learning how health information moves through real systems
      </h3>

      <p className="text-muted mt-4 text-sm leading-relaxed">
        A preview treatment for concise field notes connecting coursework, developing healthcare
        knowledge, technical foundations, and questions that may later become deeper essays or
        projects.
      </p>

      <div className="border-default mt-7 border-t pt-6">
        <PrimaryBtn link="/field-notes" label="Read Field Notes" />
      </div>
    </article>
  );
}

function ExpressionCard({
  label,
  title,
  tone,
  description,
  uses,
  visualLanguage,
  technical = false,
}: {
  label: string;
  title: string;
  tone: string;
  description: string;
  uses: string[];
  visualLanguage: string[];
  technical?: boolean;
}) {
  return (
    <article
      className={`rounded-[2rem] border p-6 md:p-8 ${
        technical
          ? "border-tech-chip-border bg-surface-aqua shadow-glow"
          : "border-default soft-wash shadow-card"
      }`}
    >
      <Eyebrow>{label}</Eyebrow>

      <h3 className="font-heading text-primary mt-4 text-3xl leading-tight font-bold tracking-tight md:text-4xl">
        {title}
      </h3>

      <p className="text-secondary mt-3 font-mono text-xs font-semibold tracking-[0.16em] uppercase">
        {tone}
      </p>

      <p className="text-muted mt-5 text-sm leading-relaxed md:text-base">{description}</p>

      <div className="border-default mt-7 border-t pt-6">
        <p className="text-foreground text-sm font-bold">Best used for</p>

        <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
          {uses.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="text-accent">
                ✦
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-default mt-6 border-t pt-6">
        <p className="text-foreground text-sm font-bold">Visual language</p>

        <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
          {visualLanguage.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="text-secondary">
                ◦
              </span>

              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

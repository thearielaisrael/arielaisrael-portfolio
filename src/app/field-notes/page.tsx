import Link from "next/link";

import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";
import { Card, SoftWashCard } from "@/src/components/ui/Cards";
import { ChipMono } from "@/src/components/ui/Chips";
import { SecondaryCTA } from "@/src/components/ui/Buttons";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Informatics Diary",

  description:
    "Independent field notes documenting Ariela Israel's transition from software development into health information, healthcare data, informatics, and women's health equity advocacy.",

  alternates: {
    canonical: "/field-notes",
  },

  openGraph: {
    title: "The Informatics Diary",
    description:
      "Field notes on health information, digital health, healthcare data, academic learning, and women's health equity.",
    url: "/field-notes",
    type: "website",
  },
};

const writingThemes = [
  {
    label: "EQUITY",
    title: "Women's Health Equity",
    description:
      "Writing on racial disparities, patient dismissal, delayed diagnosis, undertreatment, medical bias, research gaps, care access, and the experiences of women who are too often unheard.",
  },
  {
    label: "INFORMATION",
    title: "Health Information + Systems",
    description:
      "Learning notes on documentation, data quality, healthcare workflows, information systems, and how health information moves through care environments.",
  },
  {
    label: "DATA + TECH",
    title: "Digital Health + Healthcare Data",
    description:
      "Explorations of structured data, digital tools, accessibility, dashboards, information design, and the responsible interpretation of healthcare data.",
  },
  {
    label: "LEARNING",
    title: "Academic Becoming",
    description:
      "Field notes from studying Health Services Management, health information, data analytics, informatics, research practices, and professional development.",
  },
];

export default function FieldNotesPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="The Informatics Diary"
        heading="Field notes on health information, digital health, and women's health equity"
        description="The Informatics Diary documents my transition from software development into health information, healthcare data, and informatics."
        supportingText="I write about what I'm learning through my Health Services Management education, health-tech projects, research, and developing understanding of healthcare systems as I work toward becoming a Women's Health Equity Advocate & Informatician."
        actions={
          <>
            <a
              href="https://theinformaticsdiary.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Read on Substack ↗
            </a>

            <SecondaryCTA link="/projects" label="View Projects" />
          </>
        }
      />

      <section aria-labelledby="editorial-purpose-heading" className="mt-16 md:mt-20">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Editorial Purpose</SectionLabel>

              <h2
                id="editorial-purpose-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                A place to study carefully and think in public
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                My advocacy centers racially underserved and underrepresented women who are too
                often dismissed, diagnosed late, undertreated, overlooked in research, or left
                without clear information and coordinated care. Everyone is welcome to learn, but
                the women most affected by these disparities remain at the center.
              </p>

              <p>
                The writing is exploratory and evidence-conscious. I aim to distinguish established
                information from interpretation, cite credible sources, document limitations, and
                avoid presenting developing knowledge as professional clinical authority.
              </p>

              <p className="text-sm">
                The Informatics Diary is educational and does not provide medical advice, diagnosis,
                or individualized treatment guidance.
              </p>
            </div>
          </div>
        </SoftWashCard>
      </section>

      <section aria-labelledby="writing-themes-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Writing Themes</SectionLabel>

          <h2
            id="writing-themes-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            What I&apos;m studying and documenting
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            The archive follows four connected areas rather than treating healthcare, technology,
            research, and equity as separate interests.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {writingThemes.map((theme) => (
            <Card key={theme.title}>
              <article>
                <ChipMono>{theme.label}</ChipMono>

                <h3 className="font-heading text-primary mt-4 text-2xl leading-tight font-semibold">
                  {theme.title}
                </h3>

                <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                  {theme.description}
                </p>
              </article>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-default mt-20 border-t pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Read the Diary</SectionLabel>

            <h2 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold md:text-4xl">
              Essays and field notes live on Substack
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed">
              Visit The Informatics Diary for published writing, research notes, and updates as the
              archive develops.
            </p>
          </div>

          <Link
            href="https://theinformaticsdiary.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ring-brand border-default bg-surface text-foreground hover:border-strong hover:bg-surface-soft shadow-card inline-flex w-fit items-center justify-center rounded-full border px-5 py-2.5 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 md:text-base"
          >
            Open The Informatics Diary ↗
          </Link>
        </div>
      </section>
    </main>
  );
}

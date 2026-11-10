import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";
import { SecondaryCTA } from "@/src/components/ui/Buttons";
import { Card, SoftWashCard } from "@/src/components/ui/Cards";
import { ChipMono } from "@/src/components/ui/Chips";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Informatics Diary",

  description:
    "Read Ariela Israel's public learning archive exploring Black women's health equity, research methods, health information, clinical and biomedical informatics, health data, and precision medicine.",

  alternates: {
    canonical: "/writing",
  },

  openGraph: {
    title: "The Informatics Diary | Ariela Israel",
    description:
      "A public learning archive documenting developing knowledge in Black women's health equity, research, health data, and clinical and biomedical informatics.",
    url: "/writing",
    type: "website",
  },
};

const writingThemes = [
  {
    key: "black-womens-health-equity",
    label: "EQUITY",
    title: <>Black Women&apos;s Whole-Body Health Equity</>,
    description: (
      <>
        Writing about diagnostic disparities, undertreatment, fragmented care, research gaps,
        medical bias, incomplete clinical recognition, and the evidence shaping Black women&apos;s
        health across conditions and specialties.
      </>
    ),
  },
  {
    key: "health-data-informatics",
    label: "HEALTH DATA + INFORMATICS",
    title: <>Health Information and Biomedical Informatics</>,
    description: (
      <>
        Learning notes on clinical documentation, data quality, longitudinal health information,
        clinical phenotyping, healthcare workflows, information systems, and how information moves
        through care and research environments.
      </>
    ),
  },
  {
    key: "research-evidence",
    label: "RESEARCH + EVIDENCE",
    title: <>Research Literacy and Responsible Interpretation</>,
    description: (
      <>
        Explorations of research methods, scientific literature, study design, evidence quality,
        analytical limitations, research representation, precision medicine, and responsible
        interpretation.
      </>
    ),
  },
  {
    key: "academic-path",
    label: "ACADEMIC PATH",
    title: <>Learning in Public</>,
    description: (
      <>
        Field notes from studying Health Services Management, health information, data analytics,
        research methods, informatics, and the questions shaping my developing academic and
        professional direction.
      </>
    ),
  },
];

export default function WritingPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="The Informatics Diary"
        heading="Field notes on health equity, evidence, data, and informatics"
        description={
          <>
            The Informatics Diary is my public learning archive exploring Black women&apos;s health
            equity through research, clinical and biomedical informatics, health data, and precision
            medicine.
          </>
        }
        supportingText={
          <>
            I document what I&apos;m studying, reading, questioning, analyzing, and building while
            remaining transparent about my current academic stage and the knowledge I&apos;m still
            developing.
          </>
        }
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

            <SecondaryCTA link="/research" label="Explore My Research Direction" />
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
                A place to study carefully, question responsibly, and think in public
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                The Informatics Diary begins with a central concern: Black women&apos;s symptoms,
                pain, conditions, and care experiences are not always adequately recognized,
                studied, represented, or understood within healthcare and biomedical research.
              </p>

              <p>
                I&apos;m especially interested in diagnostic disparities, fragmented care,
                longitudinal clinical information, research representation, clinical phenotyping,
                precision medicine, and how stronger evidence and better information systems could
                support more equitable clinical recognition.
              </p>

              <p>
                The Diary gives me a place to explore these subjects while my knowledge is still
                developing. I use writing to examine questions, connect ideas across disciplines,
                evaluate evidence, reflect on what I&apos;m learning, and practice communicating
                complex information clearly.
              </p>

              <p>
                I aim to distinguish established evidence from interpretation, cite credible
                sources, identify data and methodological limitations, correct mistakes when they
                are discovered, and represent my academic and professional stage honestly.
              </p>

              <p className="text-sm">
                I am a student, not a clinician or medical expert. The Informatics Diary is
                educational and does not provide medical advice, diagnosis, individualized treatment
                guidance, or professional clinical authority.
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
            What I&apos;m studying, questioning, and documenting
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            The archive follows four connected areas that reflect the interdisciplinary path
            I&apos;m building across healthcare, information, research, equity, and technology.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {writingThemes.map((theme) => (
            <Card key={theme.key}>
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

      <section aria-labelledby="read-diary-heading" className="border-default mt-20 border-t pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Read the Diary</SectionLabel>

            <h2
              id="read-diary-heading"
              className="font-heading text-primary mt-3 text-3xl leading-tight font-bold md:text-4xl"
            >
              Essays, research notes, and field notes live on Substack
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed">
              Visit The Informatics Diary to follow my academic development, research questions,
              evidence reviews, project work, and developing understanding of Black women&apos;s
              health equity, clinical and biomedical informatics, health data, and precision
              medicine.
            </p>
          </div>

          <a
            href="https://theinformaticsdiary.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ring-brand border-default bg-surface text-foreground hover:border-strong hover:bg-surface-soft shadow-card inline-flex w-fit items-center justify-center rounded-full border px-5 py-2.5 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 md:text-base"
          >
            Open The Informatics Diary ↗
          </a>
        </div>
      </section>
    </main>
  );
}

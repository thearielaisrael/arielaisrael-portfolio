import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";
import { SecondaryCTA } from "@/src/components/ui/Buttons";
import { Card, SoftWashCard } from "@/src/components/ui/Cards";
import { ChipMono } from "@/src/components/ui/Chips";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Informatics Diary",

  description:
    "Read The Informatics Diary, Ariela Israel's student-led public learning archive exploring women's health equity, health information, biomedical informatics, healthcare data, research literacy, and academic development.",

  alternates: {
    canonical: "/writing",
  },

  openGraph: {
    title: "The Informatics Diary | Ariela Israel",
    description:
      "Student-led writing and learning notes exploring women's health equity, health information, biomedical informatics, healthcare data, research literacy, and academic development.",
    url: "/writing",
    type: "website",
  },
};

const writingThemes = [
  {
    label: "EQUITY",
    title: "Women's Whole-Body Health Equity",
    description:
      "Writing about racial disparities, delayed diagnosis, undertreatment, fragmented care, research gaps, medical bias, and the experiences of women who are too often unheard or insufficiently represented.",
  },
  {
    label: "HEALTH DATA + INFORMATICS",
    title: "Health Information and Biomedical Informatics",
    description:
      "Learning notes on documentation, data quality, longitudinal health information, clinical and biomedical informatics, healthcare workflows, information systems, and how information moves through care environments.",
  },
  {
    label: "RESEARCH + EVIDENCE",
    title: "Research Literacy and Responsible Interpretation",
    description:
      "Explorations of research methods, scientific literature, public health data, evidence quality, analytical limitations, precision medicine, and the responsible interpretation of health information.",
  },
  {
    label: "ACADEMIC PATH",
    title: "Learning in Public",
    description:
      "Field notes from studying Health Services Management, Health Information Management and Data Analytics, research practices, informatics, professional development, and the questions shaping my future direction.",
  },
];

export default function WritingPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="The Informatics Diary"
        heading="Field notes on women's health equity, information, research, and informatics"
        description="The Informatics Diary is my student-led public writing and learning archive."
        supportingText="I document what I'm studying, questioning, reading, and building as I develop toward work in women's health equity, clinical and biomedical informatics, and research."
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
                My advocacy centers racially underserved and underrepresented women whose symptoms,
                pain, concerns, and whole-body health are too often dismissed, misunderstood,
                diagnosed late, undertreated, or overlooked in research and healthcare data.
              </p>

              <p>
                I&apos;m especially interested in racial disparities, delayed diagnosis, fragmented
                care, longitudinal health information, clinical and biomedical informatics, and how
                research and data may contribute to more precise and equitable care. Everyone is
                welcome to learn, but the women most affected by these disparities remain at the
                center.
              </p>

              <p>
                The Diary gives me a place to explore these subjects while my knowledge is still
                developing. I use writing to examine questions, connect ideas across disciplines,
                reflect on what I&apos;m learning, and practice communicating complex information
                clearly.
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
              Visit The Informatics Diary to follow my academic development, developing research
              interests, advocacy questions, project work, and path toward women&apos;s health
              equity and informatics.
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

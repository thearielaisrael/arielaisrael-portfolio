import PageHeader from "@/src/components/shared/PageHeader";

import { SectionLabel } from "@/src/components/projects/SectionLabel";

import { Card, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";

import { PrimaryCTA, SecondaryCTA } from "@/src/components/ui/Buttons";

import { ChipMono, ChipThinBorder } from "@/src/components/ui/Chips";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",

  description:
    "Learn about Ariela Israel's path toward clinical and biomedical informatics, women's health equity advocacy, health data, research, and precision medicine.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: "About Ariela Israel",
    description:
      "Health Services Management student, Women's Health Equity Advocate, and aspiring Clinical & Biomedical Informaticist building toward research in women's health equity.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="About Ariela"
        heading="Building toward the intersection of women's health equity, evidence, and informatics"
        description="I'm a Health Services Management student, Women's Health Equity Advocate, and aspiring Clinical & Biomedical Informaticist developing toward a research career focused on improving how women's health is understood through data, evidence, and technology."
        supportingText="My path brings together healthcare systems, clinical and biomedical informatics, research, health data, precision medicine, and a technical foundation in software engineering."
        actions={
          <>
            <PrimaryCTA link="/research" label="Explore My Research Direction" />
            <SecondaryCTA link="/cv" label="View My CV" />
          </>
        }
      />

      {/* PATH */}

      <section aria-labelledby="path-heading" className="mt-16 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="max-w-3xl">
            <SectionLabel>Academic &amp; Professional Path</SectionLabel>

            <h2
              id="path-heading"
              className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
            >
              From building systems to studying what they can reveal.
            </h2>

            <div className="text-muted mt-6 space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m pursuing a Bachelor of Science in Health Services Management at the
                University of Maryland Global Campus, alongside certificates in Health Information
                Management &amp; Data Analytics and Data Analytics.
              </p>

              <p>
                Through my undergraduate education, I&apos;m building a foundation in healthcare
                systems, health information, data, research, and the organizational context in which
                care occurs. I&apos;m especially interested in developing the research and
                analytical skills that will prepare me for graduate study in clinical and biomedical
                informatics.
              </p>

              <p>
                Before moving into healthcare, I worked in software development, building and
                supporting digital applications, databases, APIs, and operational workflows. That
                experience taught me to think in systems and to pay attention to structure, data,
                documentation, accessibility, reliability, and how information moves between people
                and technology.
              </p>

              <p>
                I don&apos;t intend to leave that technical foundation behind. Instead, I&apos;m
                learning how to apply it to a different set of questions.
              </p>

              <p className="text-foreground font-semibold">
                What information are healthcare systems capturing? What are they missing? Whose
                experiences are represented in the data? What patterns might exist across years of
                care? How can those patterns become evidence, and how can that evidence contribute
                to better decisions?
              </p>

              <p>
                Those questions are leading me toward clinical and biomedical informatics, where I
                hope to connect healthcare knowledge, data, research, technology, and advocacy.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <GlassCard>
            <div className="space-y-6">
              <InfoBlock
                label="Academic Path"
                body="BS in Health Services Management at UMGC, alongside certificates in Health Information Management & Data Analytics and Data Analytics."
              />

              <div>
                <SectionLabel>Certificates in Progress</SectionLabel>

                <div className="mt-3 flex flex-wrap gap-2">
                  <ChipThinBorder>
                    Health Information Management &amp; Data Analytics
                  </ChipThinBorder>

                  <ChipThinBorder>Data Analytics</ChipThinBorder>
                </div>
              </div>

              <InfoBlock
                label="Advocacy Focus"
                body="Racial and systemic disparities affecting underserved and underrepresented women across whole-body health."
              />

              <InfoBlock
                label="Research Interests"
                body="Longitudinal health data, clinical phenotyping, diagnostic disparities, clinical and biomedical informatics, precision medicine, and equitable clinical intelligence."
              />

              <InfoBlock
                label="Developing Methods"
                body="Research methods, statistics, scientific literature evaluation, health-data analysis, R, Python, and SQL."
              />

              <InfoBlock
                label="Technical Foundation"
                body="Software engineering, structured data systems, databases, APIs, documentation, accessibility, testing, and systems thinking."
              />

              <InfoBlock
                label="Long-Term Direction"
                body="Women's Health Equity Advocate, Clinical & Biomedical Informaticist, and researcher."
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* EQUITY LENS */}

      <section aria-labelledby="equity-heading" className="mt-20">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>Equity Lens</SectionLabel>

              <h2
                id="equity-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                The problem came before the technology.
              </h2>

              <p className="font-heading text-signature-aura-pink mt-6 text-xl leading-snug font-medium tracking-[0.04em] uppercase italic md:text-2xl">
                The advocacy and research fuel the technology, not the other way around.
              </p>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m interested in what happens when women aren&apos;t adequately represented,
                recognized, believed, studied, or understood within healthcare.
              </p>

              <p>
                My advocacy centers racially underserved and underrepresented women across
                whole-body health, not only reproductive health. I&apos;m especially interested in
                delayed diagnosis, undertreatment, fragmented care, research gaps, and information
                barriers.
              </p>

              <p>
                My interests extend across reproductive, endocrine, metabolic, cardiovascular,
                autoimmune, chronic illness, mental health, and multisystem concerns across the life
                course. Women&apos;s health cannot be understood through reproductive health alone.
              </p>

              <p>
                Those problems are what draw me toward research and informatics. I want to
                understand whether better data, stronger evidence, thoughtful informatics methods,
                and responsible computational tools can help identify patterns that medicine has
                historically overlooked.
              </p>

              <p>
                I&apos;m particularly interested in how longitudinal clinical and biomedical data
                can help investigate diagnostic disparities, improve clinical understanding, and
                support more precise and equitable care for women who have been underserved or
                underrepresented in healthcare and research.
              </p>
            </div>
          </div>
        </SoftWashCard>
      </section>

      {/* WORKING APPROACH */}

      <section aria-labelledby="approach-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Working Approach</SectionLabel>

          <h2
            id="approach-heading"
            className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Systems thinking. Evidence-conscious inquiry. People at the center.
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            I&apos;m drawn to work that requires accuracy, organization, thoughtful questions, clear
            documentation, evidence-conscious thinking, and respect for the people represented by
            the information.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <PrincipleCard
              label="SYSTEMS"
              title="Understand the full context"
              body="I look at relationships among people, information, processes, technology, constraints, and decisions rather than treating problems in isolation."
            />
          </Card>

          <Card>
            <PrincipleCard
              label="EVIDENCE"
              title="Question carefully"
              body="I value rigorous research, transparent limitations, reproducible thinking, clear documentation, and distinguishing what evidence shows from what I infer."
            />
          </Card>

          <Card>
            <PrincipleCard
              label="PEOPLE"
              title="Remember what the data represents"
              body="Behind every record, variable, outcome, and disparity are people. I want research, information, and technology to contribute to clearer understanding and more equitable care."
            />
          </Card>
        </div>
      </section>

      {/* DIRECTION */}

      <section aria-labelledby="direction-heading" className="mt-20">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <SectionLabel>Where I&apos;m Going</SectionLabel>

              <h2
                id="direction-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                Building toward research with room to contribute across healthcare.
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                After completing my undergraduate education, I intend to pursue graduate training in
                clinical and biomedical informatics while continuing to develop as a Women&apos;s
                Health Equity Advocate and researcher.
              </p>

              <p>
                I&apos;m preparing for work that can span research, health systems, government,
                industry, and mission-driven organizations. The setting may change, but I want the
                purpose of my work to remain consistent: connecting rigorous evidence, health
                information, and responsible technology to meaningful improvements in women&apos;s
                health.
              </p>
            </div>
          </div>

          <div className="border-default mt-8 border-t pt-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionLabel>Current Research Direction</SectionLabel>

                <p className="font-heading text-foreground mt-4 max-w-4xl text-2xl leading-tight font-semibold md:text-3xl">
                  How can clinical and biomedical informatics use longitudinal phenotyping to help
                  shorten diagnostic delay in women&apos;s health?
                </p>
              </div>

              <PrimaryCTA link="/research" label="Explore My Research Direction" />
            </div>
          </div>
        </SoftWashCard>
      </section>

      {/* FINAL CTA */}

      <section className="border-default mt-20 border-t pt-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Explore Further</SectionLabel>

            <h2 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold md:text-4xl">
              Follow the research, learning, and work behind the direction.
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
              I&apos;m still developing the healthcare knowledge, research skills, technical
              fluency, and experience that will shape this path. My research, writing, and projects
              document that development as it happens.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-4">
            <PrimaryCTA link="/research" label="Explore My Research" />
            <SecondaryCTA link="/writing" label="Read My Writing" />
            <SecondaryCTA link="/contact" label="Connect With Me" />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-muted mt-3 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function PrincipleCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div>
      <ChipMono>{label}</ChipMono>

      <h3 className="font-heading text-foreground mt-4 text-xl font-semibold">{title}</h3>

      <p className="text-muted mt-3 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

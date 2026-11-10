import PageHeader from "@/src/components/shared/PageHeader";

import { SectionLabel } from "@/src/components/projects/SectionLabel";

import { Card, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";

import { PrimaryCTA, SecondaryCTA } from "@/src/components/ui/Buttons";

import { ChipMono, ChipThinBorder } from "@/src/components/ui/Chips";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",

  description:
    "Learn about Ariela Israel's transition from full-stack software development to health services, health information, and clinical and biomedical informatics research.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: "About Ariela Israel",
    description:
      "Health Services Management student and former full-stack software developer building toward clinical and biomedical informatics research focused on Black women's health equity.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="About Ariela"
        heading="Building toward more equitable evidence, data, and health systems"
        description={
          <>
            I&apos;m a Health Services Management student and former full-stack software developer
            building toward clinical and biomedical informatics research focused on Black
            women&apos;s whole-body health equity.
          </>
        }
        supportingText={
          <>
            My path brings together healthcare systems, health information, research, data analysis,
            and a technical foundation in software engineering. I&apos;m developing the knowledge
            and methods needed to study how evidence, data, and information systems shape disease
            recognition, diagnosis, treatment, and care.
          </>
        }
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
              From building software systems to studying the health systems they can support.
            </h2>

            <div className="text-muted mt-6 space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m pursuing a Bachelor of Science in Health Services Management at the
                University of Maryland Global Campus, with certificate pathways in Health
                Information Management and Data Analytics, plus Data Analytics.
              </p>

              <p>
                My undergraduate education is helping me understand healthcare delivery,
                organizational systems, health information, data, research, and the operational
                context in which care occurs. I&apos;m also developing the research and analytical
                foundation needed for future graduate study in clinical and biomedical informatics.
              </p>

              <p>
                Before beginning this path, I worked in full-stack software development. I built and
                supported digital applications, databases, APIs, content systems, and operational
                workflows. That experience taught me to think carefully about structure, data
                quality, documentation, accessibility, reliability, and how information moves
                between people and technology.
              </p>

              <p>
                I&apos;m not leaving that technical foundation behind. I&apos;m learning how to
                apply it to questions involving health information, clinical evidence, research, and
                the systems that influence patient care.
              </p>

              <p className="text-foreground font-semibold">
                What information are healthcare systems capturing? What are they missing? How are
                Black women&apos;s symptoms, conditions, and care experiences represented in the
                evidence? What patterns may exist across years of clinical information, and how
                might those patterns support earlier recognition and better decisions?
              </p>

              <p>
                Those questions are leading me toward clinical and biomedical informatics. My
                long-term goal is to connect healthcare knowledge, rigorous research, meaningful
                data, and responsible technology in service of Black women&apos;s whole-body health
                equity.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <GlassCard>
            <div className="space-y-6">
              <InfoBlock
                label="Academic Path"
                body={
                  <>
                    BS in Health Services Management at UMGC, with certificate pathways in Health
                    Information Management and Data Analytics, plus Data Analytics.
                  </>
                }
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
                label="Health Equity Focus"
                body={
                  <>
                    Black women&apos;s whole-body health, including diagnostic delay,
                    undertreatment, fragmented care, incomplete clinical recognition, and research
                    gaps.
                  </>
                }
              />

              <InfoBlock
                label="Research Interests"
                body={
                  <>
                    Longitudinal health data, clinical phenotyping, diagnostic disparities, clinical
                    and biomedical informatics, precision medicine, and equitable clinical
                    intelligence.
                  </>
                }
              />

              <InfoBlock
                label="Developing Methods"
                body={
                  <>
                    Research methods, statistics, scientific literature evaluation, health-data
                    analysis, R, Python, and SQL.
                  </>
                }
              />

              <InfoBlock
                label="Technical Foundation"
                body={
                  <>
                    Full-stack software development, structured data systems, databases, APIs,
                    documentation, accessibility, testing, and systems thinking.
                  </>
                }
              />

              <InfoBlock
                label="Long-Term Direction"
                body={
                  <>
                    Clinical and biomedical informatics research advancing health equity for Black
                    women through stronger evidence, data, and information systems.
                  </>
                }
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

              <p className="font-heading text-signature-text mt-6 text-2xl leading-snug font-medium tracking-[0.04em] uppercase italic md:text-2xl">
                The advocacy and research fuel the technology, not the other way around.
              </p>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m interested in what happens when Black women are not adequately represented,
                studied, recognized, believed, or understood within healthcare and biomedical
                research.
              </p>

              <p>
                My long-term focus is Black women&apos;s whole-body health, not reproductive health
                alone. That includes the racial and systemic factors that can contribute to
                diagnostic delay, undertreatment, fragmented care, incomplete clinical recognition,
                information barriers, and gaps in research.
              </p>

              <p>
                This direction extends across reproductive, endocrine, metabolic, cardiovascular,
                autoimmune, neurological, chronic, mental, and multisystem health throughout the
                life course. Black women&apos;s health cannot be fully understood through a single
                organ system, condition, or stage of life.
              </p>

              <p>
                These problems are what draw me toward research and informatics. I want to
                understand whether stronger evidence, more complete data, thoughtful informatics
                methods, and responsible computational tools can help reveal patterns that medicine
                has historically overlooked.
              </p>

              <p>
                I&apos;m particularly interested in how longitudinal clinical and biomedical data
                could improve disease recognition, investigate diagnostic disparities, and support
                more precise and equitable clinical responses for Black women.
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
                Building the experience required for responsible research and informatics work.
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                My immediate goal is to continue developing through health information, research
                support, healthcare operations, health IT, data-quality, and other roles where I can
                strengthen my understanding of healthcare systems and contribute the technical and
                organizational skills I already have.
              </p>

              <p>
                After completing my undergraduate education, I intend to pursue graduate training in
                clinical and biomedical informatics. My long-term goal is to conduct research that
                connects rigorous evidence, longitudinal health data, and responsible technology to
                better disease recognition and more equitable care for Black women.
              </p>

              <p>
                That work could take place across academic research, health systems, government,
                industry, or mission-driven organizations. The setting may change, but the purpose
                remains consistent: making Black women more visible to the evidence, data, and
                systems that shape medicine.
              </p>
            </div>
          </div>

          <div className="border-default mt-8 border-t pt-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <SectionLabel>Current Research Direction</SectionLabel>

                <p className="font-heading text-foreground mt-4 max-w-4xl text-2xl leading-tight font-semibold md:text-3xl">
                  How can longitudinal clinical data and phenotyping improve disease recognition and
                  shorten diagnostic delay for Black women?
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

function InfoBlock({ label, body }: { label: string; body: React.ReactNode }) {
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

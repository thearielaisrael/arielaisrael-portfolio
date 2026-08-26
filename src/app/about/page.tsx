import PageHeader from "@/src/components/shared/PageHeader";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import { Card, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";
import { PrimaryCTA, SecondaryCTA } from "@/src/components/ui/Buttons";
import { ChipMono, ChipThinBorder } from "@/src/components/ui/Chips";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",

  description:
    "Learn about Ariela Israel's path through women's health equity, health information, research, and informatics as she builds toward becoming a Women's Health Equity Advocate & Informaticist.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    title: "About Ariela Israel",
    description:
      "Health Services Management student studying women's health equity, health information, research, and informatics.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="About Ariela"
        heading="Building a path through women's health equity, information, and informatics"
        description="I'm a Health Services Management student building toward becoming a Women's Health Equity Advocate & Informaticist."
        supportingText="My developing interests connect women's whole-body health, racial disparities, delayed diagnosis, health information, healthcare data, research, biomedical informatics, and precision medicine."
        actions={
          <>
            <PrimaryCTA link="/experience" label="View Experience" />
            <SecondaryCTA link="/projects" label="Explore Projects" />
          </>
        }
      />

      <section aria-labelledby="professional-path-heading" className="mt-16 md:mt-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <SectionLabel>Academic and Professional Path</SectionLabel>

              <h2
                id="professional-path-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                Studying the information, systems, and disparities shaping women&apos;s health
              </h2>

              <div className="text-muted mt-6 space-y-5 text-base leading-relaxed md:text-lg">
                <p>
                  I&apos;m pursuing a Bachelor of Science in Health Services Management at the
                  University of Maryland Global Campus, alongside certificates in Health Information
                  Management &amp; Data Analytics and Data Analytics. Through this academic path,
                  I&apos;m developing a stronger understanding of healthcare systems, health
                  information, research, data, and the operational conditions that influence care.
                </p>

                <p>
                  My direction is rooted in a long-standing interest in women&apos;s health and in
                  the racial disparities that affect diagnosis, treatment, research, information,
                  and outcomes. I&apos;m especially interested in delayed diagnosis, fragmented
                  care, incomplete health information, and the ways longitudinal data may help
                  reveal patterns that are difficult to recognize during isolated encounters.
                </p>

                <p>
                  Before beginning my healthcare education, I worked as a full-stack software
                  developer. Most recently, I served as the sole full-stack developer for Walton
                  Arts Center and Walmart AMP, where I built and maintained production applications
                  used by staff and the public.
                </p>

                <p>
                  That experience gave me a professional foundation in structured data, databases,
                  documentation, quality assurance, accessibility, technical problem-solving, and
                  systems operating under real organizational constraints. Software is no longer the
                  center of my professional identity, but it remains an important part of what I
                  bring into healthcare, research, and informatics.
                </p>

                <p>
                  I&apos;m now seeking opportunities that allow me to develop practical healthcare
                  experience while continuing my education. Long term, I&apos;m building toward
                  becoming a Women&apos;s Health Equity Advocate &amp; Informaticist whose work
                  connects advocacy, health information, research, data, and patient-centered
                  technology.
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
                  body="Racial disparities, delayed diagnosis, undertreatment, fragmented care, research gaps, and women's whole-body health."
                />

                <InfoBlock
                  label="Developing Interests"
                  body="Health information, healthcare data, biomedical informatics, longitudinal health records, research, and precision medicine."
                />

                <InfoBlock
                  label="Professional Foundation"
                  body="Software development, structured data systems, databases, documentation, accessibility, quality assurance, and workflow analysis."
                />

                <InfoBlock
                  label="Long-Term Direction"
                  body="Building toward becoming a Women's Health Equity Advocate & Informaticist."
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section aria-labelledby="equity-lens-heading" className="mt-20">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>Equity Lens</SectionLabel>

              <h2
                id="equity-lens-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                Whole-body women&apos;s health, with the most affected women at the center
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                My advocacy centers racially underserved and underrepresented women whose symptoms,
                pain, concerns, and whole-body health are too often dismissed, misunderstood,
                diagnosed late, undertreated, or overlooked in research and healthcare data.
              </p>

              <p>
                My interests extend across reproductive, endocrine, metabolic, cardiovascular,
                autoimmune, chronic illness, mental health, and multisystem concerns across the life
                course. This broader scope matters because women&apos;s health cannot be understood
                through reproductive health alone.
              </p>

              <p>
                I&apos;m particularly interested in the fragmented information, research gaps,
                diagnostic delays, and racial disparities that can make care more difficult to
                understand and navigate. Everyone is welcome to learn from this work, but the women
                most affected by these disparities remain at the center.
              </p>

              <p>
                This direction is why I&apos;m learning how healthcare information is documented,
                managed, interpreted, and moved through real systems. The advocacy and research fuel
                the technology, not the other way around.
              </p>
            </div>
          </div>
        </SoftWashCard>
      </section>

      <section aria-labelledby="working-approach-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Working Approach</SectionLabel>

          <h2
            id="working-approach-heading"
            className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Study carefully, question responsibly, and connect information to people
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            I&apos;m drawn to work that requires accuracy, organization, evidence-conscious
            thinking, clear documentation, and respect for the people represented by the
            information.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <PrincipleCard
              label="SYSTEMS"
              title="Understand the full context"
              body="I examine the relationships among people, information, processes, tools, constraints, and decisions."
            />
          </Card>

          <Card>
            <PrincipleCard
              label="EVIDENCE"
              title="Protect clarity and accuracy"
              body="I value careful research, transparent limitations, consistent documentation, accessibility, and information people can understand."
            />
          </Card>

          <Card>
            <PrincipleCard
              label="PURPOSE"
              title="Keep people at the center"
              body="I want advocacy, information, research, data, and technology to support clearer understanding and more equitable care."
            />
          </Card>
        </div>
      </section>

      <section className="border-default mt-20 border-t pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Explore</SectionLabel>

            <h2 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold md:text-4xl">
              Explore the experience and learning behind the direction
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed">
              Review my professional foundation, developing healthcare knowledge, selected projects,
              and path toward women&apos;s health equity and informatics.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <PrimaryCTA link="/experience" label="View Experience" />
            <SecondaryCTA link="/contact" label="Contact Me" />
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

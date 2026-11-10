import Link from "next/link";

import Hero from "../../components/home/Hero";
import { FeaturedProjectCard } from "../../components/projects/FeaturedProjectCard";
import { PrimaryCTA } from "../../components/ui/Buttons";
import { projects } from "../../data/projectData";

import type { Metadata } from "next";
import { Card, GlassCard } from "@/src/components/ui/Cards";

import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Ariela Israel | Health Data, Informatics & Health Equity",
  },

  description:
    "Health Services Management student and former full-stack software developer building toward clinical and biomedical informatics research focused on Black women's health equity.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Ariela Israel | Health Data, Informatics & Health Equity",
    description:
      "Building toward clinical and biomedical informatics research focused on Black women's health equity, longitudinal health data, and precision medicine.",
    url: "/",
  },
};

const questions: {
  key: string;
  title: ReactNode;
  description: ReactNode;
}[] = [
  {
    key: "black-womens-health-equity",
    title: <>Black Women&apos;s Health Equity</>,
    description: (
      <>
        Investigating disparities in disease recognition, diagnosis, treatment, research
        representation, clinical response, and health outcomes across Black women&apos;s whole-body
        health.
      </>
    ),
  },
  {
    key: "longitudinal-health-data",
    title: <>Longitudinal Health Data</>,
    description: (
      <>
        Exploring how patterns across time can reveal disease trajectories, diagnostic delay,
        fragmented care, and missed opportunities for earlier clinical recognition.
      </>
    ),
  },
  {
    key: "clinical-phenotyping",
    title: <>Clinical Phenotyping</>,
    description: (
      <>
        Learning how clinical data can be transformed into meaningful representations of symptoms,
        conditions, disease progression, and patient trajectories.
      </>
    ),
  },
  {
    key: "clinical-biomedical-informatics",
    title: <>Clinical & Biomedical Informatics</>,
    description: (
      <>
        Studying how health information, biomedical knowledge, computational methods, and technology
        can support research, clinical understanding, and better care.
      </>
    ),
  },
  {
    key: "precision-medicine",
    title: <>Precision Medicine</>,
    description: (
      <>
        Exploring how clinical, genomic, biomarker, environmental, and other data can support more
        individualized approaches to prevention, diagnosis, and treatment.
      </>
    ),
  },
  {
    key: "equitable-clinical-intelligence",
    title: <>Equitable Clinical Intelligence</>,
    description: (
      <>
        Examining how decision support, algorithms, and AI can improve care without reproducing
        disparities already embedded in healthcare systems and their data.
      </>
    ),
  },
];

const productionProjects = projects.filter((project) => project.status === "Built");

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-360 space-y-20 px-6 pb-16 md:px-10 md:pb-20">
      <Hero />

      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-4">
            <SectionLabel>Research Interests</SectionLabel>

            <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-5xl">
              Questions shaping my developing research direction
            </h2>

            <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
              My developing research interests center on how clinical and biomedical data can
              improve disease recognition, expose inequities, and support more precise care for
              Black women. These are long-term areas of inquiry that are guiding what I study now in
              health services, research methods, health information, data analysis, and informatics.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {questions.map((question) => (
            <Card key={question.key}>
              <article>
                <h3 className="font-heading text-primary mt-4 text-2xl leading-tight font-semibold">
                  {question.title}
                </h3>

                <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                  {question.description}
                </p>
              </article>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <GlassCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>An Evolving Research Question</SectionLabel>

              <h2
                id="equity-lens-heading"
                className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-4xl"
              >
                How can longitudinal clinical data and phenotyping improve disease recognition and
                shorten diagnostic delay for Black women?
              </h2>
            </div>

            <div className="text-muted flex flex-col space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                This is a developing research direction, not a completed study or a claim of
                established expertise. I&apos;m using it to guide what I learn about research
                methods, statistics, clinical data, health disparities, phenotyping, and biomedical
                informatics.
              </p>

              <h3 className="mb-0 font-bold tracking-wide">Why this question?</h3>

              <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                Disease recognition does not depend on a single clinical encounter. Symptoms,
                diagnoses, laboratory results, referrals, treatments, and patterns of healthcare use
                can accumulate across years of a patient&apos;s record. When those signals remain
                fragmented or are interpreted without sufficient evidence, opportunities for earlier
                recognition may be missed.
              </p>

              <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                I&apos;m interested in whether informatics can help connect those longitudinal
                patterns, strengthen the evidence used to understand disease in Black women, and
                support more timely and equitable clinical response.
              </p>

              <Link
                href="/research"
                className="ring-brand text-link hover:text-accent -mb-4 inline-flex shrink-0 items-center gap-2 self-end text-sm font-bold transition-colors"
              >
                Explore My Research Direction
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-4">
            <SectionLabel>Selected Work</SectionLabel>

            <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-5xl">
              Software foundations for a future in health data and informatics
            </h2>

            <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
              Before beginning my health-services and informatics path, I worked in full-stack
              software development. These projects demonstrate the systems thinking, structured-data
              experience, accessibility practices, documentation, testing, and technical
              problem-solving I&apos;m carrying into health information, research support, and
              clinical and biomedical informatics.
            </p>
          </div>

          <Link
            href="/projects"
            className="ring-brand text-link hover:text-accent inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-bold transition-colors"
          >
            View all projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {productionProjects.map((project) => (
            <FeaturedProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="soft-wash border-default shadow-card rounded-[2rem] border p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <SectionLabel>The Informatics Diary</SectionLabel>

            <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-4xl">
              Documenting the path from software to clinical and biomedical informatics
            </h2>

            <p className="text-muted text-base leading-relaxed md:text-lg">
              The Informatics Diary is my public learning journal. It documents the questions,
              concepts, evidence, and methods I encounter while developing foundations in health
              services, research, health information, data analysis, and clinical and biomedical
              informatics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-right lg:justify-end">
            <p className="italic">
              The advocacy and research fuel the technology, not the other way around.
            </p>

            <p className="text-muted mb-6 text-base leading-relaxed md:text-lg">
              My interest in informatics begins with the problems I care about: incomplete evidence
              about Black women&apos;s health, gaps in disease recognition and diagnosis, fragmented
              clinical information, underrepresentation in research and data, and systems that do
              not always reflect the people medicine is meant to serve.
            </p>

            <PrimaryCTA link="/writing" label="Read The Informatics Diary" />
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
      {children}
    </p>
  );
}

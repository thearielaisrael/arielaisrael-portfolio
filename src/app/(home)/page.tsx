import Link from "next/link";

import Hero from "../../components/home/Hero";
import { FeaturedProjectCard } from "../../components/projects/FeaturedProjectCard";
import { PrimaryCTA, SecondaryCTA } from "../../components/ui/Buttons";
import { projects } from "../../data/projectData";

import type { Metadata } from "next";
import { Card, GlassCard } from "@/src/components/ui/Cards";

export const metadata: Metadata = {
  title: {
    absolute: "Ariela Israel | Software, Health Information & Informatics",
  },

  description:
    "Software developer and Health Services Management student bringing experience with structured data, systems, documentation, accessibility, and operational workflows into healthcare.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Ariela Israel | Software, Health Information & Informatics",
    description:
      "Software developer and Health Services Management student bringing a systems-and-data foundation into healthcare.",
    url: "/",
  },
};

const questions = [
  {
    title: "Women's Health Equity",
    description:
      "Investigating disparities in diagnosis, treatment, research representation, clinical recognition, and health outcomes across women's whole-body health.",
  },
  {
    title: "Longitudinal Health Data",
    description:
      "Exploring how patterns across time can reveal disease trajectories, missed opportunities for recognition, and gaps in care.",
  },
  {
    title: "Clinical Phenotyping",
    description:
      "Learning how clinical data can be transformed into meaningful representations of health, disease, symptoms, and patient trajectories.",
  },
  {
    title: "Clinical & Biomedical Informatics",
    description:
      "Studying how health information, biomedical knowledge, computational methods, and technology can support research and better care.",
  },
  {
    title: "Precision Medicine",
    description:
      "Exploring how clinical, genomic, biomarker, environmental, and other data can support more individualized approaches to prevention, diagnosis, and treatment.",
  },
  {
    title: "Equitable Clinical Intelligence",
    description:
      "Examining how decision support, algorithms, and AI can improve care without reproducing disparities already present in healthcare and its data.",
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
              Questions I want to learn to answer
            </h2>

            <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
              My developing research interests center on how clinical and biomedical data can help
              identify inequities, improve clinical understanding, and support more precise and
              equitable care for women, particularly those who have been underserved or
              underrepresented in healthcare and research.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {questions.map((question) => (
            <Card key={question.title}>
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
                How can clinical and biomedical informatics use longitudinal phenotyping to help
                shorten diagnostic delay in women&apos;s health?
              </h2>
            </div>

            <div className="text-muted flex flex-col space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                This question reflects an emerging area of interest rather than a completed research
                study. I&apos;m using it to guide what I learn about research methods, statistics,
                clinical data, phenotyping, health disparities, and biomedical informatics.
              </p>

              <h3 className="mb-0 font-bold tracking-wide">Why this question?</h3>

              <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                Diagnostic delay can emerge from more than a single clinical encounter. Symptoms,
                diagnoses, laboratory results, referrals, treatments, and patterns of healthcare use
                may accumulate across years of a patient&apos;s record. I&apos;m interested in
                whether informatics can help identify those longitudinal patterns and whether doing
                so can contribute to earlier, more equitable recognition of disease in women.
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
              Technical foundations for where I&apos;m going next
            </h2>

            <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
              My software engineering background shaped how I think about systems, structured data,
              accessibility, documentation, reliability, and the people who depend on technology.
              These projects represent the technical foundation I&apos;m bringing into clinical and
              biomedical informatics.
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
              Learning clinical & biomedical informatics in public
            </h2>

            <p className="text-muted text-base leading-relaxed md:text-lg">
              The Informatics Diary is my public learning journal documenting what I&apos;m
              studying, reading, questioning, analyzing, and eventually researching as I develop in
              clinical and biomedical informatics. I write at the intersection of women&apos;s
              health equity, health data, research, and precision medicine, translating what I learn
              while remaining transparent about what I&apos;m still learning.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-right lg:justify-end">
            <p className="italic">
              The advocacy and research fuel the technology, not the other way around.
            </p>

            <p className="text-muted mb-6 text-base leading-relaxed md:text-lg">
              My interest in informatics begins with the problems I care about: inequities in
              women&apos;s health, gaps in diagnosis and clinical recognition, underrepresentation
              in research and data, and the need for evidence that better reflects the women
              medicine serves.
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

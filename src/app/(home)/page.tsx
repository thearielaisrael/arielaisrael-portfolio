import Link from "next/link";

import Hero from "../../components/home/Hero";
import { FeaturedProjectCard } from "../../components/projects/FeaturedProjectCard";
import { PrimaryCTA, SecondaryCTA } from "../../components/ui/Buttons";
import { projects } from "../../data/projectData";

import type { Metadata } from "next";

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

const productionProjects = projects.filter((project) => project.status === "Built");

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-360 space-y-20 px-6 pb-16 md:px-10 md:pb-20">
      <Hero />

      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-4">
            <SectionLabel>Selected Professional Work</SectionLabel>

            <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-5xl">
              Production systems, operational workflows, and software foundations
            </h2>

            <p className="text-muted max-w-3xl text-base leading-relaxed md:text-lg">
              Built work demonstrating professional software experience, technical ownership,
              structured information, user-flow improvement, accessibility, and systems designed
              around real operational needs.
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
              Field notes on health information, digital health, data, and women&apos;s health
              equity
            </h2>

            <p className="text-muted text-base leading-relaxed md:text-lg">
              A field-note archive documenting what I&apos;m studying, questioning, building, and
              researching along my path toward becoming a Women&apos;s Health Equity Advocate &amp;
              Informatician.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <PrimaryCTA link="/field-notes" label="Read Field Notes" />

            <SecondaryCTA link="/projects" label="Explore Projects" />
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

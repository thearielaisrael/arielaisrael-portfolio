import PageHeader from "@/src/components/shared/PageHeader";
import { ChipThinBorder } from "@/src/components/ui/Chips";

import {
  additionalExperience,
  appliedStudy,
  education,
  featuredExperience,
} from "@/src/data/experienceData";

import { resumeHref } from "../../data/navData";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",

  description:
    "Professional software-development, data, documentation, accessibility, quality-assurance, and operational experience supporting Ariela Israel's transition into health information and informatics.",

  alternates: {
    canonical: "/experience",
  },

  openGraph: {
    title: "Experience",
    description:
      "Professional experience across software systems, structured data, documentation, accessibility, quality assurance, and operational workflows.",
    url: "/experience",
  },
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto w-full max-w-360 space-y-20 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Experience"
        heading="Software, systems, and operational experience"
        description={
          <>
            My professional background is in full-stack development, structured data systems,
            production technology, documentation, accessibility, quality assurance, and
            workflow-focused problem-solving.
          </>
        }
        supportingText={
          <>
            I&apos;m now bringing that foundation into health information, healthcare data, and
            informatics while completing my Health Services Management degree.
          </>
        }
      />

      <div className="-mt-12">
        <a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition duration-300 hover:-translate-y-0.5 hover:brightness-95 md:text-base"
        >
          View Resume
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Featured Experience</SectionLabel>

          <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-5xl">
            Professional software and systems work
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            Selected experience demonstrating technical ownership, structured information,
            documentation, operational workflows, accessibility, and reliable production systems.
          </p>
        </div>

        <div className="space-y-6">
          {featuredExperience.map((experience) => (
            <FeaturedExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Applied Study</SectionLabel>

          <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-4xl">
            Health information, digital health, and informatics
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            Independent educational work connecting my software background with healthcare systems,
            health information, data, and women&apos;s health equity.
          </p>
        </div>

        {appliedStudy.map((study) => (
          <article
            key={study.id}
            className="soft-wash border-default shadow-card rounded-[2rem] border p-6 md:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-accent font-mono text-xs font-semibold tracking-[0.2em] uppercase">
                  {study.organization}
                </p>

                <h3 className="font-heading text-primary mt-3 text-2xl leading-[1.1] font-semibold tracking-[-0.02em] md:text-3xl">
                  {study.title}
                </h3>

                <p className="text-subtle mt-3 text-sm font-semibold">{study.period}</p>

                <p className="text-muted mt-5 text-base leading-relaxed">{study.summary}</p>
              </div>

              <div>
                <ul className="text-muted space-y-3 text-sm leading-relaxed md:text-base">
                  {study.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="text-accent mt-1 shrink-0">
                        •
                      </span>

                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {study.focusAreas.map((focusArea) => (
                    <ChipThinBorder key={focusArea}>{focusArea}</ChipThinBorder>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Additional Experience</SectionLabel>

          <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-4xl">
            Operations, technical support, and customer experience
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            Earlier roles that strengthened process adherence, record accuracy, communication,
            troubleshooting, and reliability in high-volume environments.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {additionalExperience.map((experience) => (
            <AdditionalExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Education</SectionLabel>

          <h2 className="font-heading text-primary tracking-light text-3xl leading-[1.08] font-bold text-balance md:text-4xl">
            Healthcare management and software engineering
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {education.map((item) => (
            <article
              key={`${item.institution}-${item.field}`}
              className="border-default bg-surface shadow-card rounded-2xl border p-6"
            >
              <p className="text-accent font-mono text-xs font-semibold tracking-[0.2em] uppercase">
                {item.period}
              </p>

              <h3 className="font-heading text-primary mt-4 text-2xl leading-[1.12] font-semibold tracking-[-0.02em]">
                {item.institution}
              </h3>

              <p className="text-foreground mt-2 font-semibold">
                {item.credential}, {item.field}
              </p>

              {item.status ? (
                <p className="text-subtle mt-2 text-sm font-semibold">{item.status}</p>
              ) : null}

              {item.certificates?.length ? (
                <div className="border-default mt-6 border-t pt-5">
                  <p className="text-accent font-mono text-[0.68rem] font-semibold tracking-[0.18em] uppercase">
                    Certificates in Progress
                  </p>

                  <ul className="text-muted mt-3 space-y-2 text-sm leading-relaxed">
                    {item.certificates.map((certificate) => (
                      <li key={certificate.name}>{certificate.name}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type ExperienceEntry = (typeof featuredExperience)[number];

function FeaturedExperienceCard({ experience }: { experience: ExperienceEntry }) {
  return (
    <article className="border-default bg-surface shadow-card rounded-[2rem] border p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-accent font-mono text-xs font-semibold tracking-[0.2em] uppercase">
            {experience.organization}
          </p>

          <h3 className="font-heading text-primary mt-3 text-2xl leading-[1.1] font-semibold tracking-[-0.02em] md:text-3xl">
            {experience.role}
          </h3>

          <p className="text-subtle mt-3 text-sm font-semibold">{experience.period}</p>

          {experience.location ? (
            <p className="text-subtle mt-1 text-sm">{experience.location}</p>
          ) : null}

          <p className="text-muted mt-5 text-base leading-relaxed">{experience.summary}</p>
        </div>

        <div>
          <ul className="text-muted space-y-3 text-sm leading-relaxed md:text-base">
            {experience.highlights.slice(0, 4).map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span aria-hidden="true" className="text-accent mt-1 shrink-0">
                  •
                </span>

                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {experience.strengths.map((strength) => (
              <ChipThinBorder key={strength}>{strength}</ChipThinBorder>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

type AdditionalExperienceEntry = (typeof additionalExperience)[number];

function AdditionalExperienceCard({ experience }: { experience: AdditionalExperienceEntry }) {
  return (
    <article className="border-default bg-surface shadow-card rounded-2xl border p-5">
      <p className="text-accent font-mono text-[0.68rem] font-semibold tracking-[0.18em] uppercase">
        {experience.organization}
      </p>

      <h3 className="font-heading text-primary mt-3 text-xl leading-[1.12] font-semibold tracking-[-0.015em]">
        {experience.role}
      </h3>

      <p className="text-subtle mt-2 text-sm font-semibold">{experience.period}</p>

      <p className="text-muted mt-4 text-sm leading-relaxed">{experience.summary}</p>

      <ul className="text-muted mt-5 space-y-2 text-sm leading-relaxed">
        {experience.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2.5">
            <span aria-hidden="true" className="text-accent shrink-0">
              •
            </span>

            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
      {children}
    </p>
  );
}

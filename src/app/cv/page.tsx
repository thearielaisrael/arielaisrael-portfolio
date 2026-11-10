import Link from "next/link";

import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";
import { SecondaryCTA } from "@/src/components/ui/Buttons";
import { Card, EditorialCard, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";
import { ChipMono, ChipThinBorder } from "@/src/components/ui/Chips";
import {
  academicSnapshot,
  competencyGroups,
  currentResearchDirection,
  cvProfile,
  publicScholarship,
  researchInterests,
} from "@/src/data/cvData";
import { additionalExperience, education, featuredExperience } from "@/src/data/experienceData";
import { resumeHref } from "@/src/data/navData";
import { featuredProjects, type Project } from "@/src/data/projectData";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Vitae",

  description:
    "Explore Ariela Israel's education, professional software experience, completed technical work, developing research direction, and preparation for clinical and biomedical informatics.",

  alternates: {
    canonical: "/cv",
  },

  openGraph: {
    title: "Curriculum Vitae | Ariela Israel",
    description:
      "Professional experience, education, completed software projects, developing research interests, and public scholarship from Ariela Israel.",
    url: "/cv",
    type: "profile",
  },
};

export default function CvPage() {
  const previousEducation = education.filter(
    (item) => item.institution !== academicSnapshot.institution,
  );

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow={cvProfile.eyebrow}
        heading={cvProfile.heading}
        description={cvProfile.description}
        supportingText={cvProfile.supportingText}
        actions={
          <>
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              View Résumé ↗
            </a>

            <SecondaryCTA link="/contact" label="Contact Me" />
          </>
        }
      />

      {/* EDUCATION */}

      <section aria-labelledby="education-heading" className="mt-16 md:mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Education</SectionLabel>

          <h2
            id="education-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Current academic foundation
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Formal education supporting my development across healthcare systems, health
            information, data analytics, research, and informatics.
          </p>
        </div>

        <div className="mt-8">
          <GlassCard>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              <div>
                <SectionLabel>{academicSnapshot.status}</SectionLabel>

                <h3 className="font-heading text-primary mt-3 text-3xl leading-tight font-semibold">
                  {academicSnapshot.degree} in {academicSnapshot.field}
                </h3>

                <p className="text-foreground mt-3 font-semibold">{academicSnapshot.institution}</p>

                <p className="text-muted mt-2 text-sm">
                  Expected completion: {academicSnapshot.expectedCompletion}
                </p>

                <div className="border-default mt-6 border-t pt-6">
                  <SectionLabel>Certificates in Progress</SectionLabel>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {academicSnapshot.certificates.map((certificate) => (
                      <ChipThinBorder key={certificate.name}>{certificate.name}</ChipThinBorder>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-default border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                <SectionLabel>Current GPA</SectionLabel>

                <p className="font-heading text-primary mt-3 text-5xl font-bold tracking-tight">
                  {academicSnapshot.gpa}
                </p>

                <p className="text-muted mt-2 text-sm">on a {academicSnapshot.gpaScale} scale</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {previousEducation.length > 0 ? (
          <div className="mt-6 space-y-6">
            {previousEducation.map((item) => (
              <article key={`${item.institution}-${item.field}`}>
                <Card>
                  <div className="grid gap-5 md:grid-cols-[0.35fr_1fr] md:items-center">
                    <div>
                      <SectionLabel>{item.period}</SectionLabel>
                    </div>

                    <div>
                      <h3 className="font-heading text-primary text-2xl leading-tight font-semibold">
                        {item.institution}
                      </h3>

                      <p className="text-foreground mt-2 font-semibold">
                        {item.credential}, {item.field}
                      </p>

                      {item.status ? (
                        <p className="text-subtle mt-2 text-sm">{item.status}</p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {/* PROFESSIONAL EXPERIENCE */}

      <section aria-labelledby="professional-experience-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Professional Experience</SectionLabel>

          <h2
            id="professional-experience-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Systems, software, data, and operational experience
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Professional work spanning application development, databases, structured information,
            documentation, accessibility, quality assurance, technical support, and workflow-focused
            problem-solving.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {featuredExperience.map((experience) => (
            <FeaturedExperienceRecord key={experience.id} experience={experience} />
          ))}
        </div>
      </section>

      {/* ADDITIONAL EXPERIENCE */}

      <section aria-labelledby="additional-experience-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Additional Experience</SectionLabel>

          <h2
            id="additional-experience-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-4xl"
          >
            Operations, technical support, and customer communication
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Earlier roles that strengthened reliability, process adherence, record accuracy,
            troubleshooting, communication, and service in high-volume environments.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {additionalExperience.map((experience) => (
            <AdditionalExperienceRecord key={experience.id} experience={experience} />
          ))}
        </div>
      </section>

      {/* SELECTED PROJECTS */}

      <section aria-labelledby="selected-projects-heading" className="mt-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Selected Projects</SectionLabel>

            <h2
              id="selected-projects-heading"
              className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
            >
              Completed technical work
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
              Selected professional and educational projects demonstrating production systems,
              relational data, application architecture, workflow validation, accessibility, and
              full-stack development.
            </p>
          </div>

          <Link
            href="/projects"
            className="ring-brand text-link hover:text-accent inline-flex w-fit items-center gap-2 rounded-md text-sm font-bold transition-colors"
          >
            View all projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <SelectedProjectRecord key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* RESEARCH DIRECTION */}

      <section aria-labelledby="research-direction-heading" className="mt-20">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>{currentResearchDirection.label}</SectionLabel>

              <h2
                id="research-direction-heading"
                className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                {currentResearchDirection.question}
              </h2>

              <p className="text-muted mt-5 text-base leading-relaxed">
                {currentResearchDirection.context}
              </p>
            </div>

            <div>
              <SectionLabel>Developing Research Interests</SectionLabel>

              <div className="mt-4 space-y-5">
                {researchInterests.map((interest) => (
                  <article
                    key={interest.title}
                    className="border-default border-b pb-5 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-heading text-foreground text-lg font-semibold">
                      {interest.title}
                    </h3>

                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {interest.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </SoftWashCard>
      </section>

      {/* COMPETENCIES */}

      <section aria-labelledby="competencies-heading" className="mt-20">
        <div className="max-w-3xl">
          <SectionLabel>Competencies</SectionLabel>

          <h2
            id="competencies-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Established strengths and developing methods
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            These groupings distinguish competencies supported by professional experience from
            healthcare, research, and analytical methods I am currently developing.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {competencyGroups.map((group) => (
            <article key={group.title} className="h-full [&>div]:h-full">
              <Card>
                <ChipMono>{group.stage}</ChipMono>

                <h3 className="font-heading text-primary mt-4 text-2xl leading-tight font-semibold">
                  {group.title}
                </h3>

                <p className="text-muted mt-3 text-sm leading-relaxed">{group.description}</p>

                <div
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label={`${group.title} competencies`}
                >
                  {group.items.map((item) => (
                    <ChipThinBorder key={item}>{item}</ChipThinBorder>
                  ))}
                </div>
              </Card>
            </article>
          ))}
        </div>
      </section>

      {/* PUBLIC SCHOLARSHIP */}

      <section aria-labelledby="public-scholarship-heading" className="mt-20">
        <EditorialCard>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel>Public Scholarship</SectionLabel>

              <h2
                id="public-scholarship-heading"
                className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                {publicScholarship.title}
              </h2>

              <p className="text-accent mt-3 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
                {publicScholarship.type}
              </p>

              <p className="text-muted mt-5 text-base leading-relaxed">
                {publicScholarship.description}
              </p>

              <a
                href={publicScholarship.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Read The Informatics Diary ↗
              </a>
            </div>

            <div>
              <SectionLabel>Editorial Practices</SectionLabel>

              <ul className="text-muted mt-4 space-y-3 text-sm leading-relaxed md:text-base">
                {publicScholarship.practices.map((practice) => (
                  <li key={practice} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent shrink-0">
                      •
                    </span>

                    <span>{practice}</span>
                  </li>
                ))}
              </ul>

              <p className="border-default text-subtle mt-6 border-t pt-5 text-sm leading-relaxed">
                {publicScholarship.boundary}
              </p>
            </div>
          </div>
        </EditorialCard>
      </section>
    </main>
  );
}

type FeaturedExperienceEntry = (typeof featuredExperience)[number];

function FeaturedExperienceRecord({ experience }: { experience: FeaturedExperienceEntry }) {
  return (
    <article>
      <EditorialCard>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>{experience.organization}</SectionLabel>

            <h3 className="font-heading text-primary mt-3 text-3xl leading-tight font-semibold">
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
              {experience.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent shrink-0">
                    •
                  </span>

                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 flex flex-wrap gap-2"
              aria-label={`Professional strengths from ${experience.organization}`}
            >
              {experience.strengths.map((strength) => (
                <ChipThinBorder key={strength}>{strength}</ChipThinBorder>
              ))}
            </div>
          </div>
        </div>
      </EditorialCard>
    </article>
  );
}

type AdditionalExperienceEntry = (typeof additionalExperience)[number];

function AdditionalExperienceRecord({ experience }: { experience: AdditionalExperienceEntry }) {
  return (
    <article className="h-full [&>div]:h-full">
      <Card>
        <SectionLabel>{experience.organization}</SectionLabel>

        <h3 className="font-heading text-primary mt-3 text-2xl leading-tight font-semibold">
          {experience.role}
        </h3>

        <p className="text-subtle mt-3 text-sm font-semibold">{experience.period}</p>

        {experience.location ? (
          <p className="text-subtle mt-1 text-sm">{experience.location}</p>
        ) : null}

        <p className="text-muted mt-4 text-sm leading-relaxed">{experience.summary}</p>

        <ul className="text-muted mt-5 space-y-3 text-sm leading-relaxed">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span aria-hidden="true" className="text-accent shrink-0">
                •
              </span>

              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </Card>
    </article>
  );
}

function SelectedProjectRecord({ project }: { project: Project }) {
  return (
    <article className="h-full [&>div]:h-full">
      <Card>
        <div className="flex flex-wrap gap-2">
          <ChipMono>{project.projectType}</ChipMono>
          <ChipMono>{project.status}</ChipMono>
        </div>

        <h3 className="font-heading text-primary mt-4 text-2xl leading-tight font-semibold">
          {project.title}
        </h3>

        <p className="text-muted mt-4 text-sm leading-relaxed">{project.summary}</p>

        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label={`Technologies used for ${project.title}`}
        >
          {project.stack.map((item) => (
            <ChipThinBorder key={item}>{item}</ChipThinBorder>
          ))}
        </div>

        {project.caseStudyHref ? (
          <div className="border-default mt-6 border-t pt-5">
            <Link
              href={project.caseStudyHref}
              className="ring-brand text-link hover:text-accent inline-flex items-center gap-2 rounded-md text-sm font-bold transition-colors"
            >
              View case study
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </Card>
    </article>
  );
}

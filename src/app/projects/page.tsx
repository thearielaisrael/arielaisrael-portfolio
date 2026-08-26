import { type Project, featuredProjects, projects } from "@/src/data/projectData";

import { FeaturedProjectCard } from "@/src/components/projects/FeaturedProjectCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Professional and developing projects by Ariela Israel across software systems, health information, healthcare data, informatics, research, and women's health equity.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects | Ariela Israel",
    description:
      "Professional systems work and developing projects across health information, healthcare data, informatics, research, and women's health equity.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const healthInformationProjects = projects.filter(
    (project) => project.category === "Health Information + Informatics",
  );

  const womensHealthResearchProjects = projects.filter(
    (project) => project.category === "Women's Health Equity + Research",
  );

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Projects"
        heading="Projects connecting information, systems, and women's health equity"
        description="A collection of completed professional work and developing projects across structured information, health information, healthcare data, research, informatics, and women's health equity."
        supportingText="My professional systems experience provides the technical foundation. Through formal study, independent research, and project-based learning, I'm developing the healthcare-domain knowledge needed to explore how information and technology can support more precise and equitable care."
      />

      <section aria-labelledby="selected-work-heading" className="mt-16 md:mt-20">
        <div className="mb-7 max-w-3xl">
          <SectionLabel>Completed Work</SectionLabel>

          <h2
            id="selected-work-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Professional systems and technical evidence
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Completed projects demonstrating production ownership, structured information,
            database-backed systems, operational workflows, accessibility, and technical
            problem-solving.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {healthInformationProjects.length > 0 ? (
        <ProjectSection
          id="health-information-informatics"
          eyebrow="Health Information + Informatics"
          heading="Learning how healthcare information becomes usable"
          description="Independent educational projects exploring data quality, longitudinal information, information organization, and healthcare systems using synthetic data. These projects are designed to develop healthcare-domain knowledge and are not presented as professional clinical experience."
          projects={healthInformationProjects}
        />
      ) : null}

      {womensHealthResearchProjects.length > 0 ? (
        <ProjectSection
          id="womens-health-equity-research"
          eyebrow="Women's Health Equity + Research"
          heading="Investigating where information, care, and inequity intersect"
          description="Developing research and analytics work examining diagnostic processes, care gaps, healthcare information, and racial inequities across women's health. This work uses scholarly literature, synthetic information, and appropriately sourced public data."
          projects={womensHealthResearchProjects}
        />
      ) : null}
    </main>
  );
}

function ProjectSection({
  id,
  eyebrow,
  heading,
  description,
  projects,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  projects: Project[];
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 pt-20 md:pt-24">
      <div className="mb-7 max-w-3xl">
        <SectionLabel>{eyebrow}</SectionLabel>

        <h2
          id={`${id}-heading`}
          className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
        >
          {heading}
        </h2>

        <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">{description}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

import { type Project, featuredProjects, projects } from "@/src/data/projectData";

import { FeaturedProjectCard } from "@/src/components/projects/FeaturedProjectCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Professional, educational, and planned projects by Ariela Israel across information systems, health information, healthcare data, women's health equity, research, and patient-centered technology.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects | Ariela Israel",
    description:
      "Projects connecting information systems, health information, healthcare data, research, and women's health equity.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const healthInformationProjects = projects.filter(
    (project) => project.category === "Health Information + Data Systems",
  );

  const conceptProjects = projects.filter(
    (project) =>
      project.status !== "Built" && project.category !== "Health Information + Data Systems",
  );

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Projects"
        heading="Projects connecting information, systems, and women’s health equity"
        description="A collection of completed work and developing concepts across structured information, operational systems, health information, healthcare data, research, and patient-centered technology."
        supportingText="My professional systems experience provides the technical foundation. My current education and independent projects are helping me build healthcare-domain knowledge as I work toward becoming a Women’s Health Equity Advocate & Informaticist."
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
          id="health-information-data-systems"
          eyebrow="Health Information + Data Systems"
          heading="Learning through health-information projects"
          description="Independent educational work exploring health-record data quality, documentation workflows, information organization, and healthcare data systems. These projects use synthetic information and are not presented as professional healthcare experience."
          projects={healthInformationProjects}
        />
      ) : null}

      {conceptProjects.length > 0 ? (
        <ProjectSection
          id="concept-roadmap"
          eyebrow="Research + Informatics Roadmap"
          heading="Developing ideas for women’s health equity"
          description="Planned independent concepts connecting health information, research, data, patient education, care navigation, and patient-centered technology. Each project is labeled by status so future direction remains clearly separated from completed work."
          projects={conceptProjects}
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

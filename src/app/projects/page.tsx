import { type Project, featuredProjects, projects } from "@/src/data/projectData";

import { FeaturedProjectCard } from "@/src/components/projects/FeaturedProjectCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Explore Ariela Israel's completed software work and developing educational projects in health information, data quality, biomedical informatics, and health equity for Black women.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects | Ariela Israel",
    description:
      "Completed software systems and developing educational projects connecting technical experience with health information, research, data quality, and health equity for Black women.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const developingProjects = projects.filter(
    (project) => project.status === "In Progress" || project.status === "Planned",
  );

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Projects"
        heading="Connecting software foundations with health information and research"
        description={
          <>
            This portfolio includes completed professional and educational software work alongside
            developing project concepts in health information, data quality, research, and Black
            women&apos;s health equity.
          </>
        }
        supportingText={
          <>
            My completed projects demonstrate the technical foundation I already have. My developing
            work is designed to help me build domain knowledge and analytical experience without
            presenting planned concepts as completed health-informatics research.
          </>
        }
      />

      <section aria-labelledby="selected-work-heading" className="mt-16 md:mt-20">
        <div className="mb-7 max-w-3xl">
          <SectionLabel>Completed Work</SectionLabel>

          <h2
            id="selected-work-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Built systems and technical foundations
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            These completed professional and educational projects demonstrate full-stack
            development, relational data modeling, database-backed systems, operational workflows,
            accessibility, testing, documentation, and technical problem-solving.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {developingProjects.length > 0 ? (
        <ProjectSection
          id="developing-work"
          eyebrow="Developing Work"
          heading="Applying technical foundations to health information and equity"
          description={
            <>
              These planned educational projects connect my software and structured-data experience
              with health-record quality, responsible analysis, research methods, and Black
              women&apos;s health equity. They are presented as concepts until implementation
              begins.
            </>
          }
          projects={developingProjects}
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
  description: React.ReactNode;
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

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

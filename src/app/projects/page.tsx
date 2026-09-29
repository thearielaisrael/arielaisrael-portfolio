import { type Project, featuredProjects, projects } from "@/src/data/projectData";

import { FeaturedProjectCard } from "@/src/components/projects/FeaturedProjectCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Explore Ariela Israel's completed software and systems work alongside developing educational projects in health information, biomedical informatics, healthcare data, and women's health equity.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects | Ariela Israel",
    description:
      "Completed technical work and developing educational projects connecting software systems, health information, biomedical informatics, healthcare data, and women's health equity.",
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
        heading="Projects connecting information, systems, and women's health equity"
        description="A collection of completed technical work and developing educational projects across software systems, health information, healthcare data, research, informatics, and women's health equity."
        supportingText="My completed software and systems work provides the technical foundation. Through undergraduate study, independent inquiry, and project-based learning, I'm developing the healthcare knowledge needed to explore how information and technology may support more precise and equitable care."
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
            Selected professional and educational projects demonstrating full-stack development,
            structured information, database-backed systems, operational workflows, accessibility,
            testing, and technical problem-solving.
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
          heading="Applying technical foundations to health data and equity"
          description="Planned educational projects connecting my established systems and data experience with health information, data quality, women's health equity, research methods, and responsible analysis."
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

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

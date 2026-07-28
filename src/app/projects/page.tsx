import { type Project, featuredProjects, projects } from "@/src/data/projectData";

import { FeaturedProjectCard } from "@/src/components/projects/FeaturedProjectCard";
import { ProjectCard } from "@/src/components/projects/ProjectCard";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",

  description:
    "Professional and educational projects by Ariela Israel across software development, structured data, operational systems, health information, digital health, and women's health equity.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects",
    description:
      "Projects across software development, structured data, operational systems, health information, and digital health.",
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
        heading="Projects across software, health information, and digital health"
        description="Selected professional and educational projects demonstrating structured data, operational workflows, information access, accessibility, and full-stack development."
        supportingText="My current work builds on that technical foundation as I develop knowledge across health information, healthcare data, informatics, and women's health equity."
      />

      <section aria-labelledby="selected-work-heading" className="mt-16 md:mt-20">
        <div className="mb-7 max-w-3xl">
          <SectionLabel>Selected Work</SectionLabel>

          <h2
            id="selected-work-heading"
            className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-5xl"
          >
            Completed projects and professional evidence
          </h2>

          <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
            Built work demonstrating production ownership, database-backed systems, user workflows,
            technical problem-solving, and accessible digital experiences.
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
          heading="Building healthcare-domain experience"
          description="Independent educational work exploring data quality, documentation workflows, information organization, and healthcare data systems. These projects use synthetic information and are not presented as professional healthcare experience."
          projects={healthInformationProjects}
        />
      ) : null}

      {conceptProjects.length > 0 ? (
        <ProjectSection
          id="concept-roadmap"
          eyebrow="Concept Roadmap"
          heading="Future work in digital health and women's health equity"
          description="Planned independent concepts connecting software, data, patient education, care navigation, and health-equity research. Their status is shown clearly so completed evidence remains distinct from future direction."
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

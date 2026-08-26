import { type Project } from "@/src/data/projectData";

import { PrimaryBtn } from "../ui/Buttons";
import { StackBadge } from "./StackBadge";
import { ChipContext, ChipStatus } from "../ui/Chips";

export const ProjectCard = ({ project }: { project: Project }) => {
  const hasLinks = Boolean(project.caseStudyHref || project.repoHref || project.demoHref);

  const isHealthInformationProject = project.category === "Health Information + Informatics";

  return (
    <article
      className={`flex min-h-90 flex-col justify-between rounded-xl border p-5 backdrop-blur transition duration-300 hover:-translate-y-1 ${
        isHealthInformationProject
          ? "border-tech-chip-border bg-surface-aqua shadow-glow hover:shadow-pop"
          : "border-default bg-card shadow-card hover:shadow-pop"
      }`}
    >
      <div>
        <div className="flex flex-wrap gap-2">
          <ChipContext>{project.projectType}</ChipContext>
          <ChipStatus>{project.status}</ChipStatus>
        </div>

        <p className="font-mono-brand text-accent mt-5 text-[0.68rem] font-semibold tracking-[0.16em] uppercase">
          {project.category}
        </p>

        <h3 className="font-heading text-primary mt-3 text-2xl leading-tight font-semibold tracking-tight">
          {project.title}
        </h3>

        <p className="text-muted mt-4 text-sm leading-relaxed">{project.summary}</p>

        <div
          className="mt-5 flex flex-wrap gap-2"
          aria-label={`Technologies and focus areas for ${project.title}`}
        >
          {project.stack.map((item) => (
            <StackBadge key={item} label={item} />
          ))}
        </div>
      </div>

      {hasLinks ? (
        <div className="border-default mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          {project.caseStudyHref ? (
            <PrimaryBtn link={project.caseStudyHref} label="View Case Study" />
          ) : null}

          {project.repoHref ? (
            <a
              href={project.repoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the ${project.title} repository in a new tab`}
              className="text-subtle hover:text-link text-sm font-bold transition"
            >
              Repository ↗
            </a>
          ) : null}

          {project.demoHref ? (
            <a
              href={project.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${project.title} live demo in a new tab`}
              className="text-link text-sm font-bold transition hover:underline hover:underline-offset-4"
            >
              Live Demo ↗
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

import Link from "next/link";
import { notFound } from "next/navigation";

import { ChipRegBorder, ChipThinBorder } from "@/src/components/ui/Chips";
import { Card, GlassCard } from "@/src/components/ui/Cards";
import { caseStudies, getCaseStudyBySlug } from "@/src/data/caseStudyData";

import type { Metadata } from "next";

type CaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {
      title: "Project Not Found",
    };
  }

  const url = `https://thearielaisrael.com/projects/${caseStudy.slug}`;

  return {
    title: caseStudy.title,
    description: caseStudy.summary,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${caseStudy.title} | Ariela Israel`,
      description: caseStudy.summary,
      url,
      type: "article",
      siteName: "Ariela Israel",
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const documentLabel = getDocumentLabel(caseStudy.status);

  return (
    <main className="mx-auto w-full max-w-360 space-y-10 px-6 pb-24 md:px-10">
      <section className="relative isolate pt-20 md:pt-28">
        <div
          aria-hidden="true"
          className="data-grid pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-[0.24] dark:opacity-[0.34]"
        />

        <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.24em] uppercase">
          {caseStudy.projectType}
          <span aria-hidden="true"> · </span>
          {documentLabel}
        </p>

        <div className="mt-4 max-w-5xl">
          <h1 className="font-heading text-primary text-5xl leading-[0.95] font-extrabold tracking-[-0.03em] text-balance md:text-7xl">
            {caseStudy.title}
          </h1>

          <p className="text-muted mt-7 max-w-3xl text-base leading-relaxed md:text-lg">
            {caseStudy.summary}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ChipRegBorder>{caseStudy.category}</ChipRegBorder>
          <ChipRegBorder>{caseStudy.status}</ChipRegBorder>

          {caseStudy.stack.map((item) => (
            <ChipThinBorder key={item}>{item}</ChipThinBorder>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={caseStudy.backHref}
            className="ring-brand text-foreground hover:text-link rounded-md text-sm font-bold transition"
          >
            ← Back to Projects
          </Link>

          {caseStudy.repoHref ? (
            <a
              href={caseStudy.repoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the ${caseStudy.title} repository in a new tab`}
              className="ring-brand text-foreground hover:text-link rounded-md text-sm font-bold transition"
            >
              Repository ↗
            </a>
          ) : null}

          {caseStudy.demoHref ? (
            <a
              href={caseStudy.demoHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${caseStudy.title} live demo in a new tab`}
              className="ring-brand text-foreground hover:text-link rounded-md text-sm font-bold transition"
            >
              Live Demo ↗
            </a>
          ) : null}
        </div>
      </section>

      <section className="mt-16">
        <GlassCard>
          <div className="grid gap-6 md:grid-cols-4">
            {caseStudy.meta.map((item) => (
              <MetaItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-16">
        <Section
          eyebrow={caseStudy.overview.eyebrow}
          title={caseStudy.overview.title}
          body={caseStudy.overview.body}
        />
      </section>

      <section className="mt-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionInner
              eyebrow={caseStudy.problem.eyebrow}
              title={caseStudy.problem.title}
              body={caseStudy.problem.body}
              list={caseStudy.problem.list}
            />
          </Card>

          <Card>
            <SectionInner
              eyebrow={caseStudy.goals.eyebrow}
              title={caseStudy.goals.title}
              body={caseStudy.goals.body}
              list={caseStudy.goals.list}
            />
          </Card>
        </div>
      </section>

      {caseStudy.equityLens ? (
        <section className="mt-16">
          <Card>
            <SectionInner
              eyebrow={caseStudy.equityLens.eyebrow}
              title={caseStudy.equityLens.title}
              body={caseStudy.equityLens.body}
              list={caseStudy.equityLens.list}
            />
          </Card>
        </section>
      ) : null}

      {caseStudy.researchBasis ? (
        <section className="mt-16">
          <Card>
            <SectionInner
              eyebrow={caseStudy.researchBasis.eyebrow}
              title={caseStudy.researchBasis.title}
              body={caseStudy.researchBasis.body}
              list={caseStudy.researchBasis.list}
            />
          </Card>
        </section>
      ) : null}

      <section className="mt-16">
        <Section
          eyebrow={caseStudy.system.eyebrow}
          title={caseStudy.system.title}
          body={caseStudy.system.body}
        />

        <div className="border-tech-chip-border bg-surface-aqua shadow-glow mt-8 rounded-[2rem] border p-8 backdrop-blur">
          <div className="space-y-4 text-center">
            {caseStudy.system.architecture.map((step, index) => (
              <div key={step.label}>
                <p className="text-foreground text-lg font-bold">{step.label}</p>

                {index < caseStudy.system.architecture.length - 1 ? (
                  <p className="font-mono-brand text-accent text-sm font-semibold">↓</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionInner
              eyebrow={caseStudy.technology.eyebrow}
              title={caseStudy.technology.title}
              body={caseStudy.technology.body}
              list={caseStudy.technology.list}
            />
          </Card>

          <Card>
            <SectionInner
              eyebrow={caseStudy.features.eyebrow}
              title={caseStudy.features.title}
              body={caseStudy.features.body}
              list={caseStudy.features.list}
            />
          </Card>
        </div>
      </section>

      <section className="mt-16">
        <Section
          eyebrow={caseStudy.technicalDecisions.eyebrow}
          title={caseStudy.technicalDecisions.title}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {caseStudy.technicalDecisions.decisions.map((decision) => (
            <Card key={decision.title}>
              <DecisionCard title={decision.title} body={decision.body} />
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionInner
              eyebrow={caseStudy.constraints.eyebrow}
              title={caseStudy.constraints.title}
              body={caseStudy.constraints.body}
              list={caseStudy.constraints.list}
            />
          </Card>

          <Card>
            <SectionInner
              eyebrow={caseStudy.outcome.eyebrow}
              title={caseStudy.outcome.title}
              body={caseStudy.outcome.body}
              list={caseStudy.outcome.list}
            />
          </Card>
        </div>
      </section>

      <section className="mt-16">
        <Card>
          <SectionInner
            eyebrow={caseStudy.nextSteps.eyebrow}
            title={caseStudy.nextSteps.title}
            body={caseStudy.nextSteps.body}
            list={caseStudy.nextSteps.list}
          />
        </Card>
      </section>
    </main>
  );
}

function getDocumentLabel(status: "Built" | "In Progress" | "Planned" | "Production") {
  switch (status) {
    case "Planned":
      return "Project Brief";

    case "In Progress":
      return "Development Notes";

    case "Built":
    case "Production":
      return "Case Study";
  }
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.22em] uppercase">
        {label}
      </p>

      <p className="text-foreground mt-2 text-sm font-bold">{value}</p>
    </div>
  );
}

function Section({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.24em] uppercase">
        {eyebrow}
      </p>

      <h2 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
        {title}
      </h2>

      {body ? <p className="text-muted mt-5 text-base leading-relaxed">{body}</p> : null}
    </div>
  );
}

function SectionInner({
  eyebrow,
  title,
  body,
  list,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  list?: string[];
}) {
  return (
    <div>
      <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.24em] uppercase">
        {eyebrow}
      </p>

      <h3 className="font-heading text-primary mt-3 text-2xl leading-tight font-semibold">
        {title}
      </h3>

      {body ? <p className="text-muted mt-4 text-base leading-relaxed">{body}</p> : null}

      {list ? (
        <ul className="text-muted mt-5 space-y-3 text-base leading-relaxed">
          {list.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="bg-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DecisionCard({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-foreground text-lg font-bold">{title}</h3>

      <p className="text-muted mt-3 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

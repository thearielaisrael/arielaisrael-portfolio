export type ProjectCategory =
  | "Professional Systems + Software"
  | "Health Data + Information Systems"
  | "Women's Health Equity + Research";

export type ProjectStatus = "Built" | "In Progress" | "Planned";

export type ProjectType = "Professional Work" | "Educational Project" | "Independent Concept";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  stack: string[];
  status: ProjectStatus;
  projectType: ProjectType;
  featured?: boolean;
  caseStudyHref?: string;
  repoHref?: string;
  demoHref?: string;
};

export const projects: Project[] = [
  /*
   * Completed professional work appears first so visitors encounter
   * demonstrated systems and technology experience before developing work.
   */
  {
    slug: "amp-ticket-add-on-flow",
    title: "AMP Ticket Add-On Flow",
    summary:
      "A production feature supporting a high-demand digital service environment through user-flow improvement, interface refinement, testing, troubleshooting, and operational support.",
    category: "Professional Systems + Software",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    status: "Built",
    projectType: "Professional Work",
    featured: true,
    caseStudyHref: "/projects/amp-ticket-add-on-flow",
  },
  {
    slug: "art-of-wine-companion-app",
    title: "Art of Wine Companion App",
    summary:
      "A production mobile-first event companion application built to organize event and vendor information, support discovery and wayfinding, and provide a reusable foundation for future event experiences.",
    category: "Professional Systems + Software",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    status: "Built",
    projectType: "Professional Work",
    featured: true,
    caseStudyHref: "/projects/art-of-wine-companion-app",
  },
  {
    slug: "periodic-tables-reservation-system",
    title: "Periodic Tables Reservation System",
    summary:
      "A completed educational full-stack application demonstrating relational data modeling, validated CRUD workflows, reservation and table-state management, and operational system design.",
    category: "Professional Systems + Software",
    stack: ["React", "Express.js", "PostgreSQL", "Knex.js", "JavaScript", "CSS"],
    status: "Built",
    projectType: "Educational Project",
    featured: true,
    caseStudyHref: "/projects/periodic-tables-reservation-system",
  },

  /*
   * Healthcare-domain work is clearly identified as independent
   * educational or research work using synthetic or public information.
   */
  {
    slug: "health-record-data-quality-lab",
    title: "Health Record Data Quality Lab",
    summary:
      "A planned educational project using synthetic health-record data to profile data quality, identify missing and inconsistent fields, flag potential duplicate records for human review, apply validation rules, document correction decisions, and produce a concise quality report.",
    category: "Health Data + Information Systems",
    stack: ["SQL", "PostgreSQL", "Python", "Pandas", "Data Validation", "Synthetic Data"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "womens-health-equity-data-analysis",
    title: "Women's Health Equity Data Analysis",
    summary:
      "A planned independent analysis using an appropriately sourced public dataset to investigate a focused question about disparities in women's health. The project will define a study population and variables, document data quality and limitations, apply descriptive analysis, and interpret findings alongside credible scholarly literature.",
    category: "Women's Health Equity + Research",
    stack: [
      "Public Health Data",
      "Data Cleaning",
      "Descriptive Statistics",
      "Data Visualization",
      "Evidence Synthesis",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },

  /*
   * Deferred portfolio roadmap
   *
   * These concepts are intentionally excluded from the public projects array.
   * They should only return after they have a specific problem, intended user,
   * evidence base, data source, scope, and concrete deliverable.
   *
   * Patient Education + Advocacy
   * Reconsider later as an evidence-based educational resource connected to
   * The Informatics Diary. Keep it educational, accessible, well sourced, and
   * explicitly nonclinical.
   *
   * Referral + Follow-Up Workflow Analysis
   * Reimagine the former Care Access Workflow System as a focused educational
   * workflow project. It could eventually examine referrals, follow-up states,
   * documentation gaps, handoffs, and operational visibility using a synthetic
   * process and dataset.
   *
   * Synthetic Longitudinal Phenotyping Study
   * Reimagine the former Longitudinal Health Record Explorer as a future
   * research-oriented project after further development in research methods,
   * statistics, clinical data, and biomedical informatics.
   *
   * Patient Dismissal Research
   * Keep deferred until there is a defensible research question, appropriate
   * data source, ethical methodology, and clearly bounded analytical purpose.
   *
   * Early Detection Care Gap Dashboard
   * Consider later as a visualization or communication layer for a completed
   * women's health equity analysis rather than as a separate project concept.
   */
];

export const featuredProjects = projects.filter(
  (project) => project.featured && project.status === "Built",
);

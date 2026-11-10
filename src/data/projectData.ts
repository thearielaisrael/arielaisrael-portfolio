export type ProjectCategory =
  | "Professional Systems + Software"
  | "Health Data + Information Systems"
  | "Black Women's Health Equity + Research";

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
   * Healthcare-domain projects are clearly identified as proposed
   * educational or research-informed work.
   *
   * These projects will use synthetic, fictional, public, deidentified,
   * or otherwise appropriately authorized data.
   */
  {
    slug: "black-womens-diagnostic-equity-evidence-map",
    title: "Black Women's Diagnostic Equity Evidence Map",
    summary:
      "A proposed structured evidence map examining published research on diagnostic disparities affecting Black women across multiple conditions, with attention to study populations, disparity categories, evidence limitations, and research gaps.",
    category: "Black Women's Health Equity + Research",
    stack: [
      "Literature Review",
      "Evidence Mapping",
      "Research Methods",
      "Evidence Synthesis",
      "Data Visualization",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "diagnostic-journey-explorer",
    title: "Diagnostic Journey Explorer",
    summary:
      "An educational prototype using synthetic longitudinal patient records to explore how symptoms, encounters, findings, documentation, and fragmented information accumulate across a diagnostic journey.",
    category: "Health Data + Information Systems",
    stack: [
      "Synthetic Data",
      "Longitudinal Data",
      "Data Visualization",
      "Clinical Information",
      "Information Architecture",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "clinical-phenotyping-mini-lab",
    title: "Clinical Phenotyping Mini-Lab",
    summary:
      "A future educational project exploring how computable phenotypes are defined and represented using synthetic or appropriately sourced public data, including phenotype logic, structured variables, validation considerations, and equity limitations.",
    category: "Health Data + Information Systems",
    stack: [
      "Biomedical Informatics",
      "Clinical Phenotyping",
      "Structured Data",
      "SQL",
      "Python",
      "Synthetic Data",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "black-womens-health-research-representation-audit",
    title: "Black Women's Health Research Representation Audit",
    summary:
      "A proposed analysis of how Black women are represented and reported in published biomedical research or clinical trials, including population composition, race and sex reporting, inclusion criteria, intersectional analysis, and evidence limitations.",
    category: "Black Women's Health Equity + Research",
    stack: [
      "Research Equity",
      "Public Research Data",
      "Data Analysis",
      "Evidence Evaluation",
      "Data Visualization",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "clinical-documentation-equity-explorer",
    title: "Clinical Documentation Equity Explorer",
    summary:
      "An educational exploration of how patient-reported symptoms and experiences may be transformed as information moves through clinical notes, structured terminology, diagnoses, problem lists, and health-data systems.",
    category: "Health Data + Information Systems",
    stack: [
      "Health Information",
      "Clinical Documentation",
      "Data Quality",
      "Structured Terminology",
      "Information Modeling",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "equity-aware-clinical-decision-support-prototype",
    title: "Equity-Aware Clinical Decision Support Prototype",
    summary:
      "A nonclinical educational prototype exploring how synthetic longitudinal information might support reassessment and escalation workflows while accounting for validation, false positives, alert fatigue, and equity requirements.",
    category: "Health Data + Information Systems",
    stack: [
      "Clinical Informatics",
      "Workflow Design",
      "Synthetic Data",
      "Decision Support",
      "Research-Informed Design",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "learning-health-system-equity-dashboard",
    title: "Learning Health System Equity Dashboard",
    summary:
      "A proposed dashboard using fictional or synthetic healthcare-system data to explore disparities in time to diagnosis, referral completion, follow-up, treatment initiation, repeat encounters, care continuity, and patient-reported experience.",
    category: "Black Women's Health Equity + Research",
    stack: [
      "Health Services Research",
      "Quality Improvement",
      "Healthcare Analytics",
      "Data Visualization",
      "Synthetic Data",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "precision-medicine-equity-audit",
    title: "Precision Medicine Equity Audit",
    summary:
      "A future research-informed project examining population representation, biomedical data sources, phenotype definitions, generalizability, validation requirements, and equity considerations in precision-medicine research.",
    category: "Black Women's Health Equity + Research",
    stack: [
      "Precision Medicine",
      "Biomedical Evidence",
      "Research Representation",
      "Evidence Evaluation",
      "Data Visualization",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
];

export const featuredProjects = projects.filter(
  (project) => project.featured && project.status === "Built",
);

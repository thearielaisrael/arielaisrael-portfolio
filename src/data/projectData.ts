export type ProjectCategory =
  | "Health Information + Informatics"
  | "Professional Systems + Software"
  | "Women's Health Equity + Research"
  // | "Patient Education + Advocacy"
  // | "Care Navigation + Workflow Systems"
  // | "Patient-Centered Digital Health Tools"
  ;

export type ProjectCategoryCard = {
  title: ProjectCategory;
  description: string;
  href: string;
};

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

export const categories = [
  {
    title: "Health Information + Informatics",
    description:
      "Educational projects exploring health-record data quality, longitudinal information, healthcare data systems, and informatics using synthetic information.",
    href: "#health-information-informatics",
  },
  {
    title: "Women's Health Equity + Research",
    description:
      "Research and analytics projects examining diagnostic processes, care gaps, healthcare data, and racial inequities across women's health.",
    href: "#womens-health-equity-research",
  },
  // {
  //   title: "Patient Education + Advocacy",
  //   description:
  //     "Plain-language resources and advocacy tools designed to make complex health information easier to understand, discuss, and act on.",
  //   href: "#patient-education-advocacy",
  // },
  // {
  //   title: "Care Navigation + Workflow Systems",
  //   description:
  //     "Concepts exploring care coordination, referrals, follow-up, scheduling, resource use, and movement through healthcare systems.",
  //   href: "#care-navigation-workflow-systems",
  // },
  // {
  //   title: "Patient-Centered Digital Health Tools",
  //   description:
  //     "Digital concepts designed to help patients organize health information, recognize patterns, prepare for care, and communicate their needs more clearly.",
  //   href: "#patient-centered-digital-health-tools",
  // },
] satisfies ProjectCategoryCard[];

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
      "A mobile-first event companion application supporting structured content, wayfinding, vendor discovery, reusable interface patterns, and full-stack product development.",
    category: "Professional Systems + Software",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    status: "Built",
    projectType: "Professional Work",
    featured: true,
    caseStudyHref: "/projects/art-of-wine-companion-app",
  },
  {
    slug: "periodic-tables-reservation-system",
    title: "Periodic Tables Reservation System",
    summary:
      "A full-stack reservation-management application demonstrating CRUD workflows, role-based user flows, relational data modeling, and operational system design.",
    category: "Professional Systems + Software",
    stack: ["React", "Express", "PostgreSQL", "Knex"],
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
      "A planned educational project using synthetic health-record data to examine duplicate records, missing and inconsistent information, validation rules, data cleaning, and approaches to documenting data-quality issues in healthcare information systems.",
    category: "Health Information + Informatics",
    stack: ["SQL", "PostgreSQL", "Python", "Data Quality", "Synthetic Data"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "longitudinal-health-record-explorer",
    title: "Longitudinal Health Record Explorer",
    summary:
      "A planned informatics prototype exploring how symptoms, encounters, medications, laboratory results, referrals, and other health information can be organized longitudinally to support clearer review of patterns across a synthetic patient history.",
    category: "Health Information + Informatics",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Recharts"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "early-detection-care-gap-dashboard",
    title: "Early Detection Care Gap Dashboard",
    summary:
      "A planned healthcare-analytics project examining screening, abnormal findings, follow-up, referral completion, and other potential care gaps using synthetic or publicly available data, with attention to differences affecting racially underserved women.",
    category: "Women's Health Equity + Research",
    stack: ["SQL", "Python", "Pandas", "Power BI", "Quality Measures"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "womens-health-equity-research",
    title: "Women's Health Equity Research",
    summary:
      "An ongoing research initiative examining how health information, healthcare data, diagnostic processes, care gaps, and patient experiences can be studied to better understand racial inequities across women's healthcare.",
    category: "Women's Health Equity + Research",
    stack: [
      "Literature Review",
      "Research Methods",
      "Public Health Data",
      "Data Analysis",
      "Evidence Synthesis",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },

  /*
   * Deferred concepts.
   *
   * These remain preserved for possible future development but are
   * intentionally hidden from the public portfolio while the healthcare
   * portfolio becomes more focused.
   */

  /*
  {
    slug: "patient-education-advocacy-library",
    title: "Patient Education & Advocacy Library",
    summary:
      "A planned plain-language resource library designed to help patients understand health information, prepare for appointments, document questions, track follow-up, and communicate more clearly with their care teams.",
    category: "Patient Education + Advocacy",
    stack: ["Next.js", "TypeScript", "MDX", "PostgreSQL", "Tailwind CSS"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  */

  /*
  {
    slug: "patient-dismissal-research-tracker",
    title: "Patient Dismissal Research Tracker",
    summary:
      "A planned research concept for organizing and visualizing evidence about patient dismissal, delayed diagnosis, unclear communication, undertreatment, and barriers to follow-up care affecting racially underserved and underrepresented women.",
    category: "Women's Health Equity + Research",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Survey Data",
      "Recharts",
    ],
    status: "Planned",
    projectType: "Independent Concept",
  },
  */

  /*
  {
    slug: "care-access-workflow-system",
    title: "Care Access Workflow System",
    summary:
      "A planned healthcare-operations concept exploring appointment flow, staff availability, rooms, resources, referrals, and operational conflicts that may affect access, follow-up, and continuity of care.",
    category: "Care Navigation + Workflow Systems",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Zustand"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  */
];

export const featuredProjects = projects.filter(
  (project) => project.featured && project.status === "Built",
);

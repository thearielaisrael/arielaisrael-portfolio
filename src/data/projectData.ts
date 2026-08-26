export type ProjectCategory =
  | "Health Information + Data Systems"
  | "Professional Systems + Software"
  | "Women's Health Equity Data + Research"
  | "Patient Education + Advocacy"
  | "Care Navigation + Workflow Systems"
  | "Patient-Centered Digital Health Tools";

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
    title: "Health Information + Data Systems",
    description:
      "Educational projects exploring health-record data quality, documentation workflows, information organization, and healthcare data systems using synthetic information.",
    href: "#health-information-data-systems",
  },
  {
    title: "Women's Health Equity Data + Research",
    description:
      "Research and data concepts examining racial disparities, delayed diagnosis, care access, patient experience, and research gaps across whole-body women's health.",
    href: "#womens-health-equity-data-research",
  },
  {
    title: "Patient Education + Advocacy",
    description:
      "Plain-language resources and advocacy tools designed to make complex health information easier to understand, discuss, and act on.",
    href: "#patient-education-advocacy",
  },
  {
    title: "Care Navigation + Workflow Systems",
    description:
      "Concepts exploring care coordination, referrals, follow-up, scheduling, resource use, and movement through healthcare systems.",
    href: "#care-navigation-workflow-systems",
  },
  {
    title: "Patient-Centered Digital Health Tools",
    description:
      "Digital concepts designed to help patients organize health information, recognize patterns, prepare for care, and communicate their needs more clearly.",
    href: "#patient-centered-digital-health-tools",
  },
] satisfies ProjectCategoryCard[];

export const projects: Project[] = [
  /*
   * Completed professional work appears first so visitors encounter
   * demonstrated systems and technology experience before planned work.
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
   * Current healthcare-domain work is clearly identified as independent
   * educational work using synthetic information.
   */
  {
    slug: "health-record-data-quality-lab",
    title: "Health Record Data Quality Lab",
    summary:
      "A planned educational lab using synthetic health-record data to examine missing information, inconsistent formatting, potential duplicate records, validation rules, and data-quality reporting.",
    category: "Health Information + Data Systems",
    stack: ["SQL", "PostgreSQL", "Python", "Data Quality", "Synthetic Data"],
    status: "Planned",
    projectType: "Independent Concept",
  },

  /*
   * Long-term research, advocacy, and informatics concepts remain clearly
   * separated from completed professional and educational evidence.
   */
  {
    slug: "womens-health-equity-data-story",
    title: "Women's Health Equity Data Story",
    summary:
      "A planned research and data-storytelling project examining racial disparities, delayed diagnosis, care-access barriers, and patient experiences across whole-body women's health using public data and plain-language interpretation.",
    category: "Women's Health Equity Data + Research",
    stack: ["Python", "Pandas", "Jupyter", "Power BI", "Public Health Data"],
    status: "Planned",
    projectType: "Independent Concept",
  },
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
  {
    slug: "careflow-symptom-timeline",
    title: "CareFlow Symptom Timeline",
    summary:
      "A planned patient-centered concept for organizing symptoms, appointments, medications, laboratory results, referrals, notes, and health events over time to support clearer longitudinal health narratives.",
    category: "Patient-Centered Digital Health Tools",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Recharts"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "early-detection-care-gap-dashboard",
    title: "Early Detection Care Gap Dashboard",
    summary:
      "A planned healthcare-analytics concept examining screening gaps, follow-up delays, referral completion, and early-detection opportunities affecting racially underserved and underrepresented women using synthetic or publicly available data.",
    category: "Women's Health Equity Data + Research",
    stack: ["SQL", "Python", "Pandas", "Power BI", "Quality Measures"],
    status: "Planned",
    projectType: "Independent Concept",
  },
  {
    slug: "patient-dismissal-research-tracker",
    title: "Patient Dismissal Research Tracker",
    summary:
      "A planned research concept for organizing and visualizing evidence about patient dismissal, delayed diagnosis, unclear communication, undertreatment, and barriers to follow-up care affecting racially underserved and underrepresented women.",
    category: "Women's Health Equity Data + Research",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Survey Data", "Recharts"],
    status: "Planned",
    projectType: "Independent Concept",
  },
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
];

export const featuredProjects = projects.filter(
  (project) => project.featured && project.status === "Built",
);

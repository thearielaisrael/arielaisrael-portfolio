import type { ProjectType } from "./projectData";

export type CaseStudyMetaItem = {
  label: string;
  value: string;
};

export type CaseStudySection = {
  eyebrow: string;
  title: string;
  body?: string;
  list?: string[];
};

export type CaseStudyDecision = {
  title: string;
  body: string;
};

export type CaseStudyArchitectureStep = {
  label: string;
};

export type CaseStudyCategory =
  | "Health Information + Data Systems"
  | "Professional Systems + Software"
  | "Operational Tools"
  | "Patient-Centered Digital Health Tools"
  | "Care Navigation + Workflow Systems"
  | "Women's Health Equity Data + Research"
  | "Patient Education + Advocacy";

export type CaseStudyStatus = "Built" | "In Progress" | "Planned" | "Production";

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  category: CaseStudyCategory;
  status: CaseStudyStatus;
  projectType: ProjectType;
  stack: string[];
  backHref: string;
  repoHref?: string;
  demoHref?: string;

  meta: CaseStudyMetaItem[];

  overview: CaseStudySection;
  problem: CaseStudySection;
  goals: CaseStudySection;

  equityLens?: CaseStudySection;
  researchBasis?: CaseStudySection;

  system: {
    eyebrow: string;
    title: string;
    body: string;
    architecture: CaseStudyArchitectureStep[];
  };

  technology: CaseStudySection;
  features: CaseStudySection;

  technicalDecisions: {
    eyebrow: string;
    title: string;
    decisions: CaseStudyDecision[];
  };

  constraints: CaseStudySection;
  outcome: CaseStudySection;
  nextSteps: CaseStudySection;
};

export const caseStudies: CaseStudy[] = [
  // PERIODIC TABLES
  {
    slug: "periodic-tables-reservation-system",
    title: "Periodic Tables Reservation System",
    summary:
      "A full-stack reservation management application built to support structured booking workflows, table coordination, operational visibility, and clearer day-to-day service management.",
    category: "Professional Systems + Software",
    projectType: "Educational Project",
    status: "Built",
    stack: ["React", "Express.js", "PostgreSQL", "Knex.js"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Solo Engineer" },
      { label: "Status", value: "Built" },
      { label: "Focus", value: "Workflow + Operations" },
      { label: "Type", value: "Educational Full-Stack Application" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "What this project is",
      body: "This project is a reservation management system designed to support structured booking workflows, table coordination, CRUD operations, and role-oriented user flows. While it was built for restaurant service, the project reflects a larger interest in workflow design, operational clarity, and systems that make complex coordination easier to manage.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Why this project exists",
      body: "Reservation workflows become difficult to manage when booking details, table states, and service coordination are handled inconsistently. The project was built to create a clearer operational system for managing reservations, seating flow, and real-time service decisions.",
    },

    goals: {
      eyebrow: "Goals",
      title: "Project goals",
      list: [
        "Build a full-stack application for reservation and seating workflows",
        "Support CRUD operations with validation and operational rules",
        "Model real coordination needs through relational data and user flows",
        "Create a clean, responsive interface for day-to-day workflow management",
        "Demonstrate how structured systems can reduce confusion in high-movement service environments",
      ],
    },

    system: {
      eyebrow: "System",
      title: "System architecture",
      body: "The application separates frontend workflow views, backend business logic, and relational data storage so reservation handling remains structured, predictable, and easier to maintain.",
      architecture: [
        { label: "Reservation input" },
        { label: "Validation / business rules" },
        { label: "Express API" },
        { label: "PostgreSQL" },
        { label: "Reservation + table state queries" },
        { label: "React interface" },
      ],
    },

    technology: {
      eyebrow: "Stack",
      title: "Technology used",
      list: ["React", "Express.js", "PostgreSQL", "Knex.js", "JavaScript", "CSS"],
    },

    features: {
      eyebrow: "Features",
      title: "Key capabilities",
      list: [
        "Reservation creation, editing, and cancellation flows",
        "Table assignment and seating management",
        "Business-rule validation for operational constraints",
        "Responsive interfaces for reservation workflows",
        "Structured backend logic for stateful reservation handling",
        "Database-backed coordination between related operational entities",
      ],
    },

    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Important implementation choices",
      decisions: [
        {
          title: "Why PostgreSQL",
          body: "Reservations and table states require structured relationships, reliable querying, and predictable updates, which made PostgreSQL a practical choice for modeling the application data.",
        },
        {
          title: "Why Express for backend logic",
          body: "Express provided a straightforward way to handle reservation workflows, validation rules, and API endpoints while keeping the backend understandable and maintainable.",
        },
        {
          title: "Why prioritize workflow over decoration",
          body: "For operations-heavy applications, clear interaction flows and state handling matter more than visual complexity. The project prioritized usability, task completion, and operational clarity.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Challenges and limitations",
      body: "Reservation systems involve many small operational rules that can create bugs if they are not handled intentionally. A key challenge was translating real workflow constraints into backend validation, database structure, and predictable UI behavior.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What this project demonstrates",
      body: "This project demonstrates full-stack application development, relational data modeling, database-backed workflow management, validation, and the translation of operational complexity into a clearer user-facing system. It provides evidence of the systems thinking, information organization, and workflow analysis I now bring into my study of health information and healthcare operations.",
    },

    nextSteps: {
      eyebrow: "Next Steps",
      title: "Future improvements",
      list: [
        "Refine table management and edge-case handling",
        "Improve interface clarity for high-volume service flow",
        "Add stronger reporting around reservation activity",
        "Modernize the rebuild with updated styling, documentation, and clearer case study notes",
        "Use the rebuild to further demonstrate workflow design and operational systems thinking",
      ],
    },
  },

  // AMP TICKETS
  {
    slug: "amp-ticket-add-on-flow",
    title: "AMP Ticket Add-On Flow",
    summary:
      "A production feature designed to improve add-on visibility, checkout usability, and user flow clarity within an existing ticketing ecosystem.",
    category: "Professional Systems + Software",
    projectType: "Professional Work",
    status: "Production",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Sole Developer" },
      { label: "Status", value: "Production" },
      { label: "Focus", value: "Checkout UX + Feature Integration" },
      { label: "Type", value: "Professional Production Feature" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "What this project is",
      body: "This project was a production feature built within an existing ticketing environment to improve how event add-ons were surfaced during the purchase experience. The work focused on usability, accessibility-conscious interface refinement, integration constraints, and feature implementation inside an established system.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Why this project exists",
      body: "Add-on opportunities can be missed when they are not clearly surfaced in the purchasing flow. The goal of this work was to improve add-on visibility and usability without disrupting the surrounding ticketing experience or creating unnecessary friction for users.",
    },

    goals: {
      eyebrow: "Goals",
      title: "Project goals",
      list: [
        "Improve visibility of add-on options during checkout",
        "Integrate the feature cleanly into an existing ticketing environment",
        "Preserve usability and accessibility while extending the flow",
        "Support a production-ready implementation within platform constraints",
        "Balance business goals with user clarity and checkout continuity",
      ],
    },

    system: {
      eyebrow: "System",
      title: "Feature integration flow",
      body: "Because this was a feature integration rather than a standalone system, the architecture centered on extending an existing frontend flow while respecting current platform boundaries, dependencies, and user expectations.",
      architecture: [
        { label: "User enters checkout flow" },
        { label: "Add-on feature UI" },
        { label: "Existing ticketing integration" },
        { label: "Selection / state handling" },
        { label: "Checkout continuation" },
      ],
    },

    technology: {
      eyebrow: "Stack",
      title: "Technology used",
      list: ["React", "TypeScript", "Tailwind CSS"],
    },

    features: {
      eyebrow: "Features",
      title: "Key capabilities",
      list: [
        "Integrated add-on visibility within the purchase flow",
        "Usability-focused frontend interaction patterns",
        "Feature implementation inside an existing production ecosystem",
        "Accessibility-conscious UI refinement",
        "Improved alignment between business goals and user flow",
        "State handling for add-on selection within the checkout experience",
      ],
    },

    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Important implementation choices",
      decisions: [
        {
          title: "Why integrate instead of rebuilding",
          body: "The existing ticketing environment already had production dependencies, so the feature had to extend current behavior without destabilizing the broader system.",
        },
        {
          title: "Why TypeScript for the feature layer",
          body: "TypeScript helped keep state and interaction behavior more predictable while integrating the feature into an existing frontend codebase.",
        },
        {
          title: "Why UX clarity was central",
          body: "Because the feature depended on visibility and decision-making within a purchase flow, interface clarity, placement, and user continuity mattered as much as implementation details.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Challenges and limitations",
      body: "Feature work inside an existing production system is constrained by upstream integrations, surrounding UX patterns, existing business rules, and the need to avoid regressions. This project required balancing product goals with system stability and user experience.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What this project demonstrates",
      body: "This work demonstrates production frontend development, feature integration within an established system, accessibility-conscious implementation, and thoughtful alignment between user flow, technical constraints, and organizational priorities. It also reflects my ability to improve information access and usability within complex operational environments.",
    },

    nextSteps: {
      eyebrow: "Next Steps",
      title: "Future improvements",
      list: [
        "Measure interaction performance and add-on engagement more deeply",
        "Refine feature placement based on user behavior",
        "Expand analytics around add-on selection patterns",
        "Document implementation considerations for similar feature work",
        "Use this case study to show how product clarity and system constraints shape implementation decisions",
      ],
    },
  },

  // AOW
  {
    slug: "art-of-wine-companion-app",
    title: "Art of Wine Companion App",
    summary:
      "A mobile-first event companion app designed to support vendor discovery, event navigation, structured information access, and reusable UI patterns for future event experiences.",
    category: "Professional Systems + Software",
    projectType: "Professional Work",
    status: "Production",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Sole Developer" },
      { label: "Status", value: "Production" },
      { label: "Focus", value: "Information Access + Event Experience" },
      { label: "Type", value: "Professional Production Application" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "What this project is",
      body: "This project is a mobile-first event companion application built to support users during a large-scale event experience. It focuses on vendor discovery, event-specific information access, structured content modeling, and reusable frontend patterns for future event applications.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Why this project exists",
      body: "Large events often create friction around wayfinding, vendor discovery, and access to event-specific information. The goal of this project was to create a more usable digital companion that improves navigation, information access, and decision-making during the event experience.",
    },

    goals: {
      eyebrow: "Goals",
      title: "Project goals",
      list: [
        "Design a mobile-first interface for event attendees",
        "Support vendor browsing and discovery workflows",
        "Create a reusable UI and data structure for future event apps",
        "Build a maintainable application foundation that can scale beyond a single event",
        "Make event-specific information easier to find, understand, and act on",
      ],
    },

    system: {
      eyebrow: "System",
      title: "Information architecture and system flow",
      body: "The app combines structured content modeling, frontend interaction design, and backend-backed event data so users can move through event information in a more coherent way.",
      architecture: [
        { label: "Event content / vendor data" },
        { label: "Structured data model" },
        { label: "Prisma / PostgreSQL" },
        { label: "API / server logic" },
        { label: "Next.js mobile-first UI" },
      ],
    },

    technology: {
      eyebrow: "Stack",
      title: "Technology used",
      list: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    },

    features: {
      eyebrow: "Features",
      title: "Key capabilities",
      list: [
        "Vendor discovery and browsing flows",
        "Mobile-first layout for event use",
        "Structured event content modeling",
        "Reusable component patterns for future event apps",
        "Interactive support for event-specific information access",
        "Backend-backed content organization for event and vendor data",
      ],
    },

    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Important implementation choices",
      decisions: [
        {
          title: "Why mobile-first by default",
          body: "Because the application is intended for live event use, the interface needed to prioritize on-the-go access, fast scanning, and constrained mobile attention first.",
        },
        {
          title: "Why Prisma with PostgreSQL",
          body: "The project benefits from a structured schema and typed data access, making Prisma and PostgreSQL a strong fit for event and vendor-related content relationships.",
        },
        {
          title: "Why reusable UI patterns matter",
          body: "The app was designed not only as a single event experience, but as a foundation for similar future experiences, so reusable components and scalable structure were important from the start.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Challenges and limitations",
      body: "Event applications must balance usefulness with speed, simplicity, and attention constraints, especially on mobile devices. One key challenge was deciding how much functionality to include without making the experience feel heavy or cluttered.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What this project demonstrates",
      body: "This project demonstrates mobile-first application development, structured content modeling, relational data systems, reusable interface design, and the creation of tools that improve information access in a real-world environment. Those capabilities form part of the technical and information-systems foundation I am carrying into healthcare.",
    },

    nextSteps: {
      eyebrow: "Next Steps",
      title: "Future improvements",
      list: [
        "Expand interactive event guidance and wayfinding support",
        "Refine vendor discovery flows and UI states",
        "Add richer saved or favorited content interactions",
        "Document reusable architecture patterns for future event apps",
        "Carry the information architecture lessons from this project into future health-information, patient-education, and care-navigation concepts",
      ],
    },
  },
];

const duplicateSlugs = caseStudies
  .map((caseStudy) => caseStudy.slug)
  .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

if (process.env.NODE_ENV === "development" && duplicateSlugs.length > 0) {
  console.warn("Duplicate case-study slugs found:", duplicateSlugs);
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

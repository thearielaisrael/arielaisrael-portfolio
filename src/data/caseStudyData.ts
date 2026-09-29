import type { ProjectCategory, ProjectStatus, ProjectType } from "./projectData";

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

export type CaseStudyCategory = ProjectCategory;

export type CaseStudyStatus = ProjectStatus | "Production";

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
      "A completed educational full-stack application demonstrating relational data modeling, validated CRUD workflows, reservation and table-state management, and operational system design.",
    category: "Professional Systems + Software",
    projectType: "Educational Project",
    status: "Built",
    stack: ["React", "Express.js", "PostgreSQL", "Knex.js", "JavaScript", "CSS"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Solo Full-Stack Developer" },
      { label: "Status", value: "Built" },
      { label: "Focus", value: "Relational Data + Workflow Validation" },
      { label: "Type", value: "Educational Full-Stack Application" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "Modeling a multi-step operational workflow",
      body: "Periodic Tables is a completed educational reservation-management application built around interconnected reservation, seating, and table-status workflows. The project required coordinating frontend interactions, API behavior, business-rule validation, and relational data while keeping each workflow state understandable to the user.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Keeping related reservation and seating states consistent",
      body: "Reservation management involves more than storing booking details. Reservations must move through valid states, tables must reflect current availability, and seating actions must follow operational rules. The application needed to coordinate these related records and prevent invalid actions from producing inconsistent data or confusing workflow states.",
    },

    goals: {
      eyebrow: "Goals",
      title: "What the application needed to accomplish",
      list: [
        "Support reservation creation, review, editing, cancellation, and seating workflows",
        "Model relationships among reservations, tables, capacity, and status",
        "Enforce business rules through frontend and backend validation",
        "Keep database records and visible workflow states consistent",
        "Provide responsive interfaces for completing common operational tasks",
      ],
    },

    system: {
      eyebrow: "System",
      title: "Connecting user actions to validated relational data",
      body: "The application separated interface behavior, API requests, business-rule validation, query logic, and relational storage. Each reservation or table action moved through these layers before the updated state was returned to the interface.",
      architecture: [
        { label: "Reservation or table action" },
        { label: "React workflow interface" },
        { label: "Express API endpoint" },
        { label: "Validation and business rules" },
        { label: "Knex query layer" },
        { label: "PostgreSQL relational data" },
        { label: "Updated workflow state" },
      ],
    },

    technology: {
      eyebrow: "Technology",
      title: "Tools used",
      body: "The application used React for workflow interfaces, Express.js for API and backend behavior, Knex.js for database queries and migrations, and PostgreSQL for relational data storage.",
      list: ["React", "Express.js", "PostgreSQL", "Knex.js", "JavaScript", "CSS"],
    },

    features: {
      eyebrow: "Application Work",
      title: "Key implementation areas",
      list: [
        "Reservation creation, editing, search, and cancellation",
        "Table creation and capacity management",
        "Reservation seating and table assignment",
        "Reservation and table-status transitions",
        "Frontend and backend validation for operational rules",
        "Database-backed coordination of related records",
      ],
    },

    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Implementation choices shaped by workflow integrity",
      decisions: [
        {
          title: "Model related records relationally",
          body: "Reservations and tables have connected states and constraints. PostgreSQL provided a structured way to represent those relationships, enforce consistency, and query the records needed for each workflow.",
        },
        {
          title: "Validate across application layers",
          body: "User-facing validation supported clearer interaction, while backend validation protected business rules and data integrity when reservation and table actions reached the API.",
        },
        {
          title: "Make state transitions explicit",
          body: "Reservation and table workflows depend on valid status changes. The implementation treated those transitions as defined operational actions rather than allowing records to change without context.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Coordinating rules across related workflows",
      body: "A change to one record could affect several parts of the application. Seating a reservation, for example, required the reservation and table to meet specific conditions before both states could be updated correctly. The project required careful coordination among interface behavior, API logic, validation, queries, and error handling.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What the completed project demonstrates",
      body: "The completed application demonstrates full-stack development, relational data modeling, SQL-backed workflows, CRUD operations, layered validation, API design, state management, and systematic handling of operational rules. It provides concrete evidence of the structured-data, workflow-analysis, testing, and problem-solving foundation I bring to systems, data-quality, and health-information work.",
    },

    nextSteps: {
      eyebrow: "Further Development",
      title: "How the application could continue to evolve",
      list: [
        "Expand automated testing for validation rules, state transitions, and edge cases",
        "Strengthen reporting around reservation volume, table use, and workflow activity",
        "Improve error states and recovery guidance for invalid actions",
        "Refine accessibility and responsive behavior across workflow screens",
        "Modernize technical documentation and deployment instructions",
      ],
    },
  },

  // AMP TICKETS
  {
    slug: "amp-ticket-add-on-flow",
    title: "AMP Ticket Add-On Flow",
    summary:
      "A production ticketing feature built to make event add-ons easier to discover and select while preserving checkout continuity, accessibility, and compatibility with an established application.",
    category: "Professional Systems + Software",
    projectType: "Professional Work",
    status: "Production",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Sole Full-Stack Developer" },
      { label: "Status", value: "Production" },
      { label: "Focus", value: "Feature Integration + Checkout UX" },
      { label: "Type", value: "Professional Production Feature" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "Extending an established ticketing experience",
      body: "This project involved designing and implementing an add-on feature within an existing production ticketing application. The feature needed to make optional event purchases easier to discover and select while fitting the application's established checkout flow, interface patterns, accessibility expectations, and technical constraints.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Making optional purchases visible without disrupting checkout",
      body: "Add-on opportunities can be overlooked when they are difficult to find, poorly timed, or disconnected from the surrounding purchase flow. The challenge was to improve their visibility and usability without adding unnecessary friction, confusing users, or destabilizing an established production experience.",
    },

    goals: {
      eyebrow: "Goals",
      title: "What the feature needed to accomplish",
      list: [
        "Make relevant add-on options easier to discover during the purchase process",
        "Integrate the feature into the existing ticketing experience and interface patterns",
        "Preserve checkout continuity while introducing an additional decision point",
        "Support accessible and understandable interaction states",
        "Implement and test the feature within existing platform and production constraints",
      ],
    },

    system: {
      eyebrow: "System",
      title: "Integrating the feature into an existing flow",
      body: "Because this was an extension of an established production application, the implementation needed to work within existing checkout behavior, state management, interface patterns, dependencies, and integration boundaries rather than introducing an isolated experience.",
      architecture: [
        { label: "Existing checkout context" },
        { label: "Add-on presentation" },
        { label: "User selection and interaction state" },
        { label: "Existing ticketing integration" },
        { label: "Checkout continuation" },
      ],
    },

    technology: {
      eyebrow: "Technology",
      title: "Tools used",
      body: "The feature was implemented within the application's existing frontend stack using React, TypeScript, and Tailwind CSS.",
      list: ["React", "TypeScript", "Tailwind CSS"],
    },

    features: {
      eyebrow: "Feature Work",
      title: "Key implementation areas",
      list: [
        "Add-on presentation within the existing purchase flow",
        "Selection and interaction-state handling",
        "Integration with established ticketing behavior",
        "Accessible interface structure and controls",
        "Responsive styling consistent with the surrounding application",
        "Testing and refinement within a production environment",
      ],
    },
    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Implementation choices shaped by the existing system",
      decisions: [
        {
          title: "Extend the existing flow",
          body: "The feature needed to work within an established ticketing application, so the implementation extended current checkout behavior and interface patterns instead of creating a separate purchasing experience.",
        },
        {
          title: "Keep interaction state predictable",
          body: "TypeScript supported clearer handling of selection states and interaction behavior while the feature was integrated into an existing frontend codebase.",
        },
        {
          title: "Prioritize checkout clarity",
          body: "The feature introduced another decision within a sensitive purchase flow. Placement, labeling, accessible controls, and continuity needed to remain understandable without competing with the primary checkout task.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Working within a production ecosystem",
      body: "The feature had to operate within existing platform behavior, dependencies, business rules, interface conventions, and release expectations. The work also required protecting checkout continuity, reducing regression risk, and documenting the project without exposing proprietary system details.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What the completed work demonstrates",
      body: "The result was a production feature integrated into an established ticketing application. The work demonstrates feature development within an existing system, typed interaction-state handling, accessibility-conscious interface implementation, testing, troubleshooting, and balancing product requirements with technical constraints and user-flow clarity.",
    },

    nextSteps: {
      eyebrow: "Further Development",
      title: "How the feature could continue to evolve",
      list: [
        "Evaluate feature discoverability and interaction patterns using appropriately collected product data",
        "Refine placement and presentation based on documented user behavior and accessibility feedback",
        "Expand testing across checkout states, edge cases, and supported devices",
        "Strengthen implementation documentation for maintenance and future feature work",
        "Review the feature periodically as the surrounding ticketing experience changes",
      ],
    },
  },

  // ART OF WINE
  {
    slug: "art-of-wine-companion-app",
    title: "Art of Wine Companion App",
    summary:
      "A production mobile-first event companion application built to organize event and vendor information, support discovery and wayfinding, and provide a reusable foundation for future event experiences.",
    category: "Professional Systems + Software",
    projectType: "Professional Work",
    status: "Production",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    backHref: "/projects",

    meta: [
      { label: "Role", value: "Sole Full-Stack Developer" },
      { label: "Status", value: "Production" },
      { label: "Focus", value: "Information Access + Event Experience" },
      { label: "Type", value: "Professional Production Application" },
    ],

    overview: {
      eyebrow: "Overview",
      title: "Organizing an event experience around accessible information",
      body: "The Art of Wine Companion App is a production mobile-first application built to help attendees navigate event information and discover participating vendors. The project combined structured content, relational data, backend-supported information access, and reusable interface patterns within an experience designed primarily for mobile use.",
    },

    problem: {
      eyebrow: "Problem",
      title: "Helping attendees find useful information during a live event",
      body: "Large events can make vendor discovery, wayfinding, and access to event-specific information difficult, especially when attendees are moving through a busy environment and relying on their phones. The application needed to organize that information into a clear, responsive experience without overwhelming users or making important details difficult to find.",
    },

    goals: {
      eyebrow: "Goals",
      title: "What the application needed to accomplish",
      list: [
        "Create a mobile-first experience for attendees using the application during the event",
        "Make vendor and event information easier to browse and locate",
        "Organize content through a structured and maintainable data model",
        "Support reusable interface and data patterns for future event applications",
        "Balance useful functionality with clear navigation and fast scanning",
      ],
    },

    system: {
      eyebrow: "System",
      title: "Connecting structured event data to a mobile-first interface",
      body: "The application connected structured event and vendor information with a relational database, server-side application logic, and reusable frontend components. This separation supported clearer content organization while allowing the interface to present information in a format suited to mobile event use.",
      architecture: [
        { label: "Event and vendor information" },
        { label: "Structured Prisma data model" },
        { label: "PostgreSQL database" },
        { label: "Server and application logic" },
        { label: "Next.js mobile-first interface" },
      ],
    },

    technology: {
      eyebrow: "Technology",
      title: "Tools used",
      body: "The application used Next.js and TypeScript for the application layer, Prisma for structured data access, PostgreSQL for relational storage, and Tailwind CSS for responsive interface styling.",
      list: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    },

    features: {
      eyebrow: "Application Work",
      title: "Key implementation areas",
      list: [
        "Vendor discovery and browsing flows",
        "Mobile-first event information access",
        "Structured event and vendor content",
        "Relational data modeling with Prisma and PostgreSQL",
        "Reusable interface components for related event experiences",
        "Responsive navigation and content presentation",
      ],
    },

    technicalDecisions: {
      eyebrow: "Technical Decisions",
      title: "Implementation choices shaped by event use",
      decisions: [
        {
          title: "Design for mobile use first",
          body: "Attendees were expected to access the application while moving through the event, so the interface prioritized mobile screen sizes, clear navigation, fast scanning, and focused content presentation.",
        },
        {
          title: "Model event information relationally",
          body: "Vendor and event information contained structured relationships that needed to remain consistent and maintainable. Prisma and PostgreSQL provided a typed data-access layer and a relational foundation for organizing that content.",
        },
        {
          title: "Build reusable patterns",
          body: "The application was designed as more than a one-time interface. Reusable components and structured content patterns created a foundation that could support similar event experiences without rebuilding every interaction from the beginning.",
        },
      ],
    },

    constraints: {
      eyebrow: "Constraints",
      title: "Building for attention-limited event use",
      body: "The application needed to remain useful on a small screen while users were navigating a live event with limited time and attention. The work required balancing information depth with scanability, organizing varied event content consistently, and keeping the production implementation maintainable without introducing unnecessary interface complexity.",
    },

    outcome: {
      eyebrow: "Outcome",
      title: "What the completed work demonstrates",
      body: "The result was a production mobile-first application supported by structured content, relational data, reusable components, and backend application logic. The project demonstrates full-stack product development, information architecture, database-backed content organization, responsive interface design, and the translation of event and operational requirements into a usable digital system.",
    },

    nextSteps: {
      eyebrow: "Further Development",
      title: "How the application could continue to evolve",
      list: [
        "Evaluate information findability using appropriately collected feedback and product data",
        "Refine vendor discovery, filtering, and browsing states",
        "Expand event guidance and wayfinding support where useful",
        "Add saved or favorited content interactions if supported by user needs",
        "Strengthen documentation for reuse across future event applications",
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

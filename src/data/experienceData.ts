export type ExperienceEntry = {
  id: string;
  organization: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  strengths: string[];
};

export type AppliedStudyEntry = {
  id: string;
  title: string;
  organization: string;
  period: string;
  summary: string;
  highlights: string[];
  focusAreas: string[];
};

export type EducationEntry = {
  institution: string;
  credential: string;
  field: string;
  period: string;
  status?: string;
  certificates?: {
    name: string;
    status: string;
  }[];
};

export const featuredExperience: ExperienceEntry[] = [
  {
    id: "walton-arts-center-walmart-amp",
    organization: "Walton Arts Center and Walmart AMP",
    role: "Full-stack Developer",
    period: "August 2024 - July 2025",
    location: "Remote",
    summary:
      "Served as the sole full-stack developer responsible for production applications used by staff and public audiences across ticketing, events, and operational workflows.",
    highlights: [
      "Owned the full development lifecycle across planning, implementation, testing, debugging, deployment, maintenance, and iteration.",
      "Built and maintained scalable application features supporting high-demand public ticketing and event workflows.",
      "Implemented and monitored Queue-It virtual waiting-room infrastructure to support fair access and system stability during peak traffic periods.",
      "Improved usability and accessibility by redesigning interfaces around observed user needs and operational pain points.",
      "Integrated logging and monitoring workflows to support troubleshooting, performance review, and service-quality evaluation.",
      "Translated business and operational requirements into maintainable technical solutions aligned with real-world workflows.",
    ],
    strengths: [
      "Production Systems",
      "Full-stack Development",
      "Documentation",
      "Quality Assurance",
      "Accessibility",
      "Monitoring",
      "Troubleshooting",
      "Workflow Analysis",
    ],
  },
  {
    id: "ajsi-creative",
    organization: "AJSI Creative",
    role: "Designer & Full-stack Developer",
    period: "November 2023 - August 2024",
    location: "Washington, DC",
    summary:
      "Designed and developed custom websites and applications for small-business and mission-driven clients, balancing technical implementation with usability and operational needs.",
    highlights: [
      "Built responsive, accessible interfaces for desktop and mobile experiences.",
      "Developed backend services, APIs, and data workflows supporting content, forms, integrations, and client operations.",
      "Conducted discovery, requirements gathering, and iterative design with nontechnical stakeholders.",
      "Managed testing, debugging, deployment, and post-launch improvements supporting stable production use.",
      "Translated client goals into maintainable digital systems while balancing design, user experience, and technical requirements.",
    ],
    strengths: [
      "Full-stack Development",
      "APIs",
      "Data Workflows",
      "Requirements Gathering",
      "Accessibility",
      "Testing",
      "Stakeholder Communication",
    ],
  },
];

export const appliedStudy: AppliedStudyEntry[] = [
  {
    id: "womens-health-equity-informatics-study",
    title: "Women's Health Equity, Health Information & Informatics Study",
    organization: "Independent Study / Applied Projects",
    period: "January 2026 - Present",
    summary:
      "Independent academic study and project development connecting women's health equity, health information, healthcare data, research, informatics, and patient-centered technology.",
    highlights: [
      "Developing healthcare-domain knowledge through formal study in Health Services Management, Health Information Management & Data Analytics, and Data Analytics.",
      "Exploring racial disparities, delayed diagnosis, fragmented care, research gaps, longitudinal health information, and women's whole-body health across the life course.",
      "Developing educational project concepts involving health-record data quality, documentation workflows, patient education, care navigation, and healthcare information organization.",
      "Using synthetic or publicly available information for educational projects rather than protected patient information or professional clinical records.",
      "Documenting academic development, research questions, informatics learning, and technical reflections through The Informatics Diary.",
      "Building on an existing software and systems foundation through health-focused work involving structured data, SQL, accessibility, data modeling, and information design.",
    ],
    focusAreas: [
      "Women's Health Equity",
      "Health Information",
      "Healthcare Data",
      "Biomedical Informatics",
      "Research Literacy",
      "Data Quality",
      "Academic Development",
    ],
  },
];

export const additionalExperience: ExperienceEntry[] = [
  {
    id: "enterprise-mobility",
    organization: "Enterprise Mobility",
    role: "Driver",
    period: "February 2023 - August 2024",
    location: "Arlington, VA",
    summary:
      "Worked within a time-sensitive logistics environment requiring procedural consistency, reliability, communication, and attention to detail.",
    highlights: [
      "Maintained a 98% customer-satisfaction rate through clear communication, punctuality, and attention to detail.",
      "Followed standardized operational and quality procedures supporting safe, reliable asset transport.",
      "Supported workflow consistency and timely service in a high-volume environment.",
    ],
    strengths: [
      "Operational Reliability",
      "Process Adherence",
      "Customer Communication",
      "Time Management",
    ],
  },
  {
    id: "marketsource",
    organization: "MarketSource Inc.",
    role: "Retail Sales Representative",
    period: "August 2020 - July 2021",
    location: "Washington, DC",
    summary:
      "Provided product education, technical troubleshooting, and customer support in a performance-driven retail environment.",
    highlights: [
      "Delivered product presentations associated with a 15% increase in client engagement.",
      "Achieved a 96% resolution rate for technical issues involving mobile devices.",
      "Closed 30% more sales than the company's average sales representative.",
    ],
    strengths: ["Technical Support", "Customer Education", "Communication", "Problem Resolution"],
  },
  {
    id: "cvs-pharmacy",
    organization: "CVS Pharmacy",
    role: "Retail Sales Associate",
    period: "October 2018 - August 2020",
    location: "Washington, DC",
    summary:
      "Supported customers in a pharmacy and health-retail setting while following established procedures and maintaining accurate information.",
    highlights: [
      "Assisted customers with product selection, insurance-linked programs, and general product education.",
      "Maintained accurate records and followed company procedures supporting safe and consistent retail operations.",
    ],
    strengths: [
      "Record Accuracy",
      "Process Adherence",
      "Customer Education",
      "Health-Retail Experience",
    ],
  },
];

export const education: EducationEntry[] = [
  {
    institution: "University of Maryland Global Campus",
    credential: "Bachelor of Science",
    field: "Health Services Management",
    period: "2026 - 2029",
    status: "In Progress",
    certificates: [
      {
        name: "Health Information Management & Data Analytics",
        status: "In Progress",
      },
      {
        name: "Data Analytics",
        status: "In Progress",
      },
    ],
  },
  {
    institution: "Thinkful",
    credential: "Certificate of Completion",
    field: "Software Engineering",
    period: "June 2023 - January 2024",
  },
];

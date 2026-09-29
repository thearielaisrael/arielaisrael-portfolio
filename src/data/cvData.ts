export type CvCompetencyStage = "Established" | "Developing";

export type CvCompetencyGroup = {
  title: string;
  stage: CvCompetencyStage;
  description: string;
  items: string[];
};

export type CvResearchInterest = {
  title: string;
  description: string;
};

export const cvProfile = {
  eyebrow: "Curriculum Vitae",
  heading: "Professional and academic experience across systems, data, and healthcare",
  description:
    "I am a Health Services Management student, Women's Health Equity Advocate, and aspiring Clinical and Biomedical Informaticist with professional experience in software systems, structured data, databases, documentation, accessibility, quality assurance, and workflow-focused problem-solving.",
  supportingText:
    "This evolving record brings together my established professional experience, current education, completed technical work, developing research interests, and public scholarship.",
};

export const academicSnapshot = {
  institution: "University of Maryland Global Campus",
  degree: "Bachelor of Science",
  field: "Health Services Management",
  status: "In Progress",
  expectedCompletion: "2029",
  gpa: "4.0",
  gpaScale: "4.0",
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
};

export const researchInterests: CvResearchInterest[] = [
  {
    title: "Women's Whole-Body Health Equity",
    description:
      "Racial and systemic disparities affecting underserved and underrepresented women across reproductive, endocrine, metabolic, cardiovascular, autoimmune, chronic, mental, and multisystem health.",
  },
  {
    title: "Longitudinal Health Data",
    description:
      "How symptoms, encounters, laboratory findings, diagnoses, referrals, medications, treatments, and care patterns accumulate across time.",
  },
  {
    title: "Clinical Phenotyping",
    description:
      "How clinical information can be organized into meaningful representations of symptoms, conditions, disease patterns, and patient trajectories.",
  },
  {
    title: "Diagnostic Disparities",
    description:
      "Differences in recognition, evaluation, diagnosis, treatment, and follow-up that may contribute to delayed or missed care.",
  },
  {
    title: "Clinical and Biomedical Informatics",
    description:
      "The responsible use of health information, biomedical knowledge, computational methods, and technology to support research and better-informed care.",
  },
  {
    title: "Precision Medicine",
    description:
      "How clinical, biological, environmental, and other health information may contribute to more precise and equitable approaches to prevention, diagnosis, and treatment.",
  },
  {
    title: "Equitable Clinical Intelligence",
    description:
      "How decision support, algorithms, and artificial intelligence can be developed and evaluated without reproducing disparities already present in healthcare and its data.",
  },
];

export const competencyGroups: CvCompetencyGroup[] = [
  {
    title: "Systems and Application Development",
    stage: "Established",
    description:
      "Professional experience building, maintaining, troubleshooting, and improving digital applications and operational systems.",
    items: [
      "Full-stack application development",
      "Production application support",
      "Frontend and backend systems",
      "API development and integration",
      "Relational application architecture",
      "Technical troubleshooting",
      "Deployment and maintenance",
      "Systems thinking",
    ],
  },
  {
    title: "Data and Information Systems",
    stage: "Established",
    description:
      "Experience working with structured information, relational databases, data workflows, validation, and database-backed applications.",
    items: [
      "SQL",
      "PostgreSQL",
      "Relational data modeling",
      "Structured data",
      "Database querying",
      "Data validation",
      "Data-quality awareness",
      "Information workflows",
    ],
  },
  {
    title: "Quality, Documentation, and Accessibility",
    stage: "Established",
    description:
      "Professional practices supporting reliable systems, understandable information, accessible experiences, and maintainable work.",
    items: [
      "Quality assurance",
      "Functional testing",
      "Debugging",
      "Regression awareness",
      "Technical documentation",
      "Accessibility-conscious development",
      "Requirements documentation",
      "Process clarity",
    ],
  },
  {
    title: "Workflow, Operations, and Collaboration",
    stage: "Established",
    description:
      "Experience translating operational needs into technical solutions while supporting users, stakeholders, and time-sensitive workflows.",
    items: [
      "Workflow analysis",
      "Requirements gathering",
      "Stakeholder communication",
      "Operational problem-solving",
      "Technical support",
      "Process adherence",
      "Customer communication",
      "Cross-functional collaboration",
    ],
  },
  {
    title: "Healthcare Systems and Health Information",
    stage: "Developing",
    description:
      "Healthcare-domain knowledge currently being developed through formal undergraduate education and independent learning.",
    items: [
      "Health services management",
      "Health information management",
      "Healthcare systems",
      "Healthcare data concepts",
      "Documentation workflows",
      "Healthcare quality concepts",
    ],
  },
  {
    title: "Research and Analytical Methods",
    stage: "Developing",
    description:
      "Research and analytical methods currently being developed through coursework, independent inquiry, and planned educational projects.",
    items: [
      "Research methods",
      "Statistics",
      "Scientific literature evaluation",
      "Evidence synthesis",
      "Responsible data interpretation",
      "Python",
      "R",
    ],
  },
];

export const publicScholarship = {
  title: "The Informatics Diary",
  type: "Student-Led Public Learning Archive",
  href: "https://theinformaticsdiary.substack.com",
  description:
    "An independent writing and learning archive documenting my developing knowledge across women's health equity, health information, healthcare data, research literacy, clinical and biomedical informatics, and academic development.",
  practices: [
    "Distinguishing established evidence from interpretation",
    "Citing credible and relevant sources",
    "Documenting methodological and data limitations",
    "Communicating complex information in accessible language",
    "Representing developing knowledge and student status honestly",
  ],
  boundary:
    "Educational public scholarship only. It does not provide medical advice, diagnosis, individualized treatment guidance, or professional clinical authority.",
};

export const currentResearchDirection = {
  label: "Evolving Research Question",
  question:
    "How can clinical and biomedical informatics use longitudinal phenotyping to help shorten diagnostic delay in women's health?",
  context:
    "This question guides my developing interests in research methods, statistics, clinical data, phenotyping, health disparities, and biomedical informatics. It represents a future research direction rather than a completed study or formal finding.",
};

export const cvFutureSections = [
  "Research Experience",
  "Publications",
  "Presentations and Posters",
  "Academic Honors and Awards",
  "Professional Memberships",
  "Research Ethics and Human-Subjects Training",
  "Conferences and Invited Talks",
  "Teaching and Mentoring",
] as const;

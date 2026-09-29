import PageHeader from "@/src/components/shared/PageHeader";
import { ChipThinBorder } from "@/src/components/ui/Chips";
import { Card, EditorialCard, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";
import { PrimaryCTA, SecondaryCTA } from "@/src/components/ui/Buttons";
import { SectionLabel } from "@/src/components/projects/SectionLabel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",

  description:
    "Explore Ariela Israel's developing research interests in women's health equity, longitudinal health data, clinical phenotyping, diagnostic disparities, and clinical and biomedical informatics.",

  alternates: {
    canonical: "/research",
  },

  openGraph: {
    title: "Research | Ariela Israel",
    description:
      "Developing research interests connecting women's health equity, longitudinal health data, clinical phenotyping, diagnostic disparities, and biomedical informatics.",
    url: "/research",
  },
};

const researchTopics = [
  "Women's Health Equity",
  "Longitudinal Health Data",
  "Clinical Phenotyping",
  "Diagnostic Disparities",
  "Biomedical Informatics",
  "Precision Medicine",
];

const researchInterestAreas = [
  {
    title: "Women's Health Equity",
    description:
      "Studying disparities in recognition, diagnosis, treatment, research representation, and health outcomes across women's whole-body health.",
  },
  {
    title: "Longitudinal Health Data",
    description:
      "Exploring how information gathered across years of care may reveal patterns, changes, and missed opportunities that are difficult to see in isolated encounters.",
  },
  {
    title: "Clinical Phenotyping",
    description:
      "Learning how clinical information can be organized into meaningful representations of symptoms, conditions, disease patterns, and patient trajectories.",
  },
  {
    title: "Clinical & Biomedical Informatics",
    description:
      "Examining how health information, biomedical knowledge, computational methods, and technology can support research and better-informed care.",
  },
  {
    title: "Precision Medicine",
    description:
      "Exploring how clinical, biological, environmental, and other health information may contribute to more individualized approaches to prevention, diagnosis, and treatment.",
  },
  {
    title: "Equitable Clinical Intelligence",
    description:
      "Questioning how decision support, algorithms, and artificial intelligence can be developed and evaluated without reproducing disparities already present in healthcare and its data.",
  },
];

const developingFoundations = [
  {
    label: "Research Literacy",
    title: "Evaluating evidence carefully",
    description:
      "Developing skills in research design, scientific literature evaluation, evidence synthesis, source quality, transparent limitations, and distinguishing findings from interpretation.",
  },
  {
    label: "Quantitative Methods",
    title: "Learning how patterns are tested",
    description:
      "Building foundations in statistics, data analysis, measurement, analytical reasoning, and the responsible interpretation of quantitative health information.",
  },
  {
    label: "Health Information",
    title: "Understanding the record in context",
    description:
      "Studying health information management, documentation, data quality, healthcare workflows, and the organizational conditions that shape how information is created and used.",
  },
  {
    label: "Technical Systems",
    title: "Building on an established foundation",
    description:
      "Applying prior experience with software engineering, databases, structured data, APIs, accessibility, testing, documentation, and systems thinking to developing informatics questions.",
  },
];

const currentResearchActivity = [
  {
    label: "Formal Study",
    title: "Undergraduate healthcare and data education",
    description:
      "Pursuing a BS in Health Services Management at UMGC alongside certificates in Health Information Management & Data Analytics and Data Analytics.",
  },
  {
    label: "Independent Inquiry",
    title: "Building research literacy",
    description:
      "Reading across women's health equity, diagnostic disparities, longitudinal health information, clinical phenotyping, biomedical informatics, and precision medicine while learning how to evaluate evidence and document limitations.",
  },
  {
    label: "Public Learning Archive",
    title: "The Informatics Diary",
    description:
      "Documenting what I am studying, questioning, researching, and building while clearly distinguishing established evidence, interpretation, and developing knowledge.",
  },
  {
    label: "Applied Learning",
    title: "Planned educational projects",
    description:
      "Developing project concepts that use synthetic or appropriately sourced public data to explore health-record quality, longitudinal information, care gaps, and women's health equity.",
  },
];

export default function ResearchPage() {
  return (
    <main className="mx-auto w-full max-w-360 space-y-20 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Research"
        heading="Studying how health data can reveal what women's healthcare has missed"
        description={
          <>
            My developing research interests examine how clinical and biomedical data may help
            investigate disparities in women&apos;s health, improve clinical understanding, and
            support more precise and equitable care.
          </>
        }
        supportingText={
          <>
            I&apos;m particularly interested in longitudinal health data, clinical phenotyping,
            diagnostic disparities, precision medicine, and the representation of underserved and
            underrepresented women in healthcare data and research.
          </>
        }
      />

      <section aria-label="Research interest topics" className="-mt-12">
        <div className="flex flex-wrap gap-2">
          {researchTopics.map((topic) => (
            <ChipThinBorder key={topic}>{topic}</ChipThinBorder>
          ))}
        </div>
      </section>

      <section aria-labelledby="problem-space-heading">
        <SoftWashCard>
          <div className="grid gap-8 pb-4">
            <div className="max-w-5xl">
              <SectionLabel>The Problem Space</SectionLabel>

              <h2
                id="problem-space-heading"
                className="font-heading text-primary mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl"
              >
                Some disparities may be visible in the data long before they are recognized in care.
              </h2>
            </div>

            <div className="text-muted max-w-6xl space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                Women can move through healthcare systems for years before receiving an accurate
                diagnosis, appropriate treatment, or a complete explanation for their symptoms. For
                underserved and underrepresented women, these experiences may also intersect with
                racial disparities, fragmented care, research gaps, and insufficient representation
                in the evidence used to understand disease.
              </p>

              <p>
                This raises questions I want to learn how to investigate. What patterns accumulate
                across a patient&apos;s history before a diagnosis is made? Which symptoms,
                encounters, laboratory findings, diagnoses, referrals, and treatment decisions might
                become meaningful when examined longitudinally instead of one visit at a time? Are
                important patterns being documented but not connected?
              </p>

              <p className="text-foreground font-semibold">
                My research interests begin with the possibility that information distributed across
                years of care may contain patterns worth studying.
              </p>
            </div>
          </div>
        </SoftWashCard>
      </section>

      <section aria-labelledby="research-interests-heading" className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Research Interests</SectionLabel>

          <h2
            id="research-interests-heading"
            className="font-heading text-primary text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl"
          >
            Questions I want to learn how to answer
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            My interests connect women&apos;s health equity with the information, methods, and
            technologies used to understand health and disease. Together, these areas are shaping
            the questions I hope to investigate through continued study and future research.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchInterestAreas.map((interest) => (
            <article key={interest.title}>
              <Card>
                <h3 className="font-heading text-primary text-xl leading-tight font-semibold">
                  {interest.title}
                </h3>

                <p className="text-muted mt-4 text-sm leading-relaxed">{interest.description}</p>
              </Card>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="research-question-heading">
        <GlassCard>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel>An Evolving Research Question</SectionLabel>

              <h2
                id="research-question-heading"
                className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl"
              >
                How can clinical and biomedical informatics use longitudinal phenotyping to help
                shorten diagnostic delay in women&apos;s health?
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                This question represents an emerging area of interest rather than a completed
                research study. I&apos;m using it to guide what I learn about research methods,
                statistics, clinical data, phenotyping, health disparities, and biomedical
                informatics.
              </p>

              <div>
                <h3 className="text-foreground font-semibold">Why this question?</h3>

                <p className="mt-3">
                  Diagnostic delay can emerge across more than a single clinical encounter.
                  Symptoms, laboratory results, diagnoses, referrals, medications, treatments, and
                  patterns of care may accumulate across years of a patient&apos;s record.
                </p>
              </div>

              <p>
                I want to understand whether informatics methods can help researchers study those
                longitudinal patterns, how the patterns should be interpreted responsibly, and
                whether that work could contribute to earlier and more equitable recognition of
                disease in women.
              </p>

              <p className="text-subtle text-sm">
                This direction is educational and exploratory. It does not present clinical
                findings, diagnostic guidance, or medical advice.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      <section aria-labelledby="developing-foundations-heading" className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Developing Foundations</SectionLabel>

          <h2
            id="developing-foundations-heading"
            className="font-heading text-primary text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl"
          >
            Preparing to investigate the question responsibly
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            I&apos;m building the healthcare, research, analytical, and informatics foundations
            needed to approach this direction with appropriate care and methodological discipline.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {developingFoundations.map((foundation) => (
            <article key={foundation.label}>
              <Card>
                <SectionLabel>{foundation.label}</SectionLabel>

                <h3 className="font-heading text-primary mt-3 text-2xl leading-tight font-semibold">
                  {foundation.title}
                </h3>

                <p className="text-muted mt-4 text-sm leading-relaxed md:text-base">
                  {foundation.description}
                </p>
              </Card>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="current-activity-heading" className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Current Research &amp; Learning Activity</SectionLabel>

          <h2
            id="current-activity-heading"
            className="font-heading text-primary text-3xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl"
          >
            Where the learning is happening now
          </h2>

          <p className="text-muted text-base leading-relaxed md:text-lg">
            My current work brings together formal education, independent inquiry, public
            documentation, and planned applied projects as I prepare for future research.
          </p>
        </div>

        <EditorialCard>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {currentResearchActivity.map((activity) => (
              <article key={activity.label}>
                <SectionLabel>{activity.label}</SectionLabel>

                <h3 className="font-heading text-primary mt-3 text-2xl leading-tight font-semibold">
                  {activity.title}
                </h3>

                <p className="text-muted mt-4 text-sm leading-relaxed md:text-base">
                  {activity.description}
                </p>
              </article>
            ))}
          </div>
        </EditorialCard>
      </section>

      <section aria-labelledby="future-inquiry-heading">
        <SoftWashCard>
          <div className="grid gap-8 pb-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel>Future Inquiry</SectionLabel>

              <h2
                id="future-inquiry-heading"
                className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl"
              >
                Questions that may grow from this direction
              </h2>

              <p className="text-muted mt-5 text-base leading-relaxed md:text-lg">
                As my education and methods develop, I expect the central question to become
                narrower, more testable, and better grounded in specific clinical contexts and
                available evidence.
              </p>
            </div>

            <div>
              <ul className="divide-scholar-lilac divide-y">
                <li className="py-5 first:pt-0">
                  <p className="font-heading text-foreground text-xl leading-snug font-semibold">
                    What patterns tend to appear before delayed recognition or diagnosis?
                  </p>

                  <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                    Exploring whether symptoms, test results, referrals, treatments, and repeated
                    encounters form meaningful longitudinal patterns before a condition is
                    recognized.
                  </p>
                </li>

                <li className="py-5">
                  <p className="font-heading text-foreground text-xl leading-snug font-semibold">
                    What information is documented, missing, fragmented, or difficult to connect?
                  </p>

                  <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                    Considering how documentation practices, data quality, system boundaries, and
                    gaps in follow-up may affect what can be understood from a patient&apos;s
                    history.
                  </p>
                </li>

                <li className="py-5">
                  <p className="font-heading text-foreground text-xl leading-snug font-semibold">
                    Whose experiences are represented in the evidence?
                  </p>

                  <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                    Examining how research participation, dataset composition, measurement choices,
                    and clinical assumptions may affect racially underserved and underrepresented
                    women.
                  </p>
                </li>

                <li className="pt-5">
                  <p className="font-heading text-foreground text-xl leading-snug font-semibold">
                    How can informatics contribute without overstating what the data can tell us?
                  </p>

                  <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                    Studying how transparent methods, careful validation, clinical context, and
                    explicit limitations can support responsible interpretation and more equitable
                    applications.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </SoftWashCard>
      </section>

      <section
        aria-labelledby="continue-exploring-heading"
        className="border-default border-t pt-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionLabel>Continue Exploring</SectionLabel>

            <h2
              id="continue-exploring-heading"
              className="font-heading text-primary mt-3 text-3xl leading-tight font-bold tracking-tight md:text-4xl"
            >
              Follow the learning, questions, and projects behind the direction
            </h2>

            <p className="text-muted mt-4 text-base leading-relaxed md:text-lg">
              Read my developing reflections in The Informatics Diary, explore the technical and
              educational projects supporting this path, or connect with me about aligned academic,
              research, and professional opportunities.
            </p>
          </div>

          <div aria-label="Research page actions" className="flex flex-col gap-4">
            <PrimaryCTA link="/writing" label="Read My Writing" />
            <SecondaryCTA link="/projects" label="Explore Projects" />
            <SecondaryCTA link="/contact" label="Connect With Me" />
          </div>
        </div>
      </section>
    </main>
  );
}

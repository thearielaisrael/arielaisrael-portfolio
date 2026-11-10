import PageHeader from "@/src/components/shared/PageHeader";
import { ChipThinBorder } from "@/src/components/ui/Chips";
import { Card, EditorialCard, GlassCard, SoftWashCard } from "@/src/components/ui/Cards";
import { PrimaryCTA, SecondaryCTA } from "@/src/components/ui/Buttons";
import { SectionLabel } from "@/src/components/projects/SectionLabel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Direction",

  description:
    "Explore Ariela Israel's developing research direction in Black women's health equity, longitudinal clinical data, clinical phenotyping, diagnostic disparities, and biomedical informatics.",

  alternates: {
    canonical: "/research",
  },

  openGraph: {
    title: "Research Direction | Ariela Israel",
    description:
      "A developing research direction connecting Black women's health equity, longitudinal clinical data, disease recognition, clinical phenotyping, and biomedical informatics.",
    url: "/research",
  },
};

const researchTopics = [
  {
    key: "black-womens-health-equity",
    label: <>Black Women&apos;s Health Equity</>,
  },
  {
    key: "longitudinal-clinical-data",
    label: <>Longitudinal Clinical Data</>,
  },
  {
    key: "clinical-phenotyping",
    label: <>Clinical Phenotyping</>,
  },
  {
    key: "diagnostic-disparities",
    label: <>Diagnostic Disparities</>,
  },
  {
    key: "biomedical-informatics",
    label: <>Biomedical Informatics</>,
  },
  {
    key: "precision-medicine",
    label: <>Precision Medicine</>,
  },
];

const researchInterestAreas = [
  {
    key: "black-womens-health-equity",
    title: <>Black Women&apos;s Health Equity</>,
    description: (
      <>
        Investigating disparities in disease recognition, diagnosis, treatment, research
        representation, clinical response, and health outcomes across Black women&apos;s whole-body
        health.
      </>
    ),
  },
  {
    key: "longitudinal-clinical-data",
    title: <>Longitudinal Clinical Data</>,
    description: (
      <>
        Exploring how information gathered across years of care may reveal disease trajectories,
        changes, and missed opportunities that are difficult to see in isolated encounters.
      </>
    ),
  },
  {
    key: "clinical-phenotyping",
    title: <>Clinical Phenotyping</>,
    description: (
      <>
        Learning how clinical information can be organized into meaningful representations of
        symptoms, conditions, disease patterns, and patient trajectories.
      </>
    ),
  },
  {
    key: "clinical-biomedical-informatics",
    title: <>Clinical & Biomedical Informatics</>,
    description: (
      <>
        Examining how health information, biomedical knowledge, computational methods, and
        technology can support research, clinical understanding, and better-informed care.
      </>
    ),
  },
  {
    key: "precision-medicine",
    title: <>Precision Medicine</>,
    description: (
      <>
        Exploring how clinical, biological, environmental, and other health information may
        contribute to more individualized approaches to prevention, diagnosis, and treatment.
      </>
    ),
  },
  {
    key: "equitable-clinical-intelligence",
    title: <>Equitable Clinical Intelligence</>,
    description: (
      <>
        Questioning how decision support, algorithms, and artificial intelligence can be developed
        and evaluated without reproducing disparities already present in healthcare systems and
        their data.
      </>
    ),
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
    description: (
      <>
        Pursuing a BS in Health Services Management at UMGC, with certificate pathways in Health
        Information Management & Data Analytics and Data Analytics.
      </>
    ),
  },
  {
    label: "Independent Inquiry",
    title: "Building research literacy",
    description: (
      <>
        Reading across Black women&apos;s health equity, diagnostic disparities, longitudinal
        clinical information, clinical phenotyping, biomedical informatics, and precision medicine
        while learning to evaluate evidence and document limitations.
      </>
    ),
  },
  {
    label: "Public Learning Archive",
    title: "The Informatics Diary",
    description: (
      <>
        Documenting what I am studying, questioning, analyzing, and building while clearly
        distinguishing established evidence, interpretation, and developing knowledge.
      </>
    ),
  },
  {
    label: "Applied Learning",
    title: "Developing educational project concepts",
    description: (
      <>
        Planning projects that use synthetic or appropriately sourced public data to explore
        health-record quality, longitudinal information, care gaps, disease recognition, and Black
        women&apos;s health equity.
      </>
    ),
  },
];

export default function ResearchPage() {
  return (
    <main className="mx-auto w-full max-w-360 space-y-20 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Developing Research Direction"
        heading="Studying how health data can reveal what medicine has missed"
        description={
          <>
            My developing research interests examine how clinical and biomedical data could improve
            disease recognition, expose diagnostic disparities, and support more precise and
            equitable clinical responses for Black women.
          </>
        }
        supportingText={
          <>
            I&apos;m particularly interested in longitudinal clinical data, clinical phenotyping,
            diagnostic delay, precision medicine, data quality, and the representation of Black
            women in healthcare evidence and biomedical research.
          </>
        }
      />

      <section aria-label="Research interest topics" className="-mt-12">
        <div className="flex flex-wrap gap-2">
          {researchTopics.map((topic) => (
            <ChipThinBorder key={topic.key}>{topic.label}</ChipThinBorder>
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
                Black women can move through healthcare systems for years before receiving an
                accurate diagnosis, appropriate treatment, or a complete explanation for their
                symptoms. These experiences can intersect with racial disparities, fragmented care,
                incomplete clinical recognition, research gaps, and insufficient representation in
                the evidence used to understand disease.
              </p>

              <p>
                This raises questions I want to learn how to investigate. What patterns accumulate
                across a patient&apos;s history before a diagnosis is made? Which symptoms,
                encounters, laboratory findings, diagnoses, referrals, and treatment decisions might
                become meaningful when examined longitudinally instead of one visit at a time? What
                information is being documented but not connected?
              </p>

              <p className="text-foreground font-semibold">
                My research direction begins with the possibility that information distributed
                across years of care may contain patterns that could strengthen disease recognition
                and the evidence available about Black women&apos;s health.
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
            My interests connect Black women&apos;s whole-body health equity with the information,
            evidence, methods, and technologies used to understand health and disease. These areas
            are guiding what I study now and the questions I hope to investigate through future
            research.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchInterestAreas.map((interest) => (
            <article key={interest.key} className="h-full [&>div]:h-full">
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
                How can longitudinal clinical data and phenotyping improve disease recognition and
                shorten diagnostic delay for Black women?
              </h2>
            </div>

            <div className="text-muted space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                This question represents a developing research direction, not a completed study or a
                claim of established expertise. I&apos;m using it to guide what I learn about
                research methods, statistics, clinical data, health disparities, phenotyping, and
                biomedical informatics.
              </p>

              <div>
                <h3 className="text-foreground font-semibold">Why this question?</h3>

                <p className="mt-3">
                  Disease recognition does not depend on a single clinical encounter. Symptoms,
                  laboratory results, diagnoses, referrals, medications, treatments, and patterns of
                  healthcare use can accumulate across years of a patient&apos;s record.
                </p>
              </div>

              <p>
                I want to understand whether informatics methods can help researchers connect and
                responsibly interpret those longitudinal patterns, strengthen the evidence available
                about Black women&apos;s health, and support earlier and more equitable clinical
                recognition.
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
            My current development brings together formal education, independent inquiry, public
            documentation, and planned applied projects. These activities are helping me build the
            knowledge and methods required for future research rather than presenting work that has
            already reached that stage.
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
                As my education and methods develop, I expect this direction to become narrower,
                more testable, and better grounded in specific conditions, clinical contexts,
                populations, datasets, and available evidence.
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
                    How are Black women represented in the evidence and data?
                  </p>

                  <p className="text-muted mt-3 text-sm leading-relaxed md:text-base">
                    Examining how research participation, dataset composition, measurement choices,
                    missing information, and clinical assumptions influence what can be understood
                    about Black women&apos;s health.
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

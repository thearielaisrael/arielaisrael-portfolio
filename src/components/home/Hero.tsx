import type { ReactNode } from "react";

import { PrimaryCTA, SecondaryCTA } from "../ui/Buttons";
import { ChipThinBorder } from "../ui/Chips";
import { GlassCard } from "../ui/Cards";
import BackgroundFX from "./BackgroundFX";

const professionalStrengths = [
  {
    key: "black-womens-health-equity",
    label: <>Black Women&apos;s Health Equity</>,
  },
  {
    key: "biomedical-informatics",
    label: <>Biomedical Informatics</>,
  },
  {
    key: "clinical-informatics",
    label: <>Clinical Informatics</>,
  },
  {
    key: "health-data",
    label: <>Health Data</>,
  },
  {
    key: "precision-medicine",
    label: <>Precision Medicine</>,
  },
  {
    key: "longitudinal-data",
    label: <>Longitudinal Data</>,
  },
  {
    key: "research",
    label: <>Research</>,
  },
  {
    key: "clinical-phenotyping",
    label: <>Clinical Phenotyping</>,
  },
];

export default function Hero() {
  return (
    <section className="lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center">
      <BackgroundFX opacityClass="opacity-[0.14] dark:opacity-[0.18]" showParticles />

      <div className="relative z-10 w-full py-12 md:py-14 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="lg:col-span-7">
            <p className="text-accent mb-4 font-mono text-xs font-semibold tracking-[0.28em] uppercase md:text-sm">
              Health Services Management · Health Data · Informatics Research
            </p>

            <h1 className="font-heading text-primary max-w-4xl text-5xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance lowercase md:text-6xl lg:text-[clamp(3.75rem,4vw,5.5rem)]">
              Making Black women visible to the{" "}
              <span className="text-signature-text">evidence, data, and systems</span> shaping
              medicine
            </h1>

            <p className="text-foreground mt-5 max-w-3xl text-xl leading-snug font-semibold md:text-2xl lg:text-[1.65rem]">
              I&apos;m Ariela Israel, a Health Services Management student and former full-stack
              software developer building toward clinical and biomedical informatics research.
            </p>

            <div className="text-muted mt-6 max-w-3xl space-y-4 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m developing the health-services, research, data, and scientific foundation
                needed to study how medicine recognizes, diagnoses, treats, and responds to disease
                in Black women.
              </p>

              <p>
                My long-term interests include longitudinal clinical data, clinical phenotyping,
                diagnostic disparities, precision medicine, and health information systems that
                support more complete and equitable evidence.
              </p>
            </div>

            <p className="font-heading text-signature-text mt-6 text-2xl leading-[1.1] font-medium tracking-[0.08em] uppercase italic md:text-2xl">
              Pink, precise, evidence-driven, and patient-centered.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <PrimaryCTA link="/about" label="Explore My Direction" />

              <SecondaryCTA link="/projects" label="View My Work" />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <GlassCard>
              <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
                Current Direction
              </p>

              <div className="mt-5 space-y-5 lg:space-y-4">
                <SnapshotBlock
                  label="Academic Path"
                  body={
                    <>
                      Pursuing a BS in Health Services Management at UMGC, with certificate pathways
                      in Health Information Management and Data Analytics, plus Data Analytics.
                    </>
                  }
                />

                <SnapshotBlock
                  label="Health Equity Focus"
                  body={
                    <>
                      Building toward research focused on Black women&apos;s whole-body health,
                      including diagnostic delay, undertreatment, fragmented care, research gaps,
                      and incomplete clinical recognition.
                    </>
                  }
                />

                <SnapshotBlock
                  label="Research Direction"
                  body={
                    <>
                      Clinical and biomedical informatics, longitudinal health data, clinical
                      phenotyping, diagnostic disparities, precision medicine, and equitable
                      clinical intelligence.
                    </>
                  }
                />

                <SnapshotBlock
                  label="Developing Methods"
                  body={
                    <>
                      Research methods, statistics, scientific literature evaluation, health-data
                      analysis, and computational skills in R, Python, and SQL.
                    </>
                  }
                />

                <SnapshotBlock
                  label="Technical Foundation"
                  body={
                    <>
                      Software engineering, structured data, databases, systems thinking,
                      documentation, accessibility, testing, and digital product development.
                    </>
                  }
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {professionalStrengths.map((strength) => (
                  <ChipThinBorder key={strength.key}>{strength.label}</ChipThinBorder>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function SnapshotBlock({ label, body }: { label: string; body: ReactNode }) {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold tracking-wide">{label}</p>

      <p className="text-muted mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

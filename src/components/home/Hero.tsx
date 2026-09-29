import { PrimaryCTA, SecondaryCTA } from "../ui/Buttons";
import { ChipThinBorder } from "../ui/Chips";
import { GlassCard } from "../ui/Cards";
import BackgroundFX from "./BackgroundFX";

const professionalStrengths = [
  "Women's Health Equity",
  "Biomedical Informatics",
  "Clinical Informatics",
  "Health Data",
  "Precision Medicine",
  "Longitudinal Data",
  "Research",
  "Clinical Phenotyping",
];

export default function Hero() {
  return (
    <section className="lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center">
      <BackgroundFX opacityClass="opacity-[0.14] dark:opacity-[0.18]" showParticles />

      <div className="relative z-10 w-full py-12 md:py-14 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="lg:col-span-7">
            <p className="text-accent mb-4 font-mono text-xs font-semibold tracking-[0.28em] uppercase md:text-sm">
              Women&apos;s Health Equity · Biomedical Informatics · Research
            </p>

            <h1 className="font-heading text-primary max-w-4xl text-5xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance md:text-6xl lg:text-[clamp(3.75rem,4vw,5.5rem)]">
              Studying the data, evidence, and systems shaping{" "}
              <span className="text-signature-aura-pink">women&apos;s health</span>
            </h1>

            <p className="text-foreground mt-5 max-w-3xl text-xl leading-snug font-semibold md:text-2xl lg:text-[1.65rem]">
              I&apos;m Ariela Israel, a Health Services Management student, Women&apos;s Health
              Equity Advocate, and aspiring Clinical & Biomedical Informaticist.
            </p>

            <div className="text-muted mt-6 max-w-3xl space-y-4 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m building toward a research career at the intersection of women&apos;s
                health equity, clinical and biomedical informatics, health data, and precision
                medicine.
              </p>

              <p>
                I&apos;m especially interested in how longitudinal clinical and biomedical data can
                help investigate diagnostic disparities, improve clinical decision-making, and
                advance more equitable precision medicine for underserved and underrepresented
                women.
              </p>
            </div>

            <p className="font-heading text-signature-aura-pink mt-6 text-xl leading-[1.1] font-medium tracking-[0.08em] uppercase italic md:text-2xl">
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
                  body="Pursuing a BS in Health Services Management at UMGC, alongside certificates in Health Information Management & Data Analytics and Data Analytics."
                />

                <SnapshotBlock
                  label="Advocacy Focus"
                  body="Advancing more equitable health outcomes for underserved and underrepresented women, with particular interest in racial disparities, diagnostic delay, undertreatment, fragmented care, research gaps, and whole-body women's health."
                />

                <SnapshotBlock
                  label="Research Interest"
                  body="Clinical and biomedical informatics, longitudinal health data, diagnostic disparities, clinical phenotyping, precision medicine, clinical decision support, and equitable applications of AI in healthcare."
                />

                <SnapshotBlock
                  label="Developing Methods"
                  body="Research methods, statistics, scientific literature evaluation, health-data analysis, and computational skills in R, Python, and SQL."
                />

                <SnapshotBlock
                  label="Technical Foundation"
                  body="Software engineering, structured data, databases, systems thinking, documentation, accessibility, testing, and digital product development."
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {professionalStrengths.map((strength) => (
                  <ChipThinBorder key={strength}>{strength}</ChipThinBorder>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function SnapshotBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-foreground text-sm font-semibold tracking-wide">{label}</p>

      <p className="text-muted mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

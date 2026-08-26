import { PrimaryCTA, SecondaryCTA } from "../ui/Buttons";
import { ChipThinBorder } from "../ui/Chips";
import { GlassCard } from "../ui/Cards";
import BackgroundFX from "./BackgroundFX";

const professionalStrengths = [
  "Women's Health Equity",
  "Health Information",
  "Healthcare Data",
  "Informatics",
  "Research",
  "Data Quality",
  "Health Systems",
  "Accessibility",
];

export default function Hero() {
  return (
    <section className="lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center">
      <BackgroundFX opacityClass="opacity-[0.14] dark:opacity-[0.18]" showParticles />

      <div className="relative z-10 w-full py-12 md:py-14 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="lg:col-span-7">
            <p className="text-accent mb-4 font-mono text-xs font-semibold tracking-[0.28em] uppercase md:text-sm">
              Women&apos;s Health Equity · Informatics · Research
            </p>

            <h1 className="font-heading text-primary max-w-4xl text-5xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance md:text-6xl lg:text-[clamp(3.75rem,4vw,5.5rem)]">
              Studying the information, systems, and disparities shaping{" "}
              <span className="text-signature-aura-pink">women&apos;s health</span>
            </h1>

            <p className="text-foreground mt-5 max-w-3xl text-xl leading-snug font-semibold md:text-2xl lg:text-[1.65rem]">
              I’m Ariela Israel, a Health Services Management student building toward becoming a
              Women’s Health Equity Advocate & Informaticist.
            </p>

            <div className="text-muted mt-6 max-w-3xl space-y-4 text-base leading-relaxed md:text-lg">
              <p>
                My developing work connects women&apos;s health equity, health information,
                healthcare data, research, biomedical informatics, and patient-centered technology.
              </p>

              <p>
                I’m especially interested in racial disparities, delayed diagnosis, fragmented care,
                and the gaps that affect how racially underserved and underrepresented women&apos;s
                whole-body health is understood.
              </p>
            </div>

            <p className="font-heading text-accent mt-6 text-xl leading-[1.1] font-medium tracking-[0.08em] uppercase italic md:text-2xl">
              Pink, precise, and patient-centered.
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
                  body="Racial disparities, delayed diagnosis, undertreatment, fragmented care, research gaps, and whole-body women's health."
                />

                <SnapshotBlock
                  label="Developing Interest"
                  body="Health information, healthcare data, biomedical informatics, longitudinal health records, research, and precision medicine."
                />

                <SnapshotBlock
                  label="Professional Foundation"
                  body="Software development, structured data systems, databases, documentation, accessibility, quality assurance, and workflow analysis."
                />

                <SnapshotBlock
                  label="Long-Term Direction"
                  body="Building toward becoming a Women's Health Equity Advocate & Informaticist."
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

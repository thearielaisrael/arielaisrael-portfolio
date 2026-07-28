import { PrimaryCTA, SecondaryCTA } from "../ui/Buttons";
import { ChipThinBorder } from "../ui/Chips";
import { GlassCard } from "../ui/Cards";
import BackgroundFX from "./BackgroundFX";

const professionalStrengths = [
  "TypeScript",
  "React",
  "SQL",
  "PostgreSQL",
  "Structured Data",
  "Documentation",
  "Quality Assurance",
  "Workflow Analysis",
  "Accessibility",
  "Troubleshooting",
];

export default function Hero() {
  return (
    <section className="lg:flex lg:min-h-[calc(100svh-5rem)] lg:items-center">
      <BackgroundFX opacityClass="opacity-[0.14] dark:opacity-[0.18]" showParticles />

      <div className="relative z-10 w-full py-12 md:py-14 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="lg:col-span-7">
            <p className="text-accent mb-4 font-mono text-xs font-semibold tracking-[0.28em] uppercase md:text-sm">
              Software · Health Information · Informatics
            </p>

            <h1 className="font-heading text-primary max-w-4xl text-5xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance md:text-6xl lg:text-[clamp(3.75rem,5vw,5.5rem)]">
              Where software systems meet health information.
            </h1>

            <p className="text-foreground mt-5 max-w-3xl text-xl leading-snug font-semibold md:text-2xl lg:text-[1.65rem]">
              Software developer and Health Services Management student bringing a systems-and-data
              foundation into healthcare.
            </p>

            <div className="text-muted mt-6 max-w-3xl space-y-4 text-base leading-relaxed md:text-lg">
              <p>
                I&apos;m Ariela
                <span className="text-accent ml-2 align-top text-sm font-semibold tracking-wide opacity-85 md:text-base">
                  (ar-ree-el-la)
                </span>
                . My professional foundation includes structured data, SQL-backed systems,
                documentation, quality assurance, accessibility, troubleshooting, and operational
                workflows.
              </p>

              <p>
                My immediate focus is health information and medical records work where accuracy,
                organization, documentation, data quality, and reliable systems matter. Long term,
                I&apos;m building toward becoming a Women&apos;s Health Equity Advocate &amp;
                Informatician.
              </p>
            </div>

            <p className="font-heading text-accent mt-6 text-xl leading-[1.1] font-medium tracking-[0.08em] uppercase italic md:text-2xl">
              Pink, precise, and patient-centered.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <PrimaryCTA link="/about" label="My Background" />

              <SecondaryCTA link="/projects" label="View Projects" />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6">
            <GlassCard>
              <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
                Current Direction
              </p>

              <div className="mt-5 space-y-5 lg:space-y-4">
                <SnapshotBlock
                  label="Immediate Focus"
                  body="Health information, medical records, release of information, documentation and data workflows, healthcare operations, and related support roles."
                />

                <SnapshotBlock
                  label="Professional Foundation"
                  body="Software development, structured data systems, SQL and databases, documentation, testing, troubleshooting, accessibility, and production-system ownership."
                />

                <SnapshotBlock
                  label="Academic Path"
                  body="BS in Health Services Management at UMGC with certificate pathways in Health Information Management & Data Analytics and Data Analytics."
                />

                <SnapshotBlock
                  label="Long-Term Direction"
                  body="Becoming a Women's Health Equity Advocate & Informatician, connecting health information, data, research, digital health, and patient-centered technology."
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

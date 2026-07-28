interface PageHeaderProps {
  eyebrow: string;
  heading: string;
  description: React.ReactNode;
  supportingText?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader = ({
  eyebrow,
  heading,
  description,
  supportingText,
  actions,
}: PageHeaderProps) => {
  return (
    <section aria-labelledby="page-heading" className="relative isolate pt-20 md:pt-28">
      <div
        aria-hidden="true"
        className="data-grid pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-[0.28] dark:opacity-[0.36]"
      />

      <div className="max-w-5xl">
        <p className="text-accent font-mono text-xs font-semibold tracking-[0.24em] uppercase">
          {eyebrow}
        </p>

        <div className="mt-4">
          <h1
            id="page-heading"
            className="font-heading text-primary text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance md:text-7xl"
          >
            {heading}
          </h1>

          <div className="text-muted mt-7 max-w-3xl text-base leading-relaxed md:text-lg">
            {description}
          </div>

          {supportingText ? (
            <div className="text-subtle mt-4 max-w-3xl text-sm leading-relaxed md:text-base">
              {supportingText}
            </div>
          ) : null}

          {actions ? (
            <div aria-label="Page actions" className="mt-8 flex flex-wrap gap-4">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;

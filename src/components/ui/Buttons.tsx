import Link from "next/link";

interface ButtonProps {
  link: string;
  label: string;
  status?: "default" | "disabled";
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition duration-300 md:text-base";

export const PrimaryCTA = ({ link, label, status = "default" }: ButtonProps) => {
  if (status === "disabled") {
    return (
      <span
        aria-disabled="true"
        className={`${baseClasses} bg-cta text-cta-foreground opacity-disabled shadow-card cursor-not-allowed`}
      >
        Coming Soon
      </span>
    );
  }

  return (
    <Link
      href={link}
      className={`${baseClasses} ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop hover:-translate-y-0.5 hover:brightness-95`}
    >
      {label}
    </Link>
  );
};

export const SecondaryCTA = ({ link, label }: ButtonProps) => {
  return (
    <Link
      href={link}
      className={`${baseClasses} ring-brand border-default bg-surface/80 text-foreground shadow-card hover:border-strong hover:bg-surface-soft border backdrop-blur hover:-translate-y-0.5`}
    >
      {label}
    </Link>
  );
};

export const TertiaryCTA = ({ link, label }: ButtonProps) => {
  return (
    <Link
      href={link}
      className={`${baseClasses} ring-secondary border-tech-chip-border bg-tech-chip-bg text-secondary hover:bg-surface-aqua border hover:-translate-y-0.5`}
    >
      {label}
    </Link>
  );
};

export const PrimaryBtn = ({ link, label }: ButtonProps) => {
  return (
    <Link
      href={link}
      className="group text-link hover:text-accent inline-flex items-center gap-1 text-sm font-bold transition"
    >
      <span className="underline-offset-4 group-hover:underline">{label}</span>

      <span aria-hidden="true" className="transition group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
};

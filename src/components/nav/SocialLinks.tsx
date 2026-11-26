import { SocialIcon } from "@/data/navData";

interface SocialLinksProps {
  icons: SocialIcon[];
}

const SocialLinks = ({ icons }: SocialLinksProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {icons.map((social) => {
        const Icon = social.icon;

        return (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            title={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className="ring-brand border-default bg-surface text-subtle shadow-card hover:border-strong hover:bg-surface-soft hover:text-accent inline-flex h-9 w-9 items-center justify-center rounded-full border transition hover:-translate-y-0.5"
          >
            <Icon className="h-4 w-4 fill-current stroke-0" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;

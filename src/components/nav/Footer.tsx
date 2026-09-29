import Link from "next/link";

import { SocialIcons } from "../../data/navData";
import SocialLinks from "./SocialLinks";

const footerLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Research",
    href: "/research",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Writing",
    href: "/writing",
  },
  {
    label: "CV",
    href: "/cv",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Footer = () => {
  return (
    <footer className="border-default bg-surface-soft/45 border-t">
      <div className="mx-auto w-full max-w-360 px-6 py-10 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* TOP LEFT — Identity */}
          <div className="max-w-2xl space-y-5">
            <Link
              href="/"
              aria-label="Ariela Israel home"
              className="ring-brand text-accent hover:text-primary font-heading inline-flex rounded-lg py-1 text-2xl font-normal tracking-[0.24em] lowercase transition-colors md:text-3xl"
            >
              ariela israel
            </Link>

            <div className="space-y-3">
              <p className="text-foreground max-w-xl text-base leading-relaxed font-semibold">
                Health Services Management student, Women&apos;s Health Equity Advocate, and
                aspiring Clinical & Biomedical Informaticist.
              </p>

              <p className="text-muted max-w-xl text-sm leading-relaxed md:text-base">
                Building toward a research career at the intersection of women&apos;s health equity,
                clinical and biomedical informatics, health data, and precision medicine.
              </p>
            </div>
          </div>

          {/* TOP RIGHT — Navigation + Socials */}
          <div className="flex flex-col gap-6 lg:items-end lg:self-center">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-3 lg:justify-end">
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="ring-brand text-subtle hover:text-accent rounded-md py-1 font-mono text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <SocialLinks icons={SocialIcons} />
          </div>
        </div>

        {/* BOTTOM — Signature + Opportunity CTA */}
        <div className="border-default mt-10 flex flex-col gap-6 border-t pt-8 md:flex-row md:items-end md:justify-between">
          <p className="font-heading text-signature-aura-pink max-w-xl text-xl leading-[1.1] font-medium tracking-[0.08em] uppercase italic md:text-2xl">
            Pink, precise, evidence-driven, and patient-centered.
          </p>

          <Link
            href="/contact"
            className="ring-brand text-link hover:text-accent inline-flex max-w-md rounded-md text-sm font-bold transition-colors md:text-right"
          >
            Open to research, internship, collaborative, and aligned professional opportunities →
          </Link>
        </div>

        {/* COPYRIGHT */}
        <div className="border-default mt-8 border-t pt-5">
          <p className="text-subtle text-xs">© {new Date().getFullYear()} Ariela Israel</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

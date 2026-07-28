"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

import type { MenuItem, SocialIcon } from "../../data/navData";

import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

interface PrimaryNavProps {
  menuItems: MenuItem[];
  socialIcons: SocialIcon[];
}

const PrimaryNav = ({ menuItems, socialIcons }: PrimaryNavProps) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const isCurrentPage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="hidden items-center gap-6 lg:flex">
      <ul className="border-default bg-surface/70 shadow-card flex flex-row items-center gap-1 rounded-full border pb-1 backdrop-blur">
        {menuItems.map((item) => {
          const current = isCurrentPage(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`font-mono-brand relative isolate rounded-full px-4 py-2 text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition ${
                  current ? "text-cta-foreground" : "text-subtle hover:text-accent"
                }`}
              >
                {current ? (
                  <motion.span
                    layoutId="primary-navigation-active-pill"
                    aria-hidden="true"
                    className="bg-cta absolute inset-0 -z-10 rounded-full"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                            mass: 0.7,
                          }
                    }
                  />
                ) : null}

                <span className="relative z-10">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-4">
        <SocialLinks icons={socialIcons} />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default PrimaryNav;

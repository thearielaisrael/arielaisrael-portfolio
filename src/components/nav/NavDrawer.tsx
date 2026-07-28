"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import CloseIcon from "../../assets/icons/close.svg";

import { resumeHref } from "../../data/navData";
import type { MenuItem, SocialIcon } from "../../data/navData";

import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";

interface NavDrawerProps {
  menuItems: MenuItem[];
  socialIcons: SocialIcon[];
  onClose: () => void;
}

const NavDrawer = ({ menuItems, socialIcons, onClose }: NavDrawerProps) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const isCurrentPage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    closeButtonRef.current?.focus();

    const drawer = drawerRef.current;

    if (!drawer) {
      return;
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          [
            "a[href]",
            "button:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            '[tabindex]:not([tabindex="-1"])',
          ].join(","),
        ),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    drawer.addEventListener("keydown", handleTabKey);

    return () => {
      drawer.removeEventListener("keydown", handleTabKey);

      window.requestAnimationFrame(() => {
        openerRef.current?.focus();
      });
    };
  }, []);

  return (
    <motion.div
      ref={drawerRef}
      key="mobile-menu"
      className="bg-background text-foreground fixed inset-0 z-9999 h-screen w-screen overflow-y-auto lg:hidden"
      initial={reduceMotion ? { opacity: 0 } : { x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { x: "100%", opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
            }
      }
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div
        aria-hidden="true"
        className="bg-background/86 fixed inset-0 -z-10 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
      />

      <div
        aria-hidden="true"
        className="data-grid pointer-events-none absolute inset-0 opacity-[0.12]"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Ariela Israel home"
            onClick={onClose}
            className="ring-brand text-accent hover:text-primary font-heading inline-flex items-center rounded-lg py-1 text-xl font-normal tracking-[0.2em] lowercase transition-colors"
          >
            ariela israel
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="ring-brand border-default bg-surface text-foreground shadow-card hover:bg-surface-soft inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition"
            >
              <CloseIcon className="h-5 w-5 stroke-current" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-16">
          <p className="font-mono-brand text-accent mb-6 text-xs font-semibold tracking-[0.24em] uppercase">
            Navigation
          </p>

          <ul className="space-y-4">
            {menuItems.map((item) => {
              const current = isCurrentPage(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`group shadow-card hover:shadow-pop flex items-center justify-between rounded-3xl border px-5 py-4 backdrop-blur transition hover:-translate-y-0.5 ${
                      current
                        ? "bg-cta shadow-glow border-transparent"
                        : "border-default bg-card hover:border-strong hover:bg-surface-soft"
                    }`}
                    onClick={onClose}
                  >
                    <span
                      className={`font-heading tracking-light text-3xl leading-tight font-medium ${
                        current ? "text-cta-foreground" : "text-primary"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span className="flex items-center gap-3">
                      {current ? (
                        <span className="font-mono-brand text-cta-foreground text-[0.62rem] font-semibold tracking-[0.18em] uppercase opacity-80">
                          Current
                        </span>
                      ) : null}

                      <span
                        aria-hidden="true"
                        className={`transition group-hover:translate-x-1 ${
                          current ? "text-cta-foreground" : "text-accent"
                        }`}
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto pt-12">
          <div className="border-default bg-surface-soft/70 rounded-[2rem] border p-5">
            <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.24em] uppercase">
              Current Direction
            </p>

            <p className="text-foreground mt-4 text-base leading-relaxed font-semibold">
              Bringing a software, systems, and data foundation into health information and
              informatics.
            </p>

            <p className="text-muted mt-3 text-sm leading-relaxed">
              I&apos;m seeking hands-on healthcare experience in health information, medical
              records, documentation and data workflows, healthcare operations, and related support
              roles.
            </p>

            <p className="text-subtle mt-3 text-sm leading-relaxed">
              Long term, I&apos;m building toward becoming a Women&apos;s Health Equity Advocate
              &amp; Informatician.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="ring-brand border-default bg-surface text-foreground hover:border-strong hover:bg-surface-elevated inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-bold transition"
              >
                View Resume
              </a>

              <SocialLinks icons={socialIcons} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NavDrawer;

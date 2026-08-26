"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useForm, ValidationError } from "@formspree/react";

import SocialLinks from "@/src/components/nav/SocialLinks";
import { SectionLabel } from "@/src/components/projects/SectionLabel";
import PageHeader from "@/src/components/shared/PageHeader";
import { Card, GlassCard } from "@/src/components/ui/Cards";
import { ChipRegBorder } from "@/src/components/ui/Chips";
import { SocialIcons } from "@/src/data/navData";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("xwvrbwvq");

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 md:px-10">
      <PageHeader
        eyebrow="Contact"
        heading="Let's connect about health information, research, and women's health equity"
        description="I'm currently open to professional opportunities in health information, medical records, documentation and data workflows, healthcare operations, healthcare data support, and related roles."
        supportingText="I also welcome thoughtful conversations across informatics, research, patient education, digital health, and the racial disparities affecting women's whole-body healthcare."
      />

      <section aria-labelledby="contact-form-heading" className="mt-16 md:mt-20">
        <div className="mx-auto grid w-full gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <GlassCard>
              <div>
                <SectionLabel>Open To</SectionLabel>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ChipRegBorder>Health Information</ChipRegBorder>

                  <ChipRegBorder>Medical Records</ChipRegBorder>

                  <ChipRegBorder>Healthcare Operations</ChipRegBorder>

                  <ChipRegBorder>Healthcare Data Support</ChipRegBorder>

                  <ChipRegBorder>Health Technology</ChipRegBorder>

                  <ChipRegBorder>Research Conversations</ChipRegBorder>

                  <ChipRegBorder>Women&apos;s Health Equity</ChipRegBorder>
                </div>
              </div>

              <div className="border-default mt-6 border-t pt-6">
                <SectionLabel>Academic + Professional Direction</SectionLabel>

                <p className="text-muted mt-3 text-sm leading-relaxed">
                  I&apos;m a Health Services Management student pursuing certificate pathways in
                  Health Information Management &amp; Data Analytics and Data Analytics.
                </p>

                <p className="text-muted mt-4 text-sm leading-relaxed">
                  I bring a professional foundation in software systems, structured data,
                  documentation, quality assurance, accessibility, and workflow analysis. Long term,
                  I&apos;m building toward becoming a Women&apos;s Health Equity Advocate &amp;
                  Informaticist.
                </p>
              </div>

              <div className="border-default mt-6 border-t pt-6">
                <SectionLabel>Elsewhere</SectionLabel>

                <div className="mt-4">
                  <SocialLinks icons={SocialIcons} />
                </div>
              </div>
            </GlassCard>
          </aside>

          <div className="lg:col-span-8">
            <Card>
              {state.succeeded ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  aria-live="polite"
                >
                  <p className="font-mono-brand text-accent text-xs font-semibold tracking-[0.24em] uppercase">
                    Message Sent
                  </p>

                  <h2 className="font-heading text-primary mt-3 text-3xl leading-tight font-bold">
                    Thank you for reaching out
                  </h2>

                  <p className="text-muted mt-4 max-w-md text-sm leading-relaxed">
                    Your message was submitted successfully. I&apos;ll review it and respond as soon
                    as I can.
                  </p>

                  <Link
                    href="/experience"
                    className="ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-95"
                  >
                    View Experience
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <SectionLabel>Inquiry Form</SectionLabel>

                    <h2
                      id="contact-form-heading"
                      className="font-heading text-primary mt-3 text-3xl leading-tight font-bold"
                    >
                      Send a message
                    </h2>

                    <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
                      For employment outreach, please include the position, organization, work
                      arrangement, and any relevant details.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Name" htmlFor="name">
                      <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        className={inputClasses}
                        placeholder="Your name"
                      />

                      <ValidationError prefix="Name" field="name" errors={state.errors} />
                    </Field>

                    <Field label="Email" htmlFor="email">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className={inputClasses}
                        placeholder="you@example.com"
                      />

                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </Field>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field
                      label={
                        <>
                          Organization <span className="text-subtle font-normal">(optional)</span>
                        </>
                      }
                      htmlFor="organization"
                    >
                      <input
                        type="text"
                        name="organization"
                        id="organization"
                        autoComplete="organization"
                        className={inputClasses}
                        placeholder="Company, team, or organization"
                      />

                      <ValidationError
                        prefix="Organization"
                        field="organization"
                        errors={state.errors}
                      />
                    </Field>

                    <Field label="Reason for Contact" htmlFor="reason">
                      <div className="relative">
                        <select
                          required
                          name="reason"
                          id="reason"
                          className={inputClasses}
                          defaultValue=""
                          style={{
                            appearance: "none",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            backgroundImage: "none",
                          }}
                        >
                          <option value="" disabled>
                            Select a reason
                          </option>

                          <option value="employment">Employment Opportunity</option>

                          <option value="health-information">
                            Health Information or Medical Records
                          </option>

                          <option value="healthcare-operations">Healthcare Operations</option>

                          <option value="health-data-informatics">
                            Healthcare Data or Informatics
                          </option>

                          <option value="research">Research Conversation</option>

                          <option value="health-technology">Health Technology</option>

                          <option value="advocacy">Women&apos;s Health Equity Advocacy</option>

                          <option value="collaboration">Collaboration</option>

                          <option value="other">Other</option>
                        </select>

                        <span
                          aria-hidden="true"
                          className="text-subtle pointer-events-none absolute top-1/2 right-5 -translate-y-1/2"
                        >
                          ▾
                        </span>
                      </div>

                      <ValidationError prefix="Reason" field="reason" errors={state.errors} />
                    </Field>
                  </div>

                  <Field label="Message" htmlFor="message">
                    <textarea
                      required
                      name="message"
                      id="message"
                      rows={8}
                      className={`${inputClasses} min-h-44 py-3`}
                      placeholder="Tell me about the opportunity, project, or reason for reaching out."
                    />

                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </Field>

                  <div className="border-default flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                    <p className="text-subtle max-w-lg text-sm leading-relaxed">
                      Please do not include private health information or other sensitive personal
                      information.
                    </p>

                    <button
                      type="submit"
                      disabled={state.submitting}
                      className={`${
                        state.submitting
                          ? "bg-cta text-cta-foreground opacity-disabled cursor-not-allowed"
                          : "ring-brand bg-cta text-cta-foreground shadow-card hover:shadow-pop hover:-translate-y-0.5 hover:brightness-95"
                      } inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition md:text-base`}
                    >
                      {state.submitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

const inputClasses =
  "ring-brand border-default bg-surface/80 text-foreground placeholder:text-subtle h-12 w-full rounded-2xl border px-4 text-sm outline-none transition focus:border-strong focus:bg-surface";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={htmlFor} className="text-foreground text-sm font-bold">
        {label}
      </label>

      <div className="mt-2">{children}</div>
    </div>
  );
}

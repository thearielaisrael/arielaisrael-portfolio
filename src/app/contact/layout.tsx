import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",

  description:
    "Contact Ariela Israel about professional opportunities in application and systems support, data quality, health information, healthcare data, operations, research support, and related work.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    title: "Contact | Ariela Israel",
    description:
      "Connect with Ariela Israel about systems, data quality, health information, healthcare operations, research support, women's health equity, and aligned professional opportunities.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}

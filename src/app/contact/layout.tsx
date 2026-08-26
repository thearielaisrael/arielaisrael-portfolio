import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",

  description:
    "Contact Ariela Israel about professional opportunities and relevant conversations across health information, medical records, healthcare data, informatics, research, and women's health equity.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    title: "Contact | Ariela Israel",
    description:
      "Connect with Ariela Israel about health information, healthcare data, research, informatics, women's health equity, and related professional opportunities.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}

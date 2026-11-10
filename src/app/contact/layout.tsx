import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",

  description:
    "Contact Ariela Israel about opportunities in health information, research support, health IT, data quality, healthcare operations, application support, and aligned professional work.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    title: "Contact | Ariela Israel",
    description:
      "Connect with Ariela Israel about health information, research support, health IT, data quality, healthcare operations, Black women's health equity, and aligned opportunities.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}

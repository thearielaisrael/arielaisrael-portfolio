import type { Metadata, Viewport } from "next";
import { Geist_Mono, Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

import Footer from "../components/nav/Footer";
import Header from "../components/nav/Header";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = "https://www.thearielaisrael.com";

const siteTitle = "Ariela Israel | Health Information & Biomedical Informatics";

const siteDescription =
  "Health Services Management student and former software developer building toward clinical and biomedical informatics research focused on health equity for Black women.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ariela Israel",
  url: siteUrl,
  description:
    "Health Services Management student and former full-stack software developer building toward clinical and biomedical informatics research focused on Black women's health equity.",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Maryland Global Campus",
    url: "https://www.umgc.edu",
  },
  sameAs: [
    "https://github.com/thearielaisrael",
    "https://linkedin.com/in/ariela-israel",
    "https://theinformaticsdiary.substack.com",
    "https://youtube.com/@thearielaisrael",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s | Ariela Israel",
  },

  description: siteDescription,

  applicationName: "Ariela Israel",

  alternates: {
    canonical: "/",
  },

  authors: [
    {
      name: "Ariela Israel",
      url: siteUrl,
    },
  ],

  creator: "Ariela Israel",
  publisher: "Ariela Israel",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ariela Israel",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ariela Israel, Health Services Management student and former software developer building toward clinical and biomedical informatics research",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#FFF7FA",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#160D1A",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia(
                  "(prefers-color-scheme: dark)"
                ).matches;

                if (
                  storedTheme === "dark" ||
                  (!storedTheme && prefersDark)
                ) {
                  document.documentElement.classList.add("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>

      <body
        className={`${plusJakartaSans.variable} ${nunitoSans.variable} ${geistMono.variable} bg-background text-foreground overflow-x-hidden overflow-y-scroll antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <a
          href="#main-content"
          className="ring-brand bg-cta text-cta-foreground sr-only z-10000 rounded-full px-5 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to main content
        </a>

        <Header />

        <div id="main-content" tabIndex={-1} className="scroll-mt-24">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}

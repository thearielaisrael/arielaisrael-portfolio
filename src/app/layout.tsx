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

const siteUrl = "https://thearielaisrael.com";

const siteTitle = "Ariela Israel | Health Information, Data & Women’s Health Equity";

const siteDescription =
  "Health Services Management student studying health information and data analytics, with a professional systems background and a long-term focus on women’s health equity and informatics.";

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

  keywords: [
    "Ariela Israel",
    "health information",
    "healthcare data",
    "health informatics",
    "biomedical informatics",
    "health information management",
    "health services management",
    "data analytics",
    "women's health equity",
    "women's health equity advocate",
    "informaticist",
    "racial disparities in healthcare",
    "delayed diagnosis",
    "whole-body women's health",
    "precision medicine",
    "healthcare systems",
    "patient-centered technology",
    "structured data",
    "information systems",
  ],

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
  },

  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
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
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}

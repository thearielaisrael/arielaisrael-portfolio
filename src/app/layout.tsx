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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arielainstem.com"),

  title: {
    default: "Ariela Israel | Software, Health Information & Informatics",
    template: "%s | Ariela Israel",
  },

  description:
    "Software developer and Health Services Management student transitioning into health information, healthcare data, and informatics while building toward becoming a Women's Health Equity Advocate & Informatician.",

  applicationName: "Ariela Israel",

  alternates: {
    canonical: "/",
  },

  authors: [
    {
      name: "Ariela Israel",
      url: "https://www.arielainstem.com",
    },
  ],

  creator: "Ariela Israel",
  publisher: "Ariela Israel",

  keywords: [
    "Ariela Israel",
    "health information",
    "medical records",
    "release of information",
    "healthcare data",
    "health informatics",
    "health services management",
    "software developer",
    "structured data",
    "health technology",
    "digital health",
    "women's health equity",
    "women's health equity advocate",
    "informatician",
    "healthcare operations",
    "healthcare documentation",
    "data quality",
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
    title: "Ariela Israel | Software, Health Information & Informatics",
    description:
      "Software developer and Health Services Management student bringing a systems-and-data foundation into healthcare and building toward becoming a Women's Health Equity Advocate & Informatician.",
    url: "https://www.arielainstem.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ariela Israel | Software, Health Information & Informatics",
    description:
      "Software developer and Health Services Management student bringing a systems-and-data foundation into healthcare and building toward becoming a Women's Health Equity Advocate & Informatician.",
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
                const storedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia(
                  '(prefers-color-scheme: dark)'
                ).matches;

                if (
                  storedTheme === 'dark' ||
                  (!storedTheme && prefersDark)
                ) {
                  document.documentElement.classList.add('dark');
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

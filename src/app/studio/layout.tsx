import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import StudioPwaRuntime from "@/components/studio/pwa/StudioPwaRuntime";

import "@/components/studio/pwa/StudioPwa.css";

export const metadata: Metadata = {
  title: {
    default: "Social Design Studio",
    template: "%s | Social Design Studio",
  },

  applicationName: "Social Design Studio",

  description: "Your private creative workspace for designing beautiful social media content.",

  manifest: "/studio-assets/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/studio-assets/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/studio-assets/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/studio-assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "Social Studio",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },

  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",

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

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <>
      <StudioPwaRuntime />
      {children}
    </>
  );
}

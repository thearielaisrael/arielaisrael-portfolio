import type { MetadataRoute } from "next";

const siteUrl = "https://thearielaisrael.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tokens"],
    },

    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

import type { MetadataRoute } from "next";

import { caseStudies } from "@/src/data/caseStudyData";

const siteUrl = "https://www.thearielaisrael.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const primaryRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/research`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cv`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/writing`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const publishedCaseStudies: MetadataRoute.Sitemap = caseStudies
    .filter((caseStudy) => caseStudy.status !== "Planned")
    .map((caseStudy) => ({
      url: `${siteUrl}/projects/${caseStudy.slug}`,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  return [...primaryRoutes, ...publishedCaseStudies];
}

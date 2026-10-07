import type { MetadataRoute } from "next";

const siteUrl = "https://prahalab.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/demo`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}

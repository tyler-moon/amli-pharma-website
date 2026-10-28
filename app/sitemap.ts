import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pharma.amli.group/",
      lastModified: new Date("2026-10-29"),
      changeFrequency: "monthly",
      priority: 1
    },
    ...["uz", "ru"].map((locale) => ({
      url: `https://pharma.amli.group/store/${locale}/`,
      lastModified: new Date("2026-10-29"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: { uz: "https://pharma.amli.group/store/uz/", ru: "https://pharma.amli.group/store/ru/" } }
    }))
  ];
}

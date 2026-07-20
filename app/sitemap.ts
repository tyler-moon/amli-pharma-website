import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pharma.amli.group/",
      lastModified: new Date("2026-07-20"),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}

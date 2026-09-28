import type { MetadataRoute } from "next";
import { FRAGMENTS, SHOT } from "@/data/site";
import { abs, PAGE_SEO } from "@/lib/seo";

/**
 * The pages worth indexing, each with the photographs it actually shows.
 *
 * The `images` entries make this an image sitemap, which is how Google Images
 * learns which product photographs belong to which page. Every one of them has
 * descriptive alt text on the page itself (SHOT_ALT, FRAGMENTS.alt).
 *
 * The policy pages are left out on purpose: they are noindex, and a sitemap
 * that lists pages it also asks to be skipped sends crawlers mixed signals.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const img = (...paths: string[]) => paths.map((p) => abs(p));
  return [
    {
      url: abs("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      images: img(SHOT.hero, SHOT.case, SHOT.blindSpot, ...FRAGMENTS.map((f) => f.src), PAGE_SEO.home.image.url),
    },
    {
      url: abs("/system"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      images: img(SHOT.system, PAGE_SEO.system.image.url),
    },
    {
      url: abs("/models"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      images: img(SHOT.models["z-active"], SHOT.models["z-pure"], PAGE_SEO.models.image.url),
    },
    {
      url: abs("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: img(PAGE_SEO.faq.image.url),
    },
    {
      url: abs("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      images: img(SHOT.reserve, PAGE_SEO.about.image.url),
    },
  ];
}

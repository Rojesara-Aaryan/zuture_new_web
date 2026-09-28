import type { MetadataRoute } from "next";
import { abs, SITE_URL } from "@/lib/seo";

/**
 * Open to every crawler, including the AI ones, by name.
 *
 * Plenty of sites block GPTBot, ClaudeBot and the rest. For a product nobody
 * has heard of yet that is the wrong way round: being read, summarised and
 * cited by answer engines is reach. Naming them makes the intent explicit
 * rather than leaving it to the wildcard. Only the form endpoint is closed.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: "/api/" },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}

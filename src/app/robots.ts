import type { MetadataRoute } from "next";
import { abs, SITE_URL } from "@/lib/seo";

/**
 * Open to every crawler, including the AI ones, by name.
 *
 * Plenty of sites block GPTBot, ClaudeBot and the rest. For a product nobody
 * has heard of yet that is the wrong way round: being read, summarised and
 * cited by answer engines is reach. Naming them makes the intent explicit
 * rather than leaving it to the wildcard.
 */
const AI_CRAWLERS = [
  // OpenAI: training, search index, and fetches made while answering
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / AI Overviews, Apple Intelligence
  "Google-Extended",
  "Applebot-Extended",
  // Meta AI, Amazon (Alexa, Rufus), DuckDuckGo, Mistral, Cohere
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
  // Common Crawl, which many models are trained on
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}

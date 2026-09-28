/**
 * Search, answer-engine and generative-engine optimisation, in one place.
 *
 * Three audiences read this site besides people:
 *   SEO — classic crawlers ranking pages for queries
 *   AEO — answer engines lifting one clean answer to a question
 *   GEO — generative engines (ChatGPT, Gemini, Perplexity, Claude) that read,
 *         summarise and cite; also geographic targeting, since this is an
 *         Indian product sold first in India
 *
 * The rule for all three is the same one the page copy follows: nothing here
 * may claim more than the site already stands behind. Zuture is a prototype.
 * There is no price, no certification, no measured airflow or CADR, no rating
 * and no review, so none of that appears in structured data either — a
 * fabricated aggregateRating is exactly what gets a site penalised, and an
 * answer engine quoting a made-up figure is worse than one quoting nothing.
 */
import type { Metadata } from "next";
import { BRAND, CONTACT, MODELS, PLATFORM, SHOT, SHOT_ALT } from "@/data/site";

/**
 * Where the site actually lives.
 *
 * Set NEXT_PUBLIC_SITE_URL once the domain is final (e.g. https://zuture.co).
 * Until then Vercel's production hostname is used, so canonical URLs, the
 * sitemap and Open Graph images always point at the deployment that serves
 * them rather than at a domain that is still running the old site.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const abs = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

/**
 * The search vocabulary.
 *
 * Grouped by what someone is actually trying to do. People in India search
 * "air purifier" far more than "air treatment system", so the category word
 * is paired with the terms buyers already use — framed honestly as a
 * comparison, never as a claim that Zuture is merely a purifier.
 */
export const KEYWORDS = [
  // The category Zuture is defining, and the one India now searches for
  "intelligent air treatment system",
  "fresh air purifier",
  "fresh air purifier India",
  "smart ventilation system for home",
  // What buyers type today
  "air purifier for home India",
  "best air purifier for home India",
  "air purifier that reduces CO2",
  "air purifier vs ventilation",
  "HEPA H13 air purifier",
  "washable filter air purifier",
  "wall mounted air purifier",
  // Problems people search about
  "indoor air quality",
  "indoor CO2 levels",
  "reduce CO2 at home",
  "indoor air pollution India",
  "AQI indoor vs outdoor",
  "VOC removal",
  // Technology and alternatives
  "demand controlled ventilation",
  "electrostatic precipitator air purifier",
  "ERV vs fresh air system",
  "air quality monitor CO2 PM2.5",
  // Brand, place, provenance
  "Zuture",
  "Z-ACTIVE",
  "Z-PURE",
  "made in India air purifier",
  "Ahmedabad",
];

/** The one-sentence definition, reused verbatim so every engine learns one phrasing. */
export const DEFINITION =
  "Zuture is an intelligent air treatment system — a fresh air purifier and smart ventilation system in one wall-mounted unit. It filters the air in a room, replaces stale air with filtered fresh outdoor air to lower CO2, conditions it, and decides for itself which the room needs by comparing indoor and outdoor air in real time.";

/**
 * Other names for the same thing. People reach this product through words the
 * brand does not use for itself; listing them in llms.txt and structured data
 * lets search and AI engines connect those queries to Zuture. Each is accurate:
 * Zuture does purify, does ventilate, and does monitor the air.
 */
export const ALSO_KNOWN_AS = [
  "fresh air purifier",
  "air purifier with fresh air ventilation",
  "smart ventilation system for home",
  "demand-controlled ventilation unit",
  "wall-mounted air purifier",
  "indoor and outdoor air quality monitor",
];

const logo = abs("/brand/logo-colour.png");
const orgId = abs("/#organization");
const siteId = abs("/#website");

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: "Zuture",
  legalName: BRAND.legal,
  url: SITE_URL,
  logo,
  image: logo,
  description: DEFINITION,
  slogan: "We change the air.",
  foundingDate: BRAND.founded,
  foundingLocation: { "@type": "Place", name: BRAND.city },
  founders: [
    { "@type": "Person", name: "Abhishek Joshi", jobTitle: "Chief Executive Officer" },
    { "@type": "Person", name: "Nirali Joshi", jobTitle: "Chief Technology Officer" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "203 Zion Z1, Near Avalon Hotel, Sindhubhavan Marg",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380054",
    addressCountry: "IN",
  },
  areaServed: { "@type": "Country", name: "India" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: CONTACT.email,
      telephone: "+91-99989-37170",
      areaServed: "IN",
      availableLanguage: ["English"],
    },
  ],
  sameAs: CONTACT.social.map((s) => s.href),
  knowsAbout: [
    "Indoor air quality",
    "Air purification",
    "Fresh air purification",
    "Indoor CO2 reduction",
    "Home ventilation",
    "Demand-controlled ventilation",
    "HEPA filtration",
    "Electrostatic precipitation",
    "Carbon dioxide monitoring",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": siteId,
  name: "Zuture",
  url: SITE_URL,
  inLanguage: "en-IN",
  description: DEFINITION,
  publisher: { "@id": orgId },
};

/**
 * One Product per edition. No offers, price or rating: none exist yet, and
 * inventing them would be both untrue and a structured-data policy violation.
 */
export const productsLd = MODELS.map((m) => {
  const name = m.name.replace(/‑/g, "-");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`/models#${m.id}`),
    name: `Zuture ${name}`,
    alternateName: `${name} ${m.edition}`,
    description: `${m.line} ${m.body}`,
    category: "Fresh air purifier and smart ventilation system",
    image: { "@type": "ImageObject", url: abs(SHOT.models[m.id]), caption: SHOT_ALT.models[m.id] },
    brand: { "@type": "Brand", name: "Zuture" },
    manufacturer: { "@id": orgId },
    countryOfOrigin: { "@type": "Country", name: "India" },
    additionalProperty: [
      ...m.facts.map(([k, v]) => ({ "@type": "PropertyValue", name: k, value: v })),
      { "@type": "PropertyValue", name: "Filtration stages", value: m.stack.join(" → ") },
      ...PLATFORM.map(([k, v, note]) => ({
        "@type": "PropertyValue",
        name: k,
        value: `${v}. ${note}.`,
      })),
      {
        "@type": "PropertyValue",
        name: "Development status",
        value: "Prototype. Performance figures will be published once measured.",
      },
    ],
    isRelatedTo: { "@id": abs(`/models#${m.id === "z-active" ? "z-pure" : "z-active"}`) },
  };
});

export const breadcrumbLd = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

export const faqLd = (items: readonly { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

/**
 * The share image (public/og.png, 1200×630, rendered by .tools/og.mjs).
 *
 * Declared explicitly rather than through app/opengraph-image.png. Next merges
 * metadata shallowly, so a page that sets its own openGraph — which every page
 * here must, for its canonical URL — replaces the layout's openGraph wholesale,
 * file-based image included. Built that way, no page shipped an og:image at
 * all and every link preview would have been blank.
 */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Zuture: We change the air. India's 1st intelligent air treatment system, launching soon.",
};

/**
 * Every indexable page's search and sharing metadata, in one table.
 *
 * Titles stay under ~60 characters with the template's " | Zuture" added, and
 * descriptions under ~160, so neither is cut off in results. Keywords are the
 * handful of phrases each page genuinely answers — `<meta name="keywords">` is
 * ignored by Google but still read by Bing, Yandex and a number of AI crawlers,
 * so it is kept short and specific rather than stuffed. Each page has its own
 * share image (public/og/*.png, rendered by .tools/og.mjs), so a link to /faq
 * previews as the FAQ rather than as the home page.
 */
export type PageSeo = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  image: { url: string; alt: string };
  absoluteTitle?: boolean;
};

const BRAND_TERMS = ["Zuture", "fresh air purifier", "intelligent air treatment system", "made in India"];

export const PAGE_SEO = {
  home: {
    title: "Zuture — Fresh Air Purifier & Smart Ventilation, India",
    description:
      "India's 1st intelligent air treatment system: a fresh air purifier and smart ventilation system in one wall-mounted unit that lowers CO2. Launching soon.",
    path: "/",
    absoluteTitle: true,
    keywords: [
      ...BRAND_TERMS,
      "fresh air purifier India",
      "smart ventilation system for home",
      "air purifier that reduces CO2",
      "best air purifier for home India",
      "wall mounted air purifier",
      "indoor air quality",
    ],
    image: {
      url: "/og/home.png",
      alt: "Zuture: We change the air. India's 1st intelligent air treatment system, launching soon.",
    },
  },
  system: {
    title: "How It Works — Fresh Air, Filtration and CO2 Control",
    description:
      "How Zuture works: HEPA or ESP filtration, filtered fresh-air ventilation that lowers CO2, dew-point checks and a patented indoor-vs-outdoor decision.",
    path: "/system",
    keywords: [
      ...BRAND_TERMS,
      "how a fresh air purifier works",
      "demand controlled ventilation",
      "air purifier vs ventilation",
      "reduce CO2 at home",
      "positive pressure ventilation",
      "HEPA vs ESP",
    ],
    image: {
      url: "/og/system.png",
      alt: "Not a purifier. Zuture filters, brings in fresh air, conditions it and decides, in one wall-mounted unit.",
    },
  },
  models: {
    title: "Z-ACTIVE & Z-PURE — ESP and H13 HEPA Air Purifiers",
    description:
      "Two fresh air purifiers on one platform. Z-ACTIVE: electrostatic, washable, no filters to buy. Z-PURE: H13 HEPA with activated carbon for VOCs and odours.",
    path: "/models",
    keywords: [
      ...BRAND_TERMS,
      "Z-ACTIVE",
      "Z-PURE",
      "H13 HEPA air purifier",
      "washable filter air purifier",
      "electrostatic precipitator air purifier",
      "activated carbon VOC filter",
    ],
    image: {
      url: "/og/models.png",
      alt: "Zuture Z-ACTIVE and Z-PURE: one platform, electrostatic or H13 HEPA filtration.",
    },
  },
  faq: {
    title: "FAQ — Air Purifiers, Fresh Air, CO2 and HEPA",
    description:
      "Can an air purifier reduce CO2? Fresh air purifier or ERV? H13 or H11 HEPA? Straight answers on indoor air quality, installation and Zuture.",
    path: "/faq",
    keywords: [
      ...BRAND_TERMS,
      "can an air purifier reduce CO2",
      "fresh air purifier vs air purifier",
      "ERV vs fresh air system",
      "H13 vs H11 HEPA",
      "what is CADR",
      "indoor CO2 level",
    ],
    image: {
      url: "/og/faq.png",
      alt: "Zuture FAQ: indoor air, CO2, HEPA and how an intelligent air treatment system works.",
    },
  },
  about: {
    title: "About — Air Purification Company from Ahmedabad",
    description:
      "Zuture Enterprise Pvt Ltd, founded 2021 in Ahmedabad, builds patented fresh air purification technology in India. Reserve a Z-ACTIVE or Z-PURE, free.",
    path: "/about",
    keywords: [
      ...BRAND_TERMS,
      "Zuture Enterprise Pvt Ltd",
      "air purifier company India",
      "Ahmedabad air quality company",
      "patented ventilation technology",
      "reserve Zuture",
    ],
    image: {
      url: "/og/about.png",
      alt: "Zuture, built in Ahmedabad: patented indoor air technology, made in India.",
    },
  },
} satisfies Record<string, PageSeo>;

/**
 * Next merges metadata shallowly: a page that sets openGraph replaces the
 * layout's whole openGraph, image included, and a canonical set in the root
 * would be inherited by every page. So each page sets all of it, explicitly.
 */
export function pageMeta(p: PageSeo): Metadata {
  const image = { ...p.image, width: 1200, height: 630, type: "image/png" };
  return {
    title: p.absoluteTitle ? { absolute: p.title } : p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: {
      canonical: p.path,
      // One language and one market; x-default says it is also the fallback.
      languages: { "en-IN": p.path, "x-default": p.path },
    },
    openGraph: {
      type: "website",
      siteName: "Zuture",
      locale: "en_IN",
      url: p.path,
      title: p.title,
      description: p.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ZutureCO",
      creator: "@ZutureCO",
      title: p.title,
      description: p.description,
      images: [image],
    },
  };
}

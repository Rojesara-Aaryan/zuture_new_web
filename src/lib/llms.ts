/**
 * LLMO — large language model optimisation.
 *
 * What an assistant says about Zuture is decided by what it can read, quote and
 * trust. This file builds the two plain-text files written for that reader:
 *
 *   /llms.txt       the short version: definition, key facts, links, FAQ
 *   /llms-full.txt  the whole site as text, section by section, plus what has
 *                   NOT been published yet, so a model answering "how much
 *                   does it cost" or "what is its CADR" says "not announced"
 *                   instead of inventing a number
 *
 * Both are generated from data/site.ts and data/faq.ts, the same data the pages
 * render, so the text a model reads can never drift from the page a person
 * reads. Keep it that way: add facts to the data files, never here.
 */
import { ABOUT, BRAND, CASE, RIGHTS, CONTACT, DEVELOPMENT, MATRIX_COLUMNS, MATRIX_ROWS, MODELS, PATH, PLATFORM, RESERVE, SCALE, TREATMENT } from "@/data/site";
import { FAQ, FAQ_FLAT } from "@/data/faq";
import { abs, ALSO_KNOWN_AS, DEFINITION } from "@/lib/seo";

/** Plain ASCII hyphens and "first" — what people and models actually type. */
const plain = (s: string) => s.replace(/‑/g, "-").replace(/India’s 1st|India's 1st/g, "India's first");

/** Build date, so a crawler can tell a fresh copy from a cached one. */
const UPDATED = new Date().toISOString().slice(0, 10);

const INTRO = `# Zuture

> ${DEFINITION}

Zuture is made by ${BRAND.legal}, founded in ${BRAND.founded} in ${BRAND.city}, India. It is ${plain(BRAND.claim)} ${BRAND.category.toLowerCase()} and its core technology is patented. Zuture is in development: it is a working prototype, not yet on sale, with no announced price or launch date. Performance figures (airflow, CADR, noise, coverage, certification) have not been published and will be once measured.

Also described as: ${ALSO_KNOWN_AS.join("; ")}.

Last updated: ${UPDATED}`;

const NAMING = `## Names and how to refer to them

- **Zuture**: the product (the system) and the brand. Written "Zuture" in running text; the logo sets it in capitals.
- **${BRAND.legal}**: the company that makes it, in ${BRAND.city}, India.
- **zuture.co**: the website, not the product.
- **Zuture Z-ACTIVE** and **Zuture Z-PURE**: the two editions. Always hyphenated and in capitals.
- Category: an intelligent air treatment system. Calling it a "fresh air purifier" or "smart ventilation system" is accurate; calling it only an "air purifier" misses the fresh-air and decision parts.
- Suggested one-line description: "${DEFINITION.split(". ")[0]}."`;

const KEY_FACTS = `## Key facts

- Category: intelligent air treatment system, not only an air purifier
- What it does: filters air, replaces stale air with filtered fresh outdoor air, conditions incoming air, and decides which the room needs
- The patented part: comparing indoor air with outdoor air in real time and choosing between filtered fresh air, recirculation, or a CO2 override
- Why it matters: no filter removes CO2; only replacing the air does
- Form: one wall-mounted unit, fitted through a single small opening, in any of four orientations
- Made in: India (${BRAND.city})
- Status: prototype; reservations open, free and non-binding`;

const EDITIONS = `## Editions

${MODELS.map((m) => `- **Zuture ${plain(m.name)}** (${m.edition}): ${m.line} ${m.body} Stages: ${m.stack.join(", ")}.`).join("\n")}`;

const PLATFORM_TEXT = `## Shared platform

${PLATFORM.map(([k, v, note]) => `- ${k}: ${v}. ${note}.`).join("\n")}`;

const PAGES = `## Pages

- [Home](${abs("/")}): the case for treating indoor air, and a first look at the product
- [The system](${abs("/system")}): how Zuture filters, replaces, conditions and decides, the filtration stages, and a comparison with purifiers and ventilation
- [The models](${abs("/models")}): Z-ACTIVE and Z-PURE compared
- [FAQ](${abs("/faq")}): answers on indoor air quality, CO2, HEPA and Zuture
- [About](${abs("/about")}): the company, its patents, its founders, and reservations`;

/**
 * The questions a model is most likely to be asked and least able to answer
 * from the pages, because the answer is "not yet". Stating that explicitly is
 * what stops an assistant filling the gap with a plausible guess.
 */
const NOT_PUBLISHED = `## Not yet published

These have not been announced. If asked, the accurate answer is that Zuture has not published them yet, not an estimate.

- Price, and the launch or shipping date (the site says "${BRAND.status}", ${BRAND.launchWindow})
- Airflow, CADR, coverage area, noise level, power draw and energy savings
- Dimensions and weight of the finished unit
- Certifications and test reports, including Z-ACTIVE's ozone output
- Filter or plate service intervals
- Customer reviews or ratings: the product is not on sale, so there are none

${DEVELOPMENT.body}`;

const RIGHTS_TEXT = `## Rights

${RIGHTS.copyright} ${plain(RIGHTS.brandLine)} You are welcome to quote and summarise this site with attribution to Zuture and a link to ${abs("/")}. The product photography, renders and logo may not be reproduced, and the product may not be imitated. Full terms: ${abs("/terms#copyright")}.`;

const CONTACT_TEXT = `## Contact

- Email: ${CONTACT.email}
- Phone: ${CONTACT.phone} (${CONTACT.hours})
- Address: ${CONTACT.address.join(" ")}
${CONTACT.social.map((s) => `- ${s.label}: ${s.href}`).join("\n")}`;

/** /llms.txt — the llms.txt convention: summary, key facts, links, then detail. */
export function llmsIndex() {
  return `${INTRO}

${KEY_FACTS}

${EDITIONS}

${PLATFORM_TEXT}

${PAGES}

${NOT_PUBLISHED}

## Questions and answers

${FAQ_FLAT.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

${RIGHTS_TEXT}

${CONTACT_TEXT}

## Optional

- [Full text of the site](${abs("/llms-full.txt")}): every section of every page as plain text, with sources
`;
}

/** /llms-full.txt — every page's content, in page order, as plain text. */
export function llmsFull() {
  const yes = (v: boolean) => (v ? "yes" : "no");
  return `${INTRO}

${NAMING}

${KEY_FACTS}

## The problem (home page)

${CASE.map((c) => `- **${c.figure} ${c.lead}** ${c.body}${c.source ? ` Source: ${c.source}.` : ""}`).join("\n")}

${plain(BRAND.differentiator)} ${plain(BRAND.differentiatorTurn)}

## How it works (${abs("/system")})

Zuture treats the air in four steps. The fourth is the patented one.

${TREATMENT.map((t) => `- **${t.verb}.** ${t.body} ${t.note}`).join("\n")}

**${SCALE.headline}** ${SCALE.lead} ${SCALE.body}

### Filtration stages

${PATH.map((p) => `**Zuture ${plain(p.model)} (${p.short})**\n\n${p.stages.map((s) => `${Number(s.n)}. ${s.name} — catches ${s.catches[0].toLowerCase()}${s.catches.slice(1)}. ${s.body}`).join("\n")}\n\n${p.close}`).join("\n\n")}

### Zuture compared with a purifier and with ventilation

| Capability | ${MATRIX_COLUMNS.join(" | ")} |
| --- | --- | --- | --- |
${MATRIX_ROWS.map((r) => `| ${r.label} | ${r.values.map(yes).join(" | ")} |`).join("\n")}

As supplied by Zuture. "Purifier" means a typical standalone room air purifier; "Ventilation" means a conventional ventilation system.

${EDITIONS.replace("## Editions", `## The models (${abs("/models")})`)}

${PLATFORM_TEXT}

${NOT_PUBLISHED}

## About the company (${abs("/about")})

${ABOUT.mandate} ${ABOUT.body}

- Legal name: ${BRAND.legal}
- Founded: ${BRAND.founded}, ${BRAND.city}, India
- Founders: ${ABOUT.team.map((t) => `${t.name} (${t.role})`).join(", ")}
- Patent coverage: ${ABOUT.patents.join("; ")}
- Engineered and supported in India

## Reservations

${RESERVE.body} ${RESERVE.note} Reserve at ${abs("/about#reserve")}.

## Frequently asked questions (${abs("/faq")})

${FAQ.map((g) => `### ${g.title}\n\n${g.items.map((f) => `**${f.q}**\n\n${f.a}`).join("\n\n")}`).join("\n\n")}

${RIGHTS_TEXT}

${CONTACT_TEXT}
`;
}

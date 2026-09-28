import { BRAND, CONTACT, MODELS, PLATFORM } from "@/data/site";
import { FAQ_FLAT } from "@/data/faq";
import { abs, ALSO_KNOWN_AS, DEFINITION } from "@/lib/seo";

/**
 * /llms.txt — the site, summarised for language models.
 *
 * Follows the llms.txt convention: a title, a one-line summary, then linked
 * sections. Generative engines that fetch this get the facts in the form they
 * quote — short declarative sentences — without parsing a page built for
 * animation. Every line is generated from the same data the pages render, so
 * the two cannot drift apart.
 */
export const dynamic = "force-static";

export function GET() {
  const name = (s: string) => s.replace(/\u2011/g, "-");
  const body = `# Zuture

> ${DEFINITION}

Zuture is made by ${BRAND.legal}, founded in ${BRAND.founded} in ${BRAND.city}, India. It is ${BRAND.claim.replace("1st", "first")} ${BRAND.category.toLowerCase()} and its core technology is patented. Zuture is in development: it is a working prototype, not yet on sale, with no announced price or launch date. Performance figures (airflow, CADR, noise, coverage, certification) have not been published and will be once measured.

Also described as: ${ALSO_KNOWN_AS.join("; ")}.

## Key facts

- Category: intelligent air treatment system, not only an air purifier
- What it does: filters air, replaces stale air with filtered fresh outdoor air, conditions incoming air, and decides which the room needs
- The patented part: comparing indoor air with outdoor air in real time and choosing between filtered fresh air, recirculation, or a CO2 override
- Why it matters: no filter removes CO2; only replacing the air does
- Form: one wall-mounted unit, fitted through a single small opening, in any of four orientations
- Made in: India (${BRAND.city})
- Status: prototype; reservations open, free and non-binding

## Editions

${MODELS.map((m) => `- **Zuture ${name(m.name)}** (${m.edition}): ${m.line} ${m.body} Stages: ${m.stack.join(", ")}.`).join("\n")}

## Shared platform

${PLATFORM.map(([k, v, note]) => `- ${k}: ${v}. ${note}.`).join("\n")}

## Pages

- [Home](${abs("/")}): the case for treating indoor air, and a first look at the product
- [The system](${abs("/system")}): how Zuture filters, replaces, conditions and decides, the filtration stages, and a comparison with purifiers and ventilation
- [The models](${abs("/models")}): Z-ACTIVE and Z-PURE compared
- [FAQ](${abs("/faq")}): answers on indoor air quality, CO2, HEPA and Zuture
- [About](${abs("/about")}): the company, its patents, its founders, and reservations

## Questions and answers

${FAQ_FLAT.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Contact

- Email: ${CONTACT.email}
- Phone: ${CONTACT.phone}
- Address: ${CONTACT.address.join(" ")}
${CONTACT.social.map((s) => `- ${s.label}: ${s.href}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

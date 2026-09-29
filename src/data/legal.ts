/**
 * Policies for the pre-launch site.
 *
 * These are scoped to what THIS site actually does: it shows information and
 * takes reservation enquiries. It has no app, no account, no device, and no
 * sensor data. The live policies at zuture.co cover those and should replace
 * these once the product ships.
 *
 * Anything a lawyer must fill in is marked TODO in `OPEN_ITEMS` below and
 * rendered on the page rather than quietly guessed at.
 */

import { RIGHTS } from "@/data/site";

export const LEGAL_META = {
  /* Confirmed by Zuture, 24 Sep 2026. Note that zuture.co/terms and
     zuture.co/privacy still say "Zuture Technologies Pvt. Ltd." — those are
     wrong and need correcting on the live site too. */
  entity: "Zuture Enterprise Pvt Ltd",
  /* "Zuture" is the device, "zuture.co" is the site, and the company is the
     entity above. The Definitions clause exists so the documents never blur
     the three. */
  product: "Zuture",
  site: "zuture.co",
  jurisdiction: "Ahmedabad, Gujarat",
  effective: "29 September 2026",
  email: "info@zuture.co",
  phone: "+91 99989 37170",
  address: "203 Zion Z1, Near Avalon Hotel, Sindhubhavan Marg, Ahmedabad 380054",
  /* Required now: Rule 5(9) of the IT (Reasonable Security Practices and
     Sensitive Personal Data or Information) Rules, 2011 says the Grievance
     Officer's NAME and contact details must be published on the site.
     Named by Zuture, 29 Sep 2026. */
  grievanceOfficer: { name: "Nirali Joshi", designation: "Chief Technology Officer" },
} as const;

/** Withdrawing consent must be as easy as giving it (DPDP Act, s. 6(4)): one tap, no form. */
export const WITHDRAW_MAILTO = `mailto:${LEGAL_META.email}?subject=${encodeURIComponent("Withdraw my reservation and consent")}`;

const officer = LEGAL_META.grievanceOfficer.name
  ? `${LEGAL_META.grievanceOfficer.name}, ${LEGAL_META.grievanceOfficer.designation}`
  : "the Grievance Officer";

export type Section = { heading: string; id?: string; paras?: string[]; list?: string[] };

export const TERMS: { title: string; intro: string; sections: Section[] } = {
  title: "Terms & Conditions",
  intro:
    "These terms govern your use of this website. Zuture is not yet on sale, so they are deliberately narrow: they cover browsing this site and placing a reservation enquiry, and nothing else. Separate terms will apply to the purchase, ownership and use of a Zuture device.",
  sections: [
    {
      heading: "1. Definitions and parties",
      paras: ["In these terms:"],
      list: [
        `"the Company", "we" or "us" means ${LEGAL_META.entity}, a company incorporated in India with its registered office at ${LEGAL_META.address}.`,
        `"${LEGAL_META.product}" means the intelligent air treatment system developed by the Company, including the Z‑ACTIVE and Z‑PURE editions.`,
        `"this site" means ${LEGAL_META.site} and any of its subdomains.`,
        '"you" means any person who visits this site or submits a reservation enquiry through it.',
      ],
    },
    {
      heading: "2. Accepting these terms",
      paras: [
        "By using this site you agree to these terms. If you do not agree, please stop using the site.",
      ],
    },
    {
      heading: "3. The product is in development",
      paras: [
        "Zuture is a pre-production system. Everything described on this site reflects our current design intent and is subject to change without notice.",
      ],
      list: [
        "No performance figure on this site is a measured or certified result. Airflow, coverage, noise, dimensions, efficiency and certification are still being validated.",
        "Product names, specifications, filtration stages, materials, appearance and availability may change before launch, or may not be released at all.",
        "Images on this site are of prototype units and renders. Production hardware may differ.",
        "Nothing on this site is an offer to sell, a contract, or a guarantee that any product will be made available.",
      ],
    },
    {
      heading: "4. Reservations",
      paras: ["A reservation is an expression of interest. It is not a purchase and it is not binding on either of us."],
      list: [
        "No payment is taken at the point of reservation, and we will never ask for card or bank details on this site.",
        "A reservation does not reserve stock, fix a price, or guarantee a delivery date.",
        "We may decline, cancel or limit reservations at our discretion, including where a territory is not yet served.",
        "You may withdraw your reservation at any time by emailing " + LEGAL_META.email + ".",
        "Any pricing, lead time or specification we send you later is indicative until confirmed in a written order.",
        "Because nothing is paid, there is nothing to refund or return. Before anything is sold, we will publish return, refund, cancellation and warranty terms, and those will apply to the sale.",
      ],
    },
    {
      heading: "5. Who may use this site",
      paras: [
        "You must be at least 18 years old to submit a reservation. This site is intended for users in India; we make no representation that it is appropriate elsewhere.",
      ],
    },
    {
      heading: "6. Acceptable use",
      paras: ["You agree not to:"],
      list: [
        "Copy, download, scrape, mirror or republish any part of this site, including its images, renders, text, layout or code, except as section 7 allows. Search engines and AI assistants may index and quote the site as our robots.txt permits.",
        "Use automated systems to access the site in a way that burdens our infrastructure.",
        "Attempt to gain unauthorised access to any part of the site or its underlying systems.",
        "Reverse-engineer, or attempt to derive, any aspect of our designs, technology or methods from material published here.",
        "Submit false information, or another person's details, through any form on this site.",
      ],
    },
    {
      heading: "7. Copyright and intellectual property",
      id: "copyright",
      paras: [
        `${RIGHTS.copyright} All content on this site — including its text, photographs, renders, graphics, page design, the Zuture name and logo, and the underlying code — is owned by ${LEGAL_META.entity} or its licensors.`,
      ],
      list: [
        "Copyright. The text, photographs, renders, graphics, layout and code of this site are original works protected by the Copyright Act, 1957, and, through the Berne Convention, in other member countries. Protection is automatic and does not depend on registration.",
        `Names and logo. ${RIGHTS.brandLine} The logo artwork is protected by copyright, and the names by the law of passing off. They may not be used, copied or imitated — including in a domain name, social media handle, product, packaging or advertisement — without our written permission, or in any way likely to confuse people about who made a product.`,
        "The product. The appearance, design, engineering and technology of the Zuture system, including the Z‑ACTIVE and Z‑PURE editions, are the Company’s proprietary work. Our patent coverage includes demand-controlled ventilation architecture, intelligent air-intake decision logic, and system-level thermal comfort optimisation. Nothing published here grants any licence to copy, manufacture, reverse-engineer or imitate the product or any part of it.",
        "What you may do. You may view this site and share links to it. Short quotations for review, reporting or commentary, with clear attribution to Zuture, are fair dealing under section 52 of the Copyright Act and are welcome.",
        "What you may not do. Anything else — including downloading, copying, reproducing, redistributing or altering the product photography, renders, logo or text, or using them to create imitations, including with AI tools — needs our prior written permission.",
        "Enforcement. We act on infringement. Unauthorised use may lead to civil proceedings for an injunction, damages or an account of profits, and delivery-up of infringing material (Copyright Act, 1957, section 55), including in an action for passing off. Copyright infringement can also be a criminal offence (Copyright Act, section 63), and copying data from a computer system without permission can attract compensation under section 43 of the Information Technology Act, 2000.",
        `Reporting misuse. If you see our content, name, logo or product copied or imitated, tell us at ${LEGAL_META.email} with the subject line "IP notice".`,
      ],
    },
    {
      heading: "8. No warranty",
      paras: [
        "This site is provided on an “as is” and “as available” basis. To the fullest extent permitted by law we exclude all warranties, express or implied, including as to accuracy, completeness, fitness for a particular purpose and non-infringement.",
        "The air quality information on this site is general educational material drawn from published sources. It is not medical, environmental or engineering advice and must not be relied on as such.",
      ],
    },
    {
      heading: "9. Limitation of liability",
      paras: [
        "To the fullest extent permitted by law, Zuture shall not be liable for any indirect, incidental, special or consequential loss arising from your use of this site, or from reliance on any information published on it.",
        "Nothing in these terms limits liability that cannot be limited under Indian law, including liability for fraud or for death or personal injury caused by negligence.",
      ],
    },
    {
      heading: "10. Changes",
      paras: [
        "We may update these terms as the product moves toward launch. The effective date at the top of this page will change when we do. Continuing to use the site after an update means you accept the revised terms.",
      ],
    },
    {
      heading: "11. Governing law and disputes",
      paras: [
        `These terms are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. The courts at ${LEGAL_META.jurisdiction} shall have exclusive jurisdiction over any dispute arising out of or relating to them.`,
        "Before starting any legal proceedings, both parties agree to attempt to resolve the dispute through good-faith negotiation for a period of 30 days.",
      ],
    },
    {
      heading: "12. Contact",
      paras: [
        `Questions about these terms: ${LEGAL_META.email} or ${LEGAL_META.phone}. Post: ${LEGAL_META.address}.`,
      ],
    },
  ],
};

export const PRIVACY: { title: string; intro: string; sections: Section[] } = {
  title: "Privacy Policy",
  intro:
    "This policy explains what we do with personal data collected through this website. This site has no account system, no app and no connected device, so the only personal data we hold is what you type into the reservation form. A fuller policy will cover the device and app when they launch.",
  sections: [
    {
      heading: "1. Who is responsible for your data",
      paras: [
        `${LEGAL_META.entity} ("the Company") is the data fiduciary for personal data collected through ${LEGAL_META.site}, under the Digital Personal Data Protection Act, 2023. ${LEGAL_META.product} is the Company’s air treatment system; this policy concerns the website only.`,
        `Registered office: ${LEGAL_META.address}. Email: ${LEGAL_META.email}. Phone: ${LEGAL_META.phone}.`,
      ],
    },
    {
      heading: "2. What we collect",
      paras: [
        "Only what you give us, and a small amount of technical data needed to serve the site.",
        "You do not have to give us anything. The reservation form needs only your name and email address; phone, room size and space type are optional. If you would rather not use the form at all, you can simply email or call us.",
      ],
      list: [
        "Reservation form: your name, email address, phone number, the room size and space type you enter, and which model you select.",
        "Anything you choose to write to us directly by email or phone.",
        "Standard server information your browser sends when requesting pages, such as IP address and user agent, used to serve the site and protect it from abuse.",
        "Anonymous visit statistics: which pages are viewed, the referring site, country, and device, operating system and browser type. Our hosting provider (Vercel) counts these without cookies and without identifying you, so we can see how the site is used.",
      ],
    },
    {
      heading: "3. What we do not collect",
      list: [
        "We take no payment details on this site, at any point.",
        "We do not run advertising on this site, and nothing here tracks you across other sites.",
        "We do not collect air quality data here. The figures shown on this site are published research, not readings from your home.",
        "We do not buy personal data from third parties.",
      ],
    },
    {
      heading: "4. Why we use it, and on what basis",
      paras: [
        "We process your reservation details on the basis of your consent, given when you submit the form, for one purpose: to contact you about your reservation and about the launch of the product you asked about.",
        "We will not use your details for unrelated marketing, and we will not add you to a general mailing list.",
      ],
    },
    {
      heading: "5. Who else sees it",
      paras: [
        "We do not sell personal data, and we do not share it for anyone else's marketing.",
      ],
      list: [
        "Service providers act as processors on our instructions and may not use your data for their own purposes: Vercel Inc. hosts this site and counts anonymous visits, and EmailJS delivers the reservation form to our inbox. Their servers may be outside India, so your data may be processed there.",
        "We may disclose data where required by law, court order or a lawful request from a public authority.",
      ],
    },
    {
      heading: "6. How long we keep it",
      paras: [
        "Reservation details are kept until the product launches and your enquiry is resolved, and for up to 24 months after that for our records. We will delete them sooner if you ask.",
      ],
    },
    {
      heading: "7. Security",
      paras: [
        "The site is served over HTTPS and access to reservation data is limited to the people who need it. No system is perfectly secure; if a breach affects your personal data we will notify you and the Data Protection Board of India as required by law.",
      ],
    },
    {
      heading: "8. Your rights",
      paras: ["Under the Digital Personal Data Protection Act, 2023 you may:"],
      list: [
        "Ask what personal data we hold about you and how it is processed.",
        "Ask us to correct or complete inaccurate data.",
        "Ask us to erase your data.",
        "Withdraw your consent at any time, which will end our processing from that point.",
        "Nominate another person to exercise these rights on your behalf.",
        "Complain to our grievance officer, and escalate to the Data Protection Board of India if you are not satisfied.",
      ],
    },
    {
      heading: "9. Making a request",
      paras: [
        `Email ${LEGAL_META.email} with the subject line "Data request". We will acknowledge within 48 hours and aim to resolve within 30 days.`,
        `To withdraw your consent, email ${LEGAL_META.email} with the subject line "Withdraw my reservation and consent", or simply reply to any email from us saying so. No reason is needed. We will stop using your details and delete them, unless the law requires us to keep them, and confirm to you when it is done. Withdrawing does not affect anything we did with your consent before that.`,
      ],
    },
    {
      heading: "10. Children",
      paras: [
        "This site is not directed at anyone under 18 and we do not knowingly collect their personal data. If you believe a child has submitted details to us, contact us and we will delete them.",
      ],
    },
    {
      heading: "11. Cookies",
      paras: [
        "This site sets no cookies. Visit statistics are counted without them. It uses your browser's session storage for one thing only — to remember that you have already seen the intro animation — and that never leaves your device.",
      ],
    },
    {
      heading: "12. Changes",
      paras: [
        "We will update this policy as the product develops, and the effective date above will change when we do.",
      ],
    },
    {
      heading: "13. Governing law",
      paras: [
        `This policy is governed by the laws of India, including the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and, as its provisions come into force, the Digital Personal Data Protection Act, 2023 and the rules made under it. The courts at ${LEGAL_META.jurisdiction} shall have exclusive jurisdiction.`,
      ],
    },
    {
      heading: "14. Grievance officer",
      paras: [
        `Complaints about how we handle personal data go to ${officer}, at ${LEGAL_META.email} (subject line "Grievance") or by post to ${LEGAL_META.address}.`,
        "We will acknowledge a grievance within 48 hours and resolve it within one month of receiving it.",
      ],
    },
  ],
};

/** Shown on both pages. Better an honest gap than a confident guess. */
/**
 * Rendered on both policy pages.
 *
 * Note for the team, deliberately NOT listed here because it would be a poor
 * thing to publish: the live zuture.co Terms and Privacy Policy still name
 * "Zuture Technologies Pvt. Ltd.". The registered entity is
 * "Zuture Enterprise Pvt Ltd" — correct it there too.
 */
/* Emptied on Zuture's instruction, 29 Sep 2026, which hides the box. Counsel
   review of both documents is still recommended (see README). Add a line
   here to bring the box back. */
export const OPEN_ITEMS: string[] = [];

/**
 * All copy lives here, not in components.
 *
 * Every figure below is taken from Zuture's own product reference
 * (see zuture_info_web/src/knowledge/zuture.knowledge.js). Nothing is invented.
 */

export const BRAND = {
  name: "ZUTURE",
  legal: "Zuture Enterprise Pvt Ltd",
  claim: "India's 1st",
  patent: "Patented Technology",
  category: "Intelligent Air Treatment System",
  categoryShort: "Air Treatment System",
  status: "Launching soon",
  /* Set a real date here to switch the hero over to a countdown. */
  launchWindow: "2026",
  founded: "2021",
  city: "Ahmedabad, Gujarat",
  thesis:
    "A system that smartly decides whether to introduce fresh air or recirculate, based on real-time atmospheric data.",
  /* Zuture's own stated differentiator, quoted verbatim. */
  differentiator:
    "No one literally compares indoor air to outdoor air and chooses the best available air. Zuture's patented technology does.",
  /* The positioning. A purifier strains the air it already has; a treatment
     system puts it through a process and changes it. */
  usp: "One small system that treats the air in a room, and decides how.",
} as const;

export const CONTACT = {
  email: "info@zuture.co",
  phone: "+91 99989 37170",
  hours: "Mon–Sat, 9:00–18:00 IST",
  address: ["203 Zion Z1, Near Avalon Hotel,", "Sindhubhavan Marg,", "Ahmedabad 380054"],
  map: "https://maps.app.goo.gl/WFM9p5kopnJvqcwQ9",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/zuture.co/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zuture-co" },
    { label: "X", href: "https://x.com/ZutureCO" },
  ],
} as const;

/* ------------------------------------------------------------------
   THE CASE — the problem, in Zuture's own sourced numbers.
   The last entry is deliberately the pivot into the reveal.
   ------------------------------------------------------------------ */
export const CASE = [
  {
    figure: "90%",
    lead: "of your life is spent indoors.",
    body: "Sealed rooms, air conditioning, closed windows. The air in here is the air you get.",
    source: "US EPA",
  },
  {
    figure: "2–5×",
    lead: "more polluted inside than out.",
    body: "Buildings trap what they make — cooking, cleaning, breathing, off-gassing — while ventilation stays shut off.",
    source: "US EPA",
  },
  {
    figure: "1,000",
    lead: "ppm of CO₂ is the limit.",
    body: "Two people in a closed room cross twice that in under two hours. No purifier ever built can remove CO₂. Only fresh air can.",
    source: "ASHRAE 62.1",
  },
  {
    figure: "10–20",
    lead: "years of off‑gassing.",
    body: "How long your sofa, mattress and plywood keep releasing VOCs. Furniture alone accounts for roughly 80% of it.",
    source: "WHO",
  },
  {
    figure: "0",
    lead: "purifiers have looked outside.",
    body: "Every one of them recirculates the same room, forever. Not one has ever asked whether the air outdoors was better.",
    source: "",
  },
] as const;

/* ------------------------------------------------------------------
   THE SYSTEM — what "treatment" actually consists of.
   Four verbs. The fourth is the one nobody else has.
   ------------------------------------------------------------------ */
export const TREATMENT = [
  {
    verb: "Filter",
    body: "Electrostatic plasma or medical-grade H13 HEPA takes the particles out — PM1, PM2.5, PM10, smoke, pollen, allergens.",
    note: "Every purifier stops here.",
    key: false,
  },
  {
    verb: "Replace",
    body: "Filtered outdoor air, pushed in continuously. Stale air leaves. It is the only way CO₂ and VOCs ever actually go anywhere.",
    note: "ASHRAE 62.1 is the standard we design against.",
    key: false,
  },
  {
    verb: "Condition",
    body: "Dew point is checked before a single cubic metre comes in, so nothing condenses. Positive pressure keeps unfiltered air from seeping back through the gaps.",
    note: "No mould, no damp, no infiltration.",
    key: false,
  },
  {
    verb: "Decide",
    body: "It reads both sides of the wall — continuously, indoor against outdoor — and chooses which of the three the room needs right now. Nobody has to touch it.",
    note: "This is the patented part.",
    key: true,
  },
] as const;

/* The scale claim, stated as a fact about where it goes rather than a
   measurement, while the unit is still in development. */
export const SCALE = {
  kicker: "Where it goes",
  headline: "One wall.",
  lead: "Everything above, in a single unit.",
  body: "In a commercial building, filtration, ventilation and environmental control are three separate plant rooms. Here they are one wall-mounted unit, fitted through a single small opening, in any of four orientations.",
} as const;

/* ------------------------------------------------------------------
   IMAGERY — one shot per section, so the page reads as one shoot.
   ------------------------------------------------------------------ */
export const SHOT = {
  hero: "/shot/hero-halo.webp",
  case: "/shot/case-unit.webp",
  blindSpot: "/shot/edge-soft.webp",
  system: "/shot/unit-studio.webp",
  reserve: "/shot/shaft.webp",
  models: {
    "z-active": "/shot/unit-reflect.webp",
    "z-pure": "/shot/unit-dark.webp",
  },
} as const;

/* ------------------------------------------------------------------
   THE APERTURE — fragments of the product, one at a time.
   ------------------------------------------------------------------ */
export const FRAGMENTS = [
  {
    src: "/shot/corner-top.webp",
    caption: "The crown",
    note: "One folded shell. The intake is cut into it, not bolted onto it.",
    pos: "50% 45%",
  },
  {
    src: "/shot/grille-chevron.webp",
    caption: "The fold",
    note: "The louvre array turns the corner without a seam or a joining strip.",
    pos: "50% 50%",
  },
  {
    src: "/shot/grille-corner.webp",
    caption: "The intake",
    note: "Extruded aluminium louvres. Angled, so throw direction needs no diffuser.",
    pos: "45% 50%",
  },
  {
    src: "/shot/panel.webp",
    caption: "The readout",
    note: "Indoor and outdoor, side by side, on the unit itself — not only in the app.",
    pos: "55% 50%",
  },
] as const;

/* ------------------------------------------------------------------
   THE TWO — one platform, two filtration cores. No images: not yet.
   ------------------------------------------------------------------ */
export const MODELS = [
  {
    id: "z-active",
    name: "Z‑ACTIVE",
    edition: "ESP Edition",
    accent: "fresh" as const,
    line: "Nothing to replace. Ever.",
    body: "Electrostatic precipitation and ionisation. A high-voltage field drives what it catches onto collector plates you rinse under a tap — there is no consumable to buy, for the life of the unit.",
    stack: ["Debris shield", "F8 fine filter", "ESP engine"],
    facts: [
      ["Core", "ESP + ionisation"],
      ["Filters", "Washable, no consumables"],
      ["Stages", "Three"],
      ["Suits", "Lowest running cost"],
    ],
  },
  {
    id: "z-pure",
    name: "Z‑PURE",
    edition: "HEPA Edition",
    accent: "recirc" as const,
    line: "The hospital standard, at home.",
    body: "Medical-grade H13 HEPA media, followed by an activated carbon scrubber for VOCs and odours. Four stages, for anyone who wants the highest capture grade we can fit.",
    stack: ["Debris shield", "F8 fine filter", "H13 HEPA", "Carbon scrubber"],
    facts: [
      ["Core", "HEPA H13"],
      ["Filters", "Replaceable media"],
      ["Stages", "Four"],
      ["Suits", "Highest capture grade"],
    ],
  },
] as const;

/* ------------------------------------------------------------------
   THE PATH — each model's full sequence, written out separately.
   `catches` is the line that does the explaining: everything else is
   supporting detail. Keep it to a few plain words.
   ------------------------------------------------------------------ */
export const PATH = [
  {
    id: "z-active",
    model: "Z‑ACTIVE",
    short: "ESP",
    accent: "fresh" as const,
    stages: [
      {
        n: "01",
        name: "Debris shield",
        catches: "Hair, grit and large dust",
        body: "A metal mesh at the intake. It does not clog, and you never buy another one.",
      },
      {
        n: "02",
        name: "F8 fine filter",
        catches: "Smoke, pollen and fine dust",
        body: "Dense synthetic media for the mid-range particles the first stage is too coarse to notice.",
      },
      {
        n: "03",
        name: "ESP engine",
        catches: "Whatever is still left",
        body: "A high-voltage field charges it and drives it onto collector plates. The plates rinse under a tap.",
      },
    ],
    close: "Three stages. Nothing you ever have to buy again.",
  },
  {
    id: "z-pure",
    model: "Z‑PURE",
    short: "HEPA",
    accent: "recirc" as const,
    stages: [
      {
        n: "01",
        name: "Debris shield",
        catches: "Hair, grit and large dust",
        body: "A metal mesh at the intake. It does not clog, and you never buy another one.",
      },
      {
        n: "02",
        name: "F8 fine filter",
        catches: "Smoke, pollen and fine dust",
        body: "Dense synthetic media for the mid-range particles the first stage is too coarse to notice.",
      },
      {
        n: "03",
        name: "HEPA H13",
        catches: "The finest particles",
        body: "H13 is the HEPA grade hospitals build cleanrooms around — made for the sizes that slip past everything else.",
      },
      {
        n: "04",
        name: "Molecular scrubber",
        catches: "Gases, VOCs and odours",
        body: "Activated carbon for what a filter cannot trap: formaldehyde off new furniture, fresh paint, last night’s cooking.",
      },
    ],
    close: "Four stages. The highest capture grade we can fit.",
  },
] as const;

/* ------------------------------------------------------------------
   THE ADVANTAGE — capability matrix, exactly as Zuture supplied it.
   ------------------------------------------------------------------ */
export const MATRIX_COLUMNS = ["Purifier", "Ventilation", "Zuture"] as const;

export const MATRIX_ROWS: { label: string; values: [boolean, boolean, boolean] }[] = [
  { label: "Comparison of indoor & outdoor air parameter", values: [false, false, true] },
  { label: "Indoor room space saver", values: [false, false, true] },
  { label: "Real time automation", values: [false, false, true] },
  { label: "Fresh air / ventilation", values: [false, true, true] },
  { label: "Active filtration", values: [false, true, true] },
  { label: "Stand alone", values: [true, false, false] },
  { label: "Occupancy intelligence", values: [false, false, true] },
  { label: "Installation possible in 0°, 90°, 180°, 270°", values: [false, false, true] },
  { label: "Data collection", values: [false, false, true] },
  { label: "VOC removal", values: [false, false, true] },
  { label: "Free cooling, heating, humidification…", values: [false, false, true] },
  { label: "Washable filters", values: [false, false, true] },
];

/* What both models do. Capabilities and design intent only — no measured
   performance, while the unit is still a prototype. */
export const PLATFORM = [
  ["Monitoring", "Indoor and outdoor", "Particulates, VOC, temperature, humidity and CO₂"],
  ["Decision", "Made for you", "Fresh air, recirculation, or a CO₂ override"],
  ["Pressure", "Positive", "So unfiltered air cannot seep back through the gaps"],
  ["Condensation", "Dew point checked", "Before any outdoor air is drawn in"],
  ["Mounting", "Four orientations", "Wall mounted through one small opening"],
  ["Control", "Display and app", "On the unit itself, and over Bluetooth"],
  ["Duty", "Continuous", "Designed to run around the clock"],
  ["Standard", "ASHRAE 62.1", "The ventilation standard we design against"],
] as const;

/* ------------------------------------------------------------------
   STATUS — Zuture is a prototype. Say so, in the place a reader goes
   looking for a spec sheet.
   ------------------------------------------------------------------ */
export const DEVELOPMENT = {
  label: "Where we are",
  title: "Still in development.",
  body: "Everything here describes the system and the technology inside it. Airflow, coverage, noise, dimensions and certification are being validated on the prototype now — we will publish those figures when they are measured, not before.",
  note: "Reserve a unit and you will get the full specification first.",
} as const;

/* ------------------------------------------------------------------
   ABOUT — mission, patents and founders, from zuture.co/about.
   ------------------------------------------------------------------ */
export const ABOUT = {
  mandate:
    "Zuture is dedicated to solving the critical issue of indoor air quality gripping the world.",
  body:
    "Born with the core vision that everyone is entitled to have fresh, clean air, Zuture provides a complete, sophisticated solution to ensure optimal indoor environments.",
  quote:
    "Zuture is not just building a product. We’re establishing the future standard for healthy indoor air quality.",
  /* The specific patent coverage, as stated on zuture.co. */
  patents: [
    "Demand-controlled ventilation architecture",
    "Intelligent air-intake decision logic",
    "System-level thermal comfort optimisation",
  ],
  milestones: [
    ["2021", "Founded in Ahmedabad, Gujarat"],
    ["Patented", "Broad coverage across the intelligence"],
    ["Make in India", "Engineered and supported locally"],
  ],
  team: [
    { name: "Abhishek Joshi", role: "Chief Executive Officer" },
    { name: "Nirali Joshi", role: "Chief Technology Officer" },
  ],
} as const;

/* ------------------------------------------------------------------
   RESERVE — mirrors the fields the live enquiry form collects.
   ------------------------------------------------------------------ */
export const RESERVE = {
  eyebrow: "Pre-order",
  title: "Reserve your system.",
  body:
    "Secure your place in the first batch. Tell us the room and which core you want in it, and we will come back with pricing, lead time and a fitting date.",
  note: "Limited batch release. No payment taken now.",
  spaces: ["Home", "Bedroom", "Office", "Conference room", "Clinic", "School", "Other"],
} as const;

export const TICKER = [
  "Patented technology",
  "India’s 1st",
  "Intelligent air treatment",
  "Make in India",
  "Launching soon",
] as const;

export const NAV = [
  { label: "The system", href: "/system" },
  { label: "The models", href: "/models" },
  { label: "About", href: "/about" },
] as const;

/**
 * Where each page hands over to the next.
 *
 * The site reads as one argument in four parts, so every page ends by naming
 * the next rather than dropping the reader at a footer. /about is the end of
 * the chain: the reservation form is the thing to do there, not another link.
 */
export const NEXT_UP: Record<string, { href: string; label: string; line: string } | null> = {
  "/": {
    href: "/system",
    label: "The system",
    line: "Four things have to happen to the air in a room. Here is how one unit does all of them.",
  },
  "/system": {
    href: "/models",
    label: "The models",
    line: "One platform, built two ways. Z‑ACTIVE brings air in. Z‑PURE cleans what is already there.",
  },
  "/models": {
    href: "/about",
    label: "About Zuture",
    line: "Who is building this, where, and how far along it is.",
  },
  "/about": null,
};

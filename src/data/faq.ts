/**
 * Frequently asked questions — the single source for /faq, its FAQPage
 * structured data, and llms.txt.
 *
 * How these are written:
 *
 * - Questions are phrased the way people type them ("can an air purifier remove
 *   CO2"), not the way the brand would phrase them.
 * - Every answer opens with a sentence that stands on its own. That is the line
 *   a search snippet, a voice assistant or an AI overview lifts.
 * - Every product claim restates something the site, or Zuture itself, already
 *   says: the product copy in data/site.ts, the patent claims, the reservation
 *   terms, and Zuture's own description of installation and operation.
 * - Zuture is a prototype. Nothing unmeasured is stated as a result: noise,
 *   airflow, energy savings and filter life are described as design intent,
 *   and the last question says plainly that the figures are not out yet.
 *
 * General air-quality facts are stated the way their sources state them. In
 * particular, 1,000 ppm of CO2 is a widely used benchmark, not a limit set by
 * ASHRAE 62.1 — that standard sets ventilation rates. And the EPA's "2 to 5
 * times" refers to concentrations of some pollutants, not indoor air overall.
 *
 * Z-ACTIVE's ozone output is not stated because it has not been measured yet;
 * when it is, put the figure (and any UL 2998 result) into that answer.
 *
 * Deliberately left out: installation dimensions (the prototype may change),
 * decibel figures, filter-replacement intervals, and any percentage capture
 * rate for a finished unit.
 */
export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const faqId = (q: string) =>
  q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

export const FAQ: FaqGroup[] = [
  {
    id: "basics",
    title: "The basics",
    items: [
      {
        q: "What is Zuture?",
        a: "Zuture is an intelligent air treatment system: one wall-mounted unit that filters the air in a room, replaces stale air with filtered fresh air from outside, conditions that air so it does not cause damp, and decides for itself which the room needs. It is designed and built in India by Zuture Enterprise Pvt Ltd, Ahmedabad, in two editions, Z-ACTIVE and Z-PURE.",
      },
      {
        q: "How is Zuture different from an air purifier?",
        a: "An air purifier only cleans the air already in the room and sends it back, so carbon dioxide keeps building up and the room can still feel stuffy. Zuture filters that air too, but it can also bring in filtered fresh air from outside and push stale air out, and it switches between the two on its own by comparing indoor and outdoor air.",
      },
      {
        q: "What is a fresh air purifier?",
        a: "A fresh air purifier brings outdoor air into a room through filters, instead of only cleaning the air already inside. Because it replaces stale air, it lowers carbon dioxide as well as particles, which a standard air purifier cannot do. Zuture is a fresh air purifier that can also recirculate and clean the indoor air when the air outside is worse, and it decides between the two on its own.",
      },
      {
        q: "Do I need an air purifier or a fresh air system?",
        a: "If your problem is particles such as dust, smoke, pollen and PM2.5, an air purifier deals with that. If rooms feel stuffy, windows stay shut, or you want lower CO2, you need fresh air, which a purifier cannot provide. Many homes have both problems at different times of day, depending on outdoor AQI, which is why Zuture does both and switches between them.",
      },
      {
        q: "What is an intelligent air treatment system?",
        a: "It is a single system that does the jobs a building normally splits across separate equipment: filtering particles, replacing stale air, conditioning incoming air, and deciding which of those a room needs at any moment. In a commercial building those jobs sit in separate plant rooms; Zuture puts them into one unit on one wall.",
      },
      {
        q: "What does demand-controlled ventilation mean?",
        a: "It means ventilation that responds to what the air actually needs instead of running on a fixed schedule. Zuture continuously compares indoor and outdoor readings: if outdoor air is polluted it recirculates and cleans the air inside, and if indoor CO2 rises it brings in filtered fresh air. Demand-controlled ventilation architecture is one of the areas Zuture's patents cover.",
      },
      {
        q: "Where can Zuture be used?",
        a: "Zuture is designed for individual rooms: living rooms and bedrooms at home, offices and conference rooms, clinics and classrooms. Each unit treats the room it is mounted in, so a home or office would use one unit per room that needs it.",
      },
    ],
  },
  {
    id: "indoor-air",
    title: "Indoor air, CO2 and AQI",
    items: [
      {
        q: "Can an air purifier remove CO2?",
        a: "No. Carbon dioxide is a gas, and filters, whether HEPA or activated carbon, do not meaningfully remove it. The practical way to lower indoor CO2 is to replace indoor air with outdoor air, which is why Zuture measures CO2 and can bring in filtered fresh air when levels rise.",
      },
      {
        q: "What CO2 level is too high indoors?",
        a: "There is no single legal limit, but about 1,000 ppm is the most widely used indoor benchmark; outdoor air is roughly 420 ppm. Above 1,000 ppm a room usually starts to feel stuffy, and a closed bedroom with two people sleeping in it can pass that level well before morning. Ventilation standards such as ASHRAE 62.1 set ventilation rates rather than a CO2 limit.",
      },
      {
        q: "Why can indoor air be worse than outdoor air?",
        a: "Because a closed building holds on to whatever is released inside it. The US EPA notes that concentrations of some pollutants are often two to five times higher indoors than outdoors, from cooking, cleaning products, furnishings and people themselves, and estimates that people spend about 90% of their time indoors.",
      },
      {
        q: "Where do VOCs in a home come from?",
        a: "Volatile organic compounds come from everyday things: new furniture and pressed-wood products, fresh paint, cleaning products, air fresheners and cooking. Emissions are usually highest when products are new and can continue for months or longer. Particle filters do not capture gases; activated carbon adsorbs many VOCs, and bringing in fresh air dilutes them. Z-PURE has an activated carbon stage, and both editions ventilate.",
      },
      {
        q: "Should I open the windows or run a purifier when outdoor AQI is bad?",
        a: "It depends which air is worse at that moment, and for which pollutant. On a smoggy day outdoor air may carry far more PM2.5, while a closed room quietly builds up CO2 and VOCs that only fresh air removes. Zuture is built to make that call continuously: it compares indoor and outdoor air and chooses between filtered fresh air, recirculation, or a CO2 override.",
      },
    ],
  },
  {
    id: "technology",
    title: "How it works",
    items: [
      {
        q: "What does Zuture measure?",
        a: "Zuture measures particulates (PM2.5 and PM10), volatile organic compounds, carbon dioxide, temperature and humidity, and compares indoor readings with outdoor ones. Those readings are what it uses to decide between fresh air, recirculation and a CO2 override.",
      },
      {
        q: "Does Zuture work as an air quality monitor?",
        a: "In effect, yes. Zuture measures PM2.5, PM10, VOCs, CO2, temperature and humidity, compares them with the air outside, and shows indoor and outdoor readings side by side on its display and in its app. Unlike a standalone air quality monitor, it also acts on what it measures.",
      },
      {
        q: "What pollutants does Zuture remove?",
        a: "Its filtration removes particles, including PM1, PM2.5 and PM10, smoke, pollen and allergens. Gases work differently: Z-PURE's activated carbon stage adsorbs VOCs and odours, and both editions lower CO2 and dilute VOCs by replacing stale air with filtered fresh air.",
      },
      {
        q: "What is the difference between Z-ACTIVE and Z-PURE?",
        a: "They share one platform and differ in how they catch particles. Z-ACTIVE uses electrostatic precipitation with ionisation and has no consumables to buy, for the lowest running cost. Z-PURE uses H13 HEPA media followed by an activated carbon scrubber, for the highest capture grade. Both measure the air, bring in fresh air and decide for themselves.",
      },
      {
        q: "Does Zuture use a HEPA filter?",
        a: "Z-PURE does. Its four stages are a metal debris shield, an F8 fine filter, H13 HEPA media and an activated carbon scrubber for gases and odours; H13 is a HEPA class used in hospital and cleanroom filtration. Z-ACTIVE uses an electrostatic (ESP) engine instead of HEPA, after the same debris shield and F8 filter.",
      },
      {
        q: "What is the difference between H13 and H11 HEPA filters?",
        a: "Under the European EN 1822 standard, an H13 filter must capture at least 99.95% of particles at their most penetrating size. Filters sold as “H11” belong to a lower class, which EN 1822 now calls E11, rated at about 95%. Zuture Z-PURE uses H13 media; Z-ACTIVE uses electrostatic precipitation instead of HEPA.",
      },
      {
        q: "What is CADR?",
        a: "Clean air delivery rate, or CADR, measures how much filtered air a purifier delivers, usually in cubic metres per hour, and is the usual way to match a purifier to a room size. It describes particle removal only, so it says nothing about CO2 or fresh air. Zuture's CADR has not been published yet; it will be once it is measured.",
      },
      {
        q: "What is an electrostatic precipitator?",
        a: "An electrostatic precipitator gives airborne particles an electric charge with a high-voltage field and collects them on oppositely charged plates. Because the plates are cleaned rather than replaced, there is no filter to keep buying. It is the core of Zuture Z-ACTIVE, whose collector plates rinse clean under a tap.",
      },
      {
        q: "Does Zuture produce ozone?",
        a: "Ionisers and electrostatic air cleaners can release ozone as a by-product, and ozone irritates the lungs, so it is a fair question to ask of any purifier that uses them. The recognised limits are UL 867, which caps electrostatic air cleaners at 0.05 ppm, and UL 2998, which certifies zero ozone emissions. Zuture Z-PURE filters mechanically, with HEPA and activated carbon, and has no electrostatic or ionising stage. Zuture Z-ACTIVE uses electrostatic precipitation and ionisation; its measured ozone output has not been published yet and, like its other figures, will be once tested.",
      },
      {
        q: "How is Zuture different from an ERV?",
        a: "Most energy recovery ventilators (ERVs) are ducted, whole-house systems whose main job is swapping stale indoor air for fresh outdoor air while transferring heat and moisture between the two streams. Zuture is a single-room unit mounted on a wall and fitted through one small opening, and its job is deciding: it compares indoor and outdoor air, chooses between filtered fresh air, recirculation or a CO2 override, checks the dew point, and brings in cooler outdoor air when that helps.",
      },
      {
        q: "Does bringing in outdoor air cause damp or mould?",
        a: "Zuture is designed to prevent it. It checks the dew point before drawing outdoor air in, so incoming air does not condense on cool surfaces, and it keeps the room at slight positive pressure so unfiltered air cannot leak in through gaps around doors and windows.",
      },
      {
        q: "Can Zuture reduce the load on my air conditioner?",
        a: "That is part of the design. When the air outside is cooler than the room, as it often is in the evening and at night, Zuture can bring it in and take some of the load off the air conditioner; when it is hotter outside, it limits how much outdoor air it draws. Energy savings have not been measured on the prototype yet.",
      },
    ],
  },
  {
    id: "installation-and-use",
    title: "Installation and everyday use",
    items: [
      {
        q: "Does installing Zuture require structural changes?",
        a: "No major structural work is needed. The unit mounts on an inside wall that faces outdoors and draws fresh air through a single small opening in that wall, much like fitting a split air conditioner or a kitchen chimney. Zuture's technicians seal the opening so insects, dust and unfiltered air cannot bypass the filters, and the unit can be mounted in any of four orientations.",
      },
      {
        q: "Can I install Zuture in a rented home or an existing building?",
        a: "Usually, yes. Zuture is designed to be retrofitted into existing apartments, houses and offices; the one requirement is an outside-facing wall where the small air-inlet opening can be made. In a rented home you will need the owner's permission for that opening.",
      },
      {
        q: "Do I need to switch between ventilation and recirculation myself?",
        a: "No. Zuture chooses between filtered fresh air, recirculation and a CO2 override on its own, continuously, based on its indoor and outdoor readings. You can override it from the app if you want to, but it is designed to be set once and left to run.",
      },
      {
        q: "Is Zuture noisy?",
        a: "Zuture is designed to be quiet enough for bedrooms and home offices. Because it is demand-controlled, it runs at high speed only when the air calls for it and spends most of its time at low speed. Measured noise levels have not been published yet; they will be once testing on the prototype is complete.",
      },
      {
        q: "Can I control Zuture from my phone?",
        a: "Yes. Zuture has a display on the unit showing indoor and outdoor air side by side, and an app that connects over Bluetooth. It is designed to run around the clock and make its own decisions, so day to day there is nothing you need to adjust.",
      },
      {
        q: "Do Zuture's filters need replacing?",
        a: "It depends on the edition. Z-ACTIVE has no consumables: its filtration is washable and its electrostatic collector plates rinse clean under a tap. Z-PURE uses replaceable HEPA and activated carbon media, the trade-off for its higher capture grade; how often they need changing will depend on use and local air quality, and guidance will come with the full specification.",
      },
    ],
  },
  {
    id: "buying",
    title: "Zuture, and reserving one",
    items: [
      {
        q: "Is Zuture made in India?",
        a: "Yes. Zuture was founded in 2021 in Ahmedabad, Gujarat, by Zuture Enterprise Pvt Ltd, and is engineered, manufactured and supported in India.",
      },
      {
        q: "Is Zuture's technology patented?",
        a: "Yes. Zuture's patent coverage includes demand-controlled ventilation architecture, intelligent air-intake decision logic, and system-level thermal comfort optimisation. The core of it is the decision itself: comparing indoor air with outdoor air and choosing the better option for the room.",
      },
      {
        q: "When is Zuture launching, and how much will it cost?",
        a: "Neither the launch date nor the price has been announced. Zuture is in development and will launch in India first. If you reserve a unit, Zuture will contact you with pricing, lead time and a fitting date, and you will receive the full specification first.",
      },
      {
        q: "How do I reserve a Zuture?",
        a: "Fill in the reservation form on the About page with your name, contact details, the room and the edition you want. Reserving is free: no payment is taken, it is not binding on either side, and you can withdraw at any time by emailing info@zuture.co.",
      },
      {
        q: "What are Zuture's airflow, CADR and noise figures?",
        a: "They have not been published yet, deliberately. Zuture is a working prototype, and airflow, coverage, noise, ozone output, dimensions and certification are being validated now. The figures will be published once they are measured rather than estimated, and people who reserve will receive the full specification first.",
      },
    ],
  },
];

export const FAQ_FLAT = FAQ.flatMap((g) => g.items);

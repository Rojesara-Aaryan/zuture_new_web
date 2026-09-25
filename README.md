# Zuture — launch teaser

A one-page "launching soon" site for Zuture, India's 1st **intelligent air
treatment system**. It is deliberately **not** a product site: the full site
lives in `zuture_info_web`. This one builds the argument and withholds the
product.

## The USP, and how the page carries it

Zuture is not a purifier. It is **one small system that treats the air in a
room, and decides how**. A purifier strains the air already there and hands it
back; a treatment system puts it through a process and changes it.

"The system" section is the centre of the page and exists to land exactly that.
It spells treatment out as four verbs — **Filter, Replace, Condition, Decide** —
and gives Decide the accent colour and the extra weight, because deciding is the
patented part and the only one nobody else has. It then closes on the size
(30 x 20 x 55 cm), because "small" is half the claim: three separate plant rooms
in a commercial building, here as one unit on one wall.

If you edit anything, keep that section's job intact.

## The look

**Heavy uppercase grotesque at display scale** (Archivo 800, tracking -0.045em,
line-height 0.88), against technical mono labels and fine rules. The weight is
the point: the page hits, then explains itself in small type.

An editorial serif version of this site was built and rejected — the big type
is the brand. If you are tempted to shrink it, don't; the restraint belongs in
the body copy and labels, which stay small.

Three families, three clear jobs:

| Family | Job |
| --- | --- |
| Archivo 800 | Display headings, figures, spec values |
| Archivo 600 (`display-em`) | Secondary voice inside a heading — weight, not italic |
| Geist Sans | Body copy |
| Geist Mono | Labels, annotations, data readouts |

### Every section has its own composition

This matters more than the typeface. A page where each section is
eyebrow-heading-hairline-two-columns reads as one section repeated seven times,
no matter how good the type is. So no two sections here share a skeleton:

| Section | Composition |
| --- | --- |
| Hero | **Scroll-to-expand** — a framed card of the backlit unit opens out to full bleed on a sticky stage, type low-left, gradient rule |
| The case | **Sticky split** — figure and unit hold on the left, statements scroll past on the right |
| The blind spot | **Hard vertical split** — the macro shot takes one half outright at full brightness, the argument takes the other against solid black. The only section on the site whose type sits against the right edge rather than the left |
| The system | **Light bento grid** — unequal panels, one image cell, tonal inversion |
| A first look | **Full-bleed shutter**, caption on the frame edge |
| The models | **Split screen** introducing the pair, then what they share |
| How it works | **Two drawn timelines**, one per model. The spine draws downward and the numbered nodes pop in sequence; the longer spine is visibly the longer process. Ends on the development note |
| Zuture advantage | A plain comparison table. Deliberately the least designed section on the page |
| About | Three-across rows — milestones, patent claims and founders each run the full width — with the quote as a wide three-line statement drifting against the scroll between them |
| Reserve | Form panel against a model-tinted wash |

Every section *opens* the same way, though: `ui/SectionHead` sets the label and
heading in the left seven of twelve columns and the standfirst in the right
four, aligned to the foot of the heading rather than its top. Display type needs
a short measure to stay readable, and without that right-hand column every
section began with half a screen of nothing beside the heading. Variety belongs
in the body of a section, not its opener. "The system" writes the same grid out
by hand because it is inverted to bone and carries its own ink-on-light colours.

If you add a section, give its body a composition none of these have — that
variety is the design.

**Two exceptions: "how it works" and the comparison table.** Both explain the
product to someone deciding whether to buy it, so they are the plainest things
on the page on purpose.

"How it works" prints **both sequences in full**, side by side, rather than
sharing the first two stages and forking at the third. The fork was tidier and
harder to read — it made you hold two things in your head at once. Repeating
Debris Shield and F8 costs two paragraphs and buys one column per model, top to
bottom, which anyone can follow.

The line that does the explaining is `catches` — five plain words per stage, set
in the model's accent colour. If someone reads only those, they still
understand the product. Keep it short when you edit.

A buyer scanning twelve capabilities
across three products needs legibility, not invention. Readable column headers,
a tick or a cross (never a dash — that reads as "unknown"), one tinted lane for
the Zuture column, and the count stated in a sentence rather than left for the
reader to do. On phones it stops being a table entirely and each capability
becomes a labelled row, because three columns at 390px is unreadable at any
type size. Resist the urge to make this one clever.

**The blind spot went through three layouts before this one**, and the failures
are worth knowing. Heading, paragraph and pull quote stacked in one column down
the left ran to 1288px and read as a wall of text against a dead half-screen.
Moving the paragraph to a right-hand column helped but left an L-shaped void
under the heading. Standing the quote beside the argument fixed the void but
still reduced the photograph to a backdrop so faint it registered as black.
Giving the image a real half solves all of it: the copy has nowhere to sprawl,
and the product is finally seen. Do not quietly turn it back into a backdrop.

A fourth version re-set the paragraph as a rhythm — one word at display scale,
three times, then a fourth row breaking the pattern — and was reverted. If you
reach for that idea again, know it has been tried.

### Mobile is its own layout, below 640px

Phones get a deliberately different design, and every part of it sits behind
Tailwind's `max-sm:` variant (or in a block that is already `sm:hidden`). That
is a guarantee, not a habit: nothing at 640px or wider can see those classes,
so the desktop layout cannot move when mobile does. It was checked by
pixel-diffing all six pages at 1024 and 1440 before and after — 60.9M pixels,
none changed.

What phones do differently:

- **The case** drops the sticky figure strip. Under the header it was cramped
  and blurred the statements beneath it, so each statement leads with its own
  figure instead, large and in the brand gradient.
- **The comparison table** prints the column names once, in a header pinned
  under the nav, instead of inside all 36 cells. The Zuture column keeps a
  tinted lane top to bottom; the names stay in every cell for screen readers.
- **The footer** and **"True of both"** go to two columns rather than one long
  stack.
- **"A first look"** stacks its label over the exposure meter, which otherwise
  ran together as "…MORE OR LESSEXPOSED".
- **The /system photo cell** gets its own aspect ratio. It has none on the
  desktop grid, where `row-span-2` sizes it; in one column it collapsed to 0px
  and the image disappeared.

**Tablets (640–1023px) were left alone on purpose** and still have two of the
bugs above: the photo cell is 0px tall, and the case figures run into their
sentence ("90%OF YOUR LIFE"). Both are one-class fixes when tablet is in scope.

### The light act

"The system" is the only section that inverts to bone. It is the centre of the
argument, so it gets the page's one change of key, and the fixed chrome flips
with it (`html.on-light`, set by a ScrollTrigger in `Treatment.tsx`; the nav
swaps to the black logo). Do not add a second light section — the inversion
works because it happens once.

That ScrollTrigger applies the class from its **current state**, not only when
its boundary is crossed. "The system" is now the first thing on `/system`, so
on that route it is already behind the header at scroll 0 and there is nothing
to cross — reacting to `onToggle` alone left a dark header and a light logo
sitting on a bone page. The smoke test checks this.

### Colour

The logo gradient — cyan `#00C8FF` → teal `#12BFA8` → green `#36CC00` at 105°
— is used as *light*, never as a flat fill: the scroll-progress hairline, the
rule under the hero, the dash before each section label, the auras, and the
word **Decide**, which is the patented behaviour and the only heading that gets
it. Green and blue keep their model meanings (Z-ACTIVE / Z-PURE) — including in
the filtration chain, where the row's accent tells you which edition you are
reading. Teal is the neutral accent.

There are two gradient text utilities and they are not interchangeable.
`grad-text` is an inline-block sized to `max-content` — right for a standalone
word like **Decide**. `grad-text-run` is for a phrase inside running text that
may wrap: it is `display: inline` with `box-decoration-break: clone`, so every
line fragment gets its own complete ramp. Using `grad-text` there paints one
ramp across the whole box, which leaves a short final line showing only the
cyan beginning and reading as a bug.

Beware `Reveal` around gradient text. It splits its element into lines with
SplitText, which tears a gradient span into independent boxes that each restart
the ramp. The blind spot quote is a plain element with a fade for exactly this
reason.

Note `grad-text` sets `width: max-content`. The gradient is painted across the
element box, so a full-width heading would only ever show the first few percent
of the ramp.

## The product is a prototype — keep it that way in the copy

**There are no measured performance figures anywhere on this site, and that is
deliberate.** No airflow, no dB, no coverage area, no weights, no dimensions,
no clean times, no capture percentages. Zuture is in development and those
numbers are not validated yet.

What the copy does instead:

- names the **technology** (ESP + ionisation, HEPA H13, F8, activated carbon)
- describes **what the system does** (compares indoor against outdoor, chooses
  fresh air or recirculation, holds positive pressure, checks dew point)
- attributes ratings to the **grade or standard**, never to a finished unit —
  "H13 is the HEPA grade hospitals build cleanrooms around", not "captures
  99.97%"
- cites ASHRAE 62.1 as "the standard we design against", not as one met

The **"Still in development"** block sits at the end of the models section, in
the exact place a reader goes looking for a spec sheet, and says the figures
will be published once measured.

The figures in "The case" (90% indoors, 2-5x, 1,000 ppm) are different and can
stay: they are sourced to the US EPA, ASHRAE and WHO and describe the problem,
not the product.

When the prototype is validated, add the numbers back to `PLATFORM` and the
`facts` arrays in `MODELS`, and replace the development block.

## Three rules this site is built on

1. **One shoot, one light.** Every image on the page comes from the same
   dark studio set in `DATA/NEW_IMG` — backlit, near-black, silver on void. If
   you add a photograph, it has to sit in that light or the page comes apart.
   Run `node scripts/prep-images.mjs` to regenerate `public/shot/`.
2. **No graphics.** No diagrams, no illustrations, no charts, no particle
   fields. Everything on screen is type, photography, hairline rules, gradient
   light, or motion. Restraint is the design.
3. **No numbered section labels.** Sections are introduced by `SectionLabel`,
   which is a gradient dash and a few words.

## Where the content came from

Every factual claim is lifted from Zuture's own product reference at
`zuture_info_web/src/knowledge/zuture.knowledge.js` — the filtration stacks,
dB ranges, ~60 CFM, 400 sq ft, ASHRAE and EPA figures, and the contact details.
Nothing is invented. All of it lives in `src/data/site.ts`; change copy there,
not in components.

The pull quote in "The blind spot" is Zuture's own stated differentiator,
quoted verbatim.

## The scroll

| Section | What it does |
| --- | --- |
| Hero | "We change the air." The claim, plainly: a purifier recirculates, Zuture replaces. The card opens out to full bleed as you scroll. |
| Ticker | Velocity-reactive marquee. |
| The case | Five sourced figures, pinned and scrubbed. Ends on "0 purifiers have looked outside" — the pivot. |
| The blind spot | Short bridge: filtration was only ever a third of the answer, plus Zuture's own differentiator quote. |
| The system | **The USP.** Not a purifier, an intelligent air treatment system. Four verbs, then the size. |
| A first look | The shutter. Opens on a fragment, closes, moves on. Peaks at 34% exposed. |
| The models | Z-ACTIVE and Z-PURE, typographically. Filtration chains written out, not drawn. |
| About | Mission, the three patent claims, and the founders. Straight from zuture.co/about. |
| Reserve | Pick a core, leave details. Mirrors the fields the live enquiry form collects. |

## Colour

- **Green `#36CC00`** — what Zuture does that nothing else does.
- **Blue `#00C8FF`** — Z-PURE's identity.

Green is load-bearing: it marks **Decide** in the system section — the patented
behaviour, the whole USP — and then marks Z-ACTIVE. Don't spend it on
decoration, or it stops meaning anything.

## Stack

Next.js 16 (App Router, Turbopack) · Tailwind v4 · GSAP + ScrollTrigger +
SplitText · Lenis, driven off the GSAP ticker so pins stay frame-locked.

Motion (Framer Motion) and React Three Fiber were both dropped. Every UI
interaction here is a single property transition that CSS does natively, and
there is no 3D to render — the site shows almost no hardware on purpose.

## Structure

The site is **four routes, not one scroll**. They read as one argument in four
parts, and each page ends by naming the next rather than dropping the reader at
a footer — that hand-off is `ui/NextUp.tsx`, driven by `NEXT_UP` in
`data/site.ts`.

| Route | Sections |
| --- | --- |
| `/` | Hero, marquee, the case, the blind spot, a first look |
| `/system` | The system, how it works, Zuture advantage |
| `/models` | The models, true of both |
| `/about` | About, reserve |
| `/privacy`, `/terms` | Policies |

```
src/
  app/
    (site)/       the four routes above; layout.tsx wraps them in Chrome
    privacy/      outside (site) on purpose — own header, no site chrome
    terms/
    layout.tsx    html/body + SmoothScroll, globals.css, api/notify
  components/
    Chrome.tsx    the persistent shell: intro, header, progress, footer
    ...           one file per section
    ui/           Reveal, Magnetic, SectionLabel, NextUp
  data/site.ts    ALL copy and every figure
  lib/gsap.ts     plugin registration + shared eases
scripts/
  interaction-smoke.mjs  the regression suite — run it before you ship
  sync-to-github.mjs     copy the source to the GitHub Desktop clone
  make-icons.mjs         regenerate the icons from public/brand/mark.png
  crop-renders.mjs  one-off, for the full renders in DATA/ (unused by this site)
```

**Icons.** `src/app/favicon.ico`, `icon.png` and `apple-icon.png` are generated
from the Zuture mark by `scripts/make-icons.mjs`; the App Router picks them up
by filename, so there are no `<link>` tags to maintain. The Apple one is
flattened onto the brand's near-black because iOS composites transparency onto
white, which would leave a pale halo around a mark designed for dark.

**`Chrome` lives in the layout, not in a page.** That is what stops the intro
replaying on every navigation and the header re-animating each time. It also
owns the scroll reset between routes: Lenis keeps its own scroll position and
would otherwise smooth-scroll the new page back to where the old one was. A
cross-page hash such as the header's "Reserve yours" (`/about#reserve`) is
resolved there too, once the new page has mounted.

**The policy pages sit outside the `(site)` group deliberately.** They carry
their own stripped-back header and must not inherit the intro, the progress
rule or the marketing footer.

## Legal pages and media protection

`/privacy` and `/terms` are scoped to **what this site actually does**: shows
information and takes reservation enquiries. They deliberately do not copy the
live zuture.co policies, which cover an app, an account, a device and sensor
data that do not exist here. Swap them for the full policies when the product
ships. Copy lives in `src/data/legal.ts`.

**The three names are defined, not blurred.** Section 1 of the Terms fixes
them once and the rest of both documents use them:

| Name | What it is |
| --- | --- |
| Zuture Enterprise Pvt Ltd | the registered company — "the Company", "we" |
| Zuture | the device, including Z-ACTIVE and Z-PURE |
| zuture.co | the website |

Jurisdiction is Ahmedabad, Gujarat, with a 30-day good-faith negotiation step
before proceedings (carried over from the live terms).

Both pages render a **"Still to be completed"** panel listing what counsel has
to resolve, rather than shipping `[City]` and `[Name]` placeholders in the body
text the way the live policies currently do. Delete that panel once the items
are closed.

One item is deliberately **not** in that public panel: the live zuture.co Terms
and Privacy Policy still name "Zuture Technologies Pvt. Ltd.", which is not the
registered entity. That needs correcting on the other site — but announcing it
on this one would be a poor look, so it lives as a comment in
`src/data/legal.ts` instead.

**On image protection, be clear-eyed.** `ProtectMedia.tsx` blocks right-click,
drag-to-desktop and the iOS long-press save sheet. That is the limit of what is
possible — a rendered image can always be saved by anyone who opens devtools or
presses the screenshot key, and no script changes that. Keyboard and devtools
blocking is deliberately *not* implemented: it breaks accessibility tools, is
bypassed in seconds, and makes a site feel hostile. The real protection is the
copyright clause in the Terms plus only publishing what you can afford to have
copied. Body text stays selectable; only media is locked.

## Before going live

1. **Wire up reservations.** `src/app/api/notify/route.ts` validates and logs
   only — nothing is stored. Point it at the same CRM the live enquiry form on
   zuture.co uses, or reservations are lost.
2. **Set a launch date** if you want a countdown. `BRAND.launchWindow` in
   `src/data/site.ts` is a placeholder; the hero currently says "Launching soon"
   rather than committing to a date.
3. **No pricing anywhere**, by design — the info site's own policy is to direct
   pricing questions to the team.
4. Add an OG image and favicon.
5. **Close the legal open items** listed on `/privacy` and `/terms` — name a
   Grievance Officer, and have both documents reviewed by counsel.
6. Correct the entity name on zuture.co, which still says "Zuture Technologies
   Pvt. Ltd." rather than "Zuture Enterprise Pvt Ltd".

## Assets

Source material is in `DATA/` and is not served. `public/shot/` holds the
14 frames the site uses, resized to 2200px WebP. The older turntable renders in
`DATA/PRODUCT/` are unused; `scripts/crop-renders.mjs` can still regenerate
them if that changes.

**Text is left-aligned everywhere.** Section headers, body, captions — the page
has one spine. Composition variety comes from layout (sticky, bento, split),
never from moving the text off it.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Image sharpness

Two rules, both learned the hard way:

**Never CSS-scale a photograph.** `scale-[1.25]` on an `<Image>` magnifies
whatever `sizes` asked for, so the browser upscales a file that was chosen for
the smaller box. Every crop on this page is done with `object-position`, or
cropped at build time in `scripts/prep-images.mjs`. There are no `scale-*`
classes on images and there should not be.

**The originals are only 1672x941.** A full-bleed background on a 1440px
viewport at DPR2 needs 2880 device pixels, so the seven full-bleed frames are
Lanczos-enlarged and sharpened at build time. That is damage control, not a
fix — re-export the originals at 2880px or wider and the enlargement step can
go.

If images look soft after you change them, delete `.next` before you debug
anything else. The optimiser caches by URL and quality, so a replaced file with
the same name keeps serving the old pixels — clearing `.next/cache/images`
alone is not enough.

## Interaction smoke test

This page is fixed overlays, pinned sections and a smooth-scroll library — the
exact combination that produces a site which looks perfect and cannot be
clicked. Screenshots do not catch that, so there is a script that does:

```bash
npm i -D playwright && npx playwright install chromium   # one-off
node scripts/interaction-smoke.mjs                       # needs a server on :3000
```

It covers first visit, a reload (intro skipped), reduced motion and the mobile
menu, checking that the nav is actually on top, that clicks navigate, that the
wheel still scrolls, and that the menu can be closed. Run it after touching the
preloader, the nav, or anything with a `z-` class. It has already caught four
real regressions:

- the preloader overlay surviving in the DOM and eating every click
- `lenis.on("scroll", ...)` never binding, because Lenis is created after its
  parent's effect runs
- Lenis never being stepped under reduced motion, freezing the page
  (`autoRaf` is off, so the GSAP ticker must drive it in every code path)
- the fullscreen menu painting above the header, so its own close button was
  unreachable

## Accessibility

`prefers-reduced-motion` is honoured without hiding content: the pinned case
panels stack into a readable list, the shutter is replaced by the three
fragments shown plainly, and the hero's intro-animated elements fall back to
visible via CSS rather than depending on the JS timeline. If you add a pinned
section, check it the same way — anything left at `opacity: 0` when the
timeline never runs is content nobody can read.

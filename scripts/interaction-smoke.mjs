/**
 * Interaction smoke test.
 *
 * This site is mostly fixed overlays, sticky stages and a smooth-scroll
 * library, which is exactly the combination that produces pages that LOOK
 * perfect and cannot be clicked. Screenshots will not catch that. This will.
 *
 * Requires a dev or prod server on :3000, plus a one-off:
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/interaction-smoke.mjs
 */
import { chromium } from "playwright";

const URL = process.env.SMOKE_URL || "http://localhost:3000";
const INTRO_MS = 6500; // the preloader runs ~4s; leave headroom
let failures = 0;

const head = (t) => {
  console.log("");
  console.log(`=== ${t} ===`);
};

const check = (label, pass, detail = "") => {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
  if (!pass) failures++;
};

const open = async (browser, opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  return { page, errs };
};

const path = (page) => new global.URL(page.url()).pathname;

async function desktop(name, { reducedMotion = "no-preference", reload = false } = {}) {
  head(name);
  const browser = await chromium.launch();
  const { page, errs } = await open(browser, { reducedMotion });

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);
  if (reload) {
    // Second visit: the intro is skipped, which is where the overlay used to
    // survive in the DOM and swallow every click on the page.
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(3000);
  }

  // Hit-test the real centre of every nav control rather than fixed pixels,
  // so adding a link never turns this into a false alarm.
  const covered = await page.evaluate(() => {
    const controls = [...document.querySelectorAll("header button, header a")];
    return controls
      .filter((b) => b.offsetParent !== null)
      .map((b) => {
        const r = b.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return hit && (b === hit || b.contains(hit))
          ? null
          : `${b.textContent.trim().slice(0, 16)} blocked by ${hit ? hit.tagName + "." + hit.className.toString().slice(0, 30) : "nothing"}`;
      })
      .filter(Boolean);
  });
  check("every header control is clickable", covered.length === 0, covered.join(" | "));

  const pre = await page.evaluate(() => {
    const el = document.querySelector(".pre-glint")?.closest("div.fixed");
    if (!el) return "absent";
    return `present pe=${getComputedStyle(el).pointerEvents}`;
  });
  check("preloader gone or non-blocking", pre === "absent" || pre.includes("pe=none"), pre);

  // The nav must wait for the intro, then actually animate — it used to play
  // behind the preloader and was never seen, and StrictMode's second effect
  // pass made the preloader skip itself entirely on a first visit.
  const navLive = await page.evaluate(() => {
    const h = document.querySelector("header");
    return h ? +getComputedStyle(h).opacity : 0;
  });
  check("header is fully revealed after the intro", navLive > 0.95, `opacity=${navLive}`);

  // Lenis runs with autoRaf off; if nothing steps it, wheel events vanish.
  const at = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1400);
  check("wheel scrolling works", (await page.evaluate(() => window.scrollY)) !== at);

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/**
 * The site is four routes sharing one persistent shell.
 *
 * The things that can quietly break: the intro replaying on every navigation,
 * the scroll position carrying over from the previous page because Lenis keeps
 * its own, and a cross-page hash link landing at the top instead of the form.
 */
async function routes() {
  head("routes");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser);

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);
  check("home is the teaser page", path(page) === "/", path(page));

  await page.mouse.wheel(0, 2500);
  await page.waitForTimeout(1200);

  await page.click("header >> text=THE SYSTEM", { timeout: 8000 });
  await page.waitForTimeout(2400);
  check("nav navigates to /system", path(page) === "/system", path(page));
  const resetY = await page.evaluate(() => window.scrollY);
  check("scroll resets on navigation", resetY < 40, `scrollY=${resetY}`);

  // /system opens straight onto the bone-coloured act, so the fixed chrome has
  // to be inverted on arrival. It used to flip only when the boundary was
  // crossed, which never happens when the section starts at scroll 0.
  const chrome = await page.evaluate(() => ({
    onLight: document.documentElement.classList.contains("on-light"),
    logoDark: +getComputedStyle(document.querySelector(".logo-dark")).opacity,
  }));
  check(
    "header inverts on the light page",
    chrome.onLight && chrome.logoDark > 0.9,
    JSON.stringify(chrome),
  );

  // The shell lives in the layout, so navigating must not remount it.
  const replayed = await page.evaluate(() => !!document.querySelector(".pre-glint"));
  const navStill = await page.evaluate(
    () => +getComputedStyle(document.querySelector("header")).opacity,
  );
  check("intro does not replay on navigation", !replayed && navStill > 0.95, `opacity=${navStill}`);

  await page.click("header >> text=THE MODELS", { timeout: 8000 });
  await page.waitForTimeout(2400);
  check("nav navigates to /models", path(page) === "/models", path(page));

  // Each page hands over to the next rather than dead-ending at the footer.
  await page.click('a:has-text("About Zuture")', { timeout: 8000 });
  await page.waitForTimeout(2400);
  check("next-up link navigates to /about", path(page) === "/about", path(page));

  // A hash on a different route has to survive the navigation. The form sits
  // below the fold on /about and is revealed on scroll, so this is also what
  // makes it visible — typing into it before this point would fail.
  await page.click("header >> text=THE SYSTEM", { timeout: 8000 });
  await page.waitForTimeout(2400);
  await page.click('header a:has-text("RESERVE YOURS")', { timeout: 8000 });
  await page.waitForTimeout(3000);
  const reserveTop = await page.evaluate(() => {
    const el = document.querySelector("#reserve");
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
  check(
    "reserve button lands on the form, not the top of /about",
    path(page) === "/about" && reserveTop !== null && Math.abs(reserveTop) < 160,
    `${path(page)} #reserve top=${reserveTop}`,
  );

  await page.fill("#name", "Test Person");
  check("reserve form accepts typing", (await page.inputValue("#name")) === "Test Person");

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/**
 * The hero: a card that opens out to full bleed, then a scroll round-trip.
 *
 * The exit tweens are scrubbed, so scrolling up rewinds them. They used to be
 * gsap.to() calls built in the same tick as the intro, which meant they sampled
 * their start values BEFORE the intro had played — recording the lines at
 * yPercent 115 and the header row at opacity 0. Coming back to the top
 * therefore "restored" the hero to its pre-intro hidden state and the headline,
 * eyebrow and sub-copy stayed gone for good. The card can fail the same way.
 */
async function heroRoundTrip() {
  head("hero expand + scroll round-trip");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser);

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);

  // Read opacity, the vertical translate and the clip straight off computed
  // style, so this measures what is painted rather than what GSAP believes.
  const read = () =>
    page.evaluate(() => {
      const state = (el) => {
        const cs = getComputedStyle(el);
        const m = new DOMMatrixReadOnly(cs.transform === "none" ? "" : cs.transform);
        return { opacity: +cs.opacity, y: Math.round(m.m42), vis: cs.visibility };
      };
      const sel = (s) => [...document.querySelectorAll(s)].map(state);
      const frame = document.querySelector(".hero-frame");
      const clip = frame ? getComputedStyle(frame).clipPath : "";
      const first = clip.match(/-?[0-9.]+/);
      return {
        lines: sel(".hero-line"),
        top: sel(".hero-top"),
        foot: sel(".hero-foot"),
        // First inset of the clip: how far the card is held in from the edge.
        inset: clip.startsWith("inset(") && first ? parseFloat(first[0]) : -1,
        clip,
      };
    });

  const heroH = await page.evaluate(() => document.querySelector("section")?.offsetHeight ?? 0);

  const settled = await read();
  const allShown = (g) => g.length > 0 && g.every((e) => e.opacity > 0.95 && e.vis !== "hidden");
  check(
    "hero is fully shown once the intro finishes",
    allShown(settled.lines) && allShown(settled.top) && allShown(settled.foot),
    JSON.stringify({
      lines: settled.lines.length,
      top: settled.top.length,
      foot: settled.foot.length,
    }),
  );
  check("card starts inset, not full bleed", settled.inset > 1, settled.clip);

  // Past the end of the expand range (40% of the section).
  await page.evaluate((h) => window.scrollTo(0, h * 0.44), heroH);
  await page.waitForTimeout(1800);
  const opened = await read();
  check("card opens to full bleed on scroll", opened.inset >= 0 && opened.inset < 1, opened.clip);

  await page.evaluate((h) => window.scrollTo(0, h * 0.6), heroH);
  await page.waitForTimeout(1800);
  const gone = await read();
  check(
    "hero copy clears as it leaves",
    gone.lines.some((e) => e.opacity < 0.9 || e.y < -5),
    JSON.stringify(gone.lines),
  );

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2200);
  const back = await read();

  const offset = (g) => g.every((e) => Math.abs(e.y) <= 2);
  check(
    "headline returns on scroll back",
    allShown(back.lines) && offset(back.lines),
    JSON.stringify(back.lines),
  );
  check(
    "eyebrow row returns on scroll back",
    allShown(back.top) && offset(back.top),
    JSON.stringify(back.top),
  );
  check(
    "sub-copy returns on scroll back",
    allShown(back.foot) && offset(back.foot),
    JSON.stringify(back.foot),
  );
  check("card closes again on scroll back", back.inset > 1, back.clip);

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/**
 * How long each figure in "the case" stays on screen.
 *
 * The section is a sticky figure with the statements scrolling past it, so a
 * figure's hold is set by the height of its statement block. The last one is
 * the pivot the whole section builds to and carries no source line, which made
 * it the shortest block and gave the most important number the briefest look.
 * It now gets deliberate room below it; this makes sure it keeps it.
 */
async function caseHold() {
  head("the case — figure hold");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser);

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);

  const sec = await page.evaluate(() => {
    const s = document.querySelector("#case");
    return { top: s.offsetTop, h: s.offsetHeight };
  });

  // Step through the section and count the scroll over which each figure is
  // both displayed and actually within the viewport, clear of the header.
  const held = {};
  const order = [];
  for (let y = sec.top - 400; y < sec.top + sec.h + 400; y += 50) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
    const r = await page.evaluate(() => {
      const el = document.querySelector("#case .display");
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { fig: el.textContent.trim(), on: b.top > 60 && b.bottom < window.innerHeight };
    });
    if (r?.on) {
      held[r.fig] = (held[r.fig] || 0) + 50;
      if (!order.includes(r.fig)) order.push(r.fig);
    }
  }

  const last = order[order.length - 1];
  const others = order.slice(0, -1).map((f) => held[f]);
  const shortest = Math.min(...others);

  check("every figure gets a readable hold", shortest >= 200, JSON.stringify(held));
  check(
    "the closing figure holds longest of all",
    held[last] >= shortest,
    `"${last}" held ${held[last]}px vs ${shortest}px shortest of the rest`,
  );

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/**
 * What crawlers and answer engines receive, read from the server HTML — not
 * the hydrated page, because that is what they index.
 *
 * Each of these has already broken once without anything looking wrong: three
 * pages shipped with no <h1>, and setting a per-page canonical silently dropped
 * the share image from every page. Nothing on screen changes when SEO breaks,
 * which is exactly why it needs checking.
 */
async function seo() {
  head("seo / aeo / geo");
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const get = async (p) => (await ctx.request.get(URL + p)).text();

  for (const route of ["/", "/system", "/models", "/about", "/faq"]) {
    const html = await get(route);
    const pick = (re) => (html.match(re) || [])[1] || "";
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    const title = pick(/<title>(.*?)<\/title>/);
    const desc = pick(/<meta name="description" content="(.*?)"/);
    const canonical = pick(/<link rel="canonical" href="(.*?)"/);
    const og = pick(/<meta property="og:image" content="(.*?)"/);
    const ogAlt = pick(/<meta property="og:image:alt" content="(.*?)"/);
    const twImg = pick(/<meta name="twitter:image" content="(.*?)"/);
    const keywords = pick(/<meta name="keywords" content="(.*?)"/);
    const hreflang = /<link rel="alternate" hrefLang="en-IN"/i.test(html);
    let ld = [], ldOk = true;
    for (const [, body] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      try {
        const d = JSON.parse(body);
        ld.push(...(Array.isArray(d) ? d : [d]).map((x) => x["@type"]));
      } catch {
        ldOk = false;
      }
    }
    const imgs = html.match(/<img\b[^>]*>/g) || [];
    const noAlt = imgs.filter((i) => !/\balt="/.test(i)).length;
    const problems = [];
    if (h1 !== 1) problems.push(`${h1} h1`);
    if (!title || title.length > 70) problems.push(`title "${title}"`);
    if (desc.length < 70 || desc.length > 170) problems.push(`description ${desc.length} chars`);
    const canonPath = canonical ? new global.URL(canonical).pathname : "(none)";
    if (canonPath !== route) problems.push(`canonical ${canonical || "missing"}`);
    if (!og) problems.push("no og:image");
    // Each page previews as itself when shared, not as the home page.
    const slug = route === "/" ? "home" : route.slice(1);
    if (og && !og.endsWith(`/og/${slug}.png`)) problems.push(`og:image is ${og}`);
    if (og) {
      const r = await ctx.request.get(URL + new global.URL(og).pathname);
      if (!r.ok() || !String(r.headers()["content-type"]).includes("image/png")) problems.push("og:image does not load");
    }
    if (!ogAlt || !twImg) problems.push("image alt or twitter:image missing");
    if (keywords.split(",").length < 5) problems.push("keywords missing");
    if (!hreflang) problems.push("no hreflang");
    if (!ldOk || !ld.includes("Organization")) problems.push("structured data");
    if (noAlt) problems.push(`${noAlt} img without alt`);
    check(`${route} is fully marked up`, problems.length === 0, problems.join(", ") || `h1, title, description, keywords, canonical, hreflang, own og:image, ${ld.join("+")}`);
  }

  const faq = await get("/faq");
  const faqLd = JSON.parse([...faq.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]).find((b) => b.includes("FAQPage")));
  const qs = (Array.isArray(faqLd) ? faqLd.find((x) => x["@type"] === "FAQPage") : faqLd).mainEntity;
  // Structured data that does not match what is on the page is ignored, or penalised.
  // Compare decoded question headings to the schema names, exactly and in order.
  // (Substring matching broke on an admin question containing double quotes,
  // which React writes as &quot;.)
  const decode = (t) =>
    t.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const headings = [...faq.matchAll(/<h3[^>]*>(.*?)<\/h3>/gs)].map((m) => decode(m[1]).trim());
  const onPage = qs.length === headings.length && qs.every((q, i) => q.name === headings[i]);
  check("every FAQ in structured data is visible on the page", onPage && qs.length >= 5, `${qs.length} questions`);


  const sitemap = await get("/sitemap.xml");
  const routes = ["/system", "/models", "/about", "/faq"].filter((r) => sitemap.includes(r + "</loc>"));
  check("sitemap lists every indexable page", routes.length === 4, routes.join(" "));
  const images = (sitemap.match(/<image:loc>/g) || []).length;
  check("sitemap carries the page photographs (image sitemap)", images >= 10, `${images} images`);
  const robots = await get("/robots.txt");
  check("robots.txt allows crawling and names the sitemap", /Allow: \//.test(robots) && /Sitemap:/.test(robots));
  const llms = await get("/llms.txt");
  check("llms.txt is served for AI engines", llms.startsWith("# Zuture") && llms.includes("## Questions and answers"));
  const full = await get("/llms-full.txt");
  check(
    "llms-full.txt carries every page and what is not yet published",
    full.startsWith("# Zuture") && ["## How it works", "## The models", "## Not yet published", "## About the company"].every((h) => full.includes(h)),
  );
  const home = await get("/");
  check("pages link their plain-text version for LLM crawlers", /<link rel="alternate" type="text\/plain" href="[^"]*\/llms\.txt"/.test(home));

  await browser.close();
}

async function mobile() {
  head("mobile menu");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser, {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  await page.goto(URL, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);

  await page.click('[aria-label="Open menu"]');
  await page.waitForTimeout(1200);
  check(
    "hamburger opens menu",
    (await page.getAttribute('[aria-label="Close menu"]', "aria-expanded")) === "true",
  );

  // The close button lives in the header; the menu is a sibling overlay. If the
  // header ever drops below it in stacking order, the menu becomes a trap.
  await page.click('[aria-label="Close menu"]', { timeout: 8000 });
  await page.waitForTimeout(1200);
  check("close button is reachable while menu is open", true);

  await page.click('[aria-label="Open menu"]');
  await page.waitForTimeout(1200);
  await page.click('.menu-link:has-text("The models")');
  await page.waitForTimeout(2800);
  check("menu link navigates", path(page) === "/models", path(page));

  const at = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(1300);
  check("scroll released after menu close", (await page.evaluate(() => window.scrollY)) !== at);

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/**
 * The reservation form, end to end, without sending anything: EmailJS is
 * intercepted in the browser, first to fail and then to succeed.
 */
async function reservation() {
  head("reservation");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser);
  const sent = [];
  let reply = { status: 400, body: "The template ID is invalid" };
  await page.route("https://api.emailjs.com/**", async (r) => {
    sent.push(JSON.parse(r.request().postData() || "{}"));
    await r.fulfill({ status: reply.status, body: reply.body, headers: { "Access-Control-Allow-Origin": "*" } });
  });
  page.on("console", () => {}); // the failure is logged on purpose

  await page.goto(URL + "/about#reserve", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);

  await page.click('button[type="submit"]');
  await page.waitForTimeout(400);
  check("empty form shows an error and sends nothing", (await page.isVisible('[role="alert"]')) && sent.length === 0);

  await page.click('button:has-text("Z‑PURE"), button:has-text("Z-PURE")');
  await page.fill("#name", "Smoke Test");
  await page.fill("#email", "smoke@example.com");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);
  const alert = (await page.textContent('[role="alert"]').catch(() => "")) || "";
  check("a failed send says so and stays on the form", path(page) === "/about" && /did not go through/i.test(alert), alert.trim());

  reply = { status: 200, body: "OK" };
  await page.click('button[type="submit"]');
  await page.waitForURL("**/thank-you**", { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const p = sent.at(-1)?.template_params || {};
  check("the send carries the form fields", p.first_name === "Smoke" && p.reply_to === "smoke@example.com" && /Z-PURE/.test(p.selected_model || ""), JSON.stringify(p).slice(0, 120));
  const h1 = (await page.textContent("h1").catch(() => "")) || "";
  const lead = await page.evaluate(() => document.body.innerText);
  check("success lands on /thank-you with the chosen model", path(page) === "/thank-you" && /Reserved/.test(h1) && /PURE/.test(lead), `${path(page)} "${h1.trim()}"`);
  const robots = await page.getAttribute('meta[name="robots"]', "content");
  check("thank-you page is kept out of search", /noindex/.test(robots || ""), robots || "");

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

/** The pinned phone CTA: there after the intro, gone at the footer, lands on the form. */
async function mobileCta() {
  head("sticky mobile CTA");
  const browser = await chromium.launch();
  const { page, errs } = await open(browser, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await page.goto(URL + "/system", { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(INTRO_MS);

  const cta = 'a:has-text("Free · no payment")';
  const shown = async () =>
    page.evaluate(() => {
      const a = [...document.querySelectorAll("a")].find((x) => x.textContent?.includes("Free · no payment"));
      if (!a) return false;
      const r = a.getBoundingClientRect();
      return getComputedStyle(a.parentElement).opacity === "1" && r.bottom <= innerHeight && r.top > innerHeight / 2;
    });
  check("pinned at the bottom of the screen after the intro", await shown());

  await page.evaluate(() => document.querySelector("footer")?.scrollIntoView());
  await page.waitForTimeout(1200);
  check("gets out of the way at the footer", !(await shown()));

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(1500);
  await page.click(cta);
  await page.waitForTimeout(3500);
  const top = await page.evaluate(() => document.querySelector("#reserve")?.getBoundingClientRect().top ?? null);
  check("tapping it lands on the reservation form", path(page) === "/about" && top !== null && Math.abs(top) < 200, `${path(page)} top=${top}`);

  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(400);
  check("not shown from tablet width up", !(await page.isVisible(cta)));

  check("no page errors", errs.length === 0, errs.join(" | "));
  await browser.close();
}

await desktop("first visit");
await desktop("reload — preloader skipped", { reload: true });
await desktop("reduced motion", { reducedMotion: "reduce" });
await routes();
await heroRoundTrip();
await caseHold();
await mobile();
await mobileCta();
await reservation();
await seo();

console.log("");
console.log(failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED");
process.exit(failures === 0 ? 0 : 1);

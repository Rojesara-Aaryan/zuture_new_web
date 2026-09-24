"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { BRAND, SHOT } from "@/data/site";
import { useReady } from "./Chrome";

/**
 * How far the card is inset before it opens out.
 *
 * A phone has no width to give away, so the card there is nearly full-width
 * and its framing is done with the top and bottom instead.
 */
const startClip = () =>
  window.innerWidth < 640 ? "inset(13% 6% round 14px)" : "inset(13% 25% round 18px)";

const OPEN_CLIP = "inset(0% 0% round 0px)";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const start = useReady();

  useGSAP(
    () => {
      if (!start) return;

      if (prefersReducedMotion()) {
        gsap.set("[data-hero]", { autoAlpha: 1 });
        return;
      }

      const heading = root.current!.querySelector<HTMLElement>(".hero-h1")!;
      /* linesClass gives the smoke test a stable handle on the animated lines. */
      const split = new SplitText(heading, { type: "lines", mask: "lines", linesClass: "hero-line" });

      // Closed before the intro plays. The image is still faded out at this
      // point, so the card is never seen snapping shut.
      gsap.set(".hero-frame", { clipPath: startClip() });
      gsap.set(".hero-scrim", { opacity: 0.3 });

      gsap
        .timeline()
        .set("[data-hero]", { autoAlpha: 1 })
        .fromTo(
          ".hero-glint",
          { autoAlpha: 0, scale: 1.25 },
          { autoAlpha: 1, scale: 1, duration: 3, ease: "zuture" },
          0,
        )
        .fromTo(".hero-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "zutureIn" }, 0.1)
        .fromTo(".hero-top > *", { yPercent: 130 }, { yPercent: 0, duration: 1, stagger: 0.07 }, 0.2)
        .fromTo(split.lines, { yPercent: 115 }, { yPercent: 0, duration: 1.25, stagger: 0.1 }, 0.35)
        .fromTo(".hero-foot", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1 }, 1.05);

      /**
       * These are fromTo, not to, and every one sets immediateRender: false.
       *
       * A scrubbed gsap.to() samples its start values when it is built — which
       * is this tick, before the intro above has played. It would record the
       * lines at yPercent 115 and the header at opacity 0, and scrolling back
       * up would "reverse" the hero into its pre-intro hidden state instead of
       * its resting one. Declaring the from values fixes what it returns to;
       * immediateRender keeps those values from being applied now and fighting
       * the intro.
       */
      const exit = { ease: "none" as const, immediateRender: false };
      const st = (s: string, e: string, scrub: number | boolean = true) => ({
        trigger: root.current,
        start: s,
        end: e,
        scrub,
        invalidateOnRefresh: true,
      });

      /**
       * The card opens out to full bleed.
       *
       * clip-path rather than width and height: the image stays laid out at
       * full size the whole way, so nothing reflows, the crop never shifts and
       * the corners stay crisp. The percentages are read fresh on every refresh
       * so a rotation or a resize past the 640px breakpoint re-reads the right
       * starting inset instead of animating from a stale one.
       */
      gsap.fromTo(
        ".hero-frame",
        { clipPath: startClip() },
        { ...exit, clipPath: OPEN_CLIP, scrollTrigger: st("top top", "40% top", 0.4) },
      );

      gsap.fromTo(
        ".hero-scrim",
        { opacity: 0.3 },
        { ...exit, opacity: 1, scrollTrigger: st("top top", "40% top", 0.4) },
      );

      gsap.fromTo(
        ".hero-glint",
        { scale: 1 },
        { ...exit, scale: 1.16, scrollTrigger: st("top top", "54% top") },
      );

      gsap.fromTo(
        split.lines,
        { yPercent: 0, autoAlpha: 1 },
        {
          ...exit,
          yPercent: -45,
          autoAlpha: 0,
          stagger: 0.05,
          scrollTrigger: st("42% top", "54% top", 0.6),
        },
      );

      gsap.fromTo(
        ".hero-foot, .hero-top",
        { yPercent: 0, autoAlpha: 1 },
        { ...exit, yPercent: -30, autoAlpha: 0, scrollTrigger: st("42% top", "52% top", 0.6) },
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [start] },
  );

  return (
    /* Tall enough to hold the stage still while the card opens out: the stage
       is one viewport, everything above that is scroll budget. Under reduced
       motion nothing animates, so that budget would be two screens of a static
       image — collapse it back to a single viewport. */
    <section
      ref={root}
      className="grain relative h-[220svh] w-full bg-void motion-reduce:h-[100svh]"
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[600px] flex-col justify-between overflow-hidden">
        {/* The expanding frame. Everything that belongs to the image — the
            image, its scrims and the brand aura — is clipped along with it. */}
        <div
          className="hero-frame absolute inset-0"
          style={{ clipPath: OPEN_CLIP, willChange: "clip-path" }}
        >
          <div className="hero-glint absolute inset-0 opacity-0 motion-reduce:opacity-100">
            <Image
              src={SHOT.hero}
              alt="The Zuture unit, backlit"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          <div
            aria-hidden
            className="aura pointer-events-none absolute -bottom-1/3 left-1/2 h-[75vmin] w-[120vmin] -translate-x-1/2 opacity-30 blur-[40px]"
          />

          {/* These exist to keep the headline legible over a full-bleed image.
              While the card is small the headline is mostly beside it rather
              than on it, and at full strength they make the card the same
              black as the page behind it — so the whole expand goes unseen.
              They fade up as the card opens instead. */}
          <div className="hero-scrim pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-linear-to-t from-void via-void/55 to-void/35" />
            <div className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-void via-void/70 to-transparent" />
          </div>
        </div>

        <div className="relative flex h-full flex-col justify-between gutter pb-10 pt-28 sm:pb-14">
          <div
            data-hero
            className="hero-top flex flex-wrap items-baseline gap-x-8 gap-y-2 opacity-0 motion-reduce:opacity-100"
          >
            <span className="label overflow-hidden text-text-hi">
              <span className="grad-rule mr-2.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full align-middle" />
              {BRAND.status}
            </span>
            <span className="label overflow-hidden text-text-lo">{BRAND.category}</span>
            <span className="label ml-auto hidden overflow-hidden text-text-lo sm:block">
              Est. {BRAND.founded} &middot; {BRAND.city}
            </span>
          </div>

          <div className="max-w-[62rem]">
            {/* The break is explicit. Four short words at display scale sit
                within one line of most viewports, so leaving the wrap to the
                measure gives "WE CHANGE THE / AIR." on some widths and
                "WE / CHANGE THE AIR." on others. SplitText splits on rendered
                line boxes, so a real <br> is what keeps the two-line reveal
                identical everywhere. */}
            <h1
              data-hero
              className="hero-h1 display max-w-[14ch] text-[clamp(3.4rem,10.5vw,10rem)] text-text-hi opacity-0"
            >
              We change
              <br />
              the air.
            </h1>

            <div className="hero-rule grad-rule mt-10 h-px w-full origin-left opacity-60" />

            <div className="hero-foot mt-6 flex flex-col gap-6 opacity-0 motion-reduce:opacity-100 lg:flex-row lg:items-start lg:justify-between">
              <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-text-mid">
                Zuture is an <span className="text-text-hi">intelligent air treatment system</span>{" "}
                &mdash; one small unit that filters the air in a room, replaces it, conditions it,
                and works out for itself which of those it should be doing.
              </p>

              <button
                onClick={() => lenis?.scrollTo("#case", { duration: 1.6 })}
                className="group flex shrink-0 items-center gap-3 self-start lg:self-auto"
              >
                <span className="label text-text-lo transition-colors group-hover:text-text-hi">
                  Read on
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-edge-bright text-text-mid transition-colors group-hover:border-teal group-hover:text-teal">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden>
                    <path
                      d="M5 0v12M1 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      className="animate-[nudge_1.8s_ease-in-out_infinite]"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

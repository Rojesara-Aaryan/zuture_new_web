"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { NEXT_UP } from "@/data/site";

/**
 * The hand-off at the bottom of every page.
 *
 * Now that the site is four pages rather than one scroll, each page has to say
 * where the argument goes next — otherwise the reader hits a footer and stops.
 * It is set in display type at the scale of a section heading, because it is
 * the most important thing on the page by the time anyone reaches it.
 */
export default function NextUp({ from }: { from: string }) {
  const root = useRef<HTMLDivElement>(null);
  const next = NEXT_UP[from];

  useGSAP(
    () => {
      if (!next || prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } })
        .fromTo(".nu-rule", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "zutureIn" })
        .fromTo(
          ".nu-reveal",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          "-=0.6",
        );
    },
    { scope: root, dependencies: [from] },
  );

  if (!next) return null;

  return (
    /* The footer brings its own generous top padding, so this needs almost
       none of its own or the two stack into a dead screen. */
    <div ref={root} className="gutter pb-4 pt-8">
      <span aria-hidden className="nu-rule grad-rule block h-px w-full origin-left" />

      <Link
        href={next.href}
        className="group mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="nu-reveal label text-text-lo">Next</p>
          <p className="nu-reveal display mt-4 text-[clamp(2.1rem,6vw,4.6rem)] text-text-hi transition-colors duration-300 group-hover:text-fresh">
            {next.label}
          </p>
          <p className="nu-reveal mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-text-mid">
            {next.line}
          </p>
        </div>

        <span className="nu-reveal flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-edge-bright text-text-mid transition-colors duration-300 group-hover:border-fresh group-hover:text-fresh">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
            <path
              d="M0 6h14M9 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.1"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
}

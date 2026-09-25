"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ABOUT, BRAND } from "@/data/site";
import SectionHead from "./ui/SectionHead";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // The three patent claims wipe in from a hairline, like something being
      // stamped rather than faded up.
      gsap.fromTo(
        ".patent-row",
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "zutureIn",
          scrollTrigger: { trigger: ".patent-list", start: "top 82%", once: true },
        },
      );

      gsap.fromTo(
        ".about-person",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          scrollTrigger: { trigger: ".about-team", start: "top 85%", once: true },
        },
      );

      // Quote drifts against the scroll — slow, heavy, deliberate.
      gsap.fromTo(
        ".about-quote",
        { yPercent: 14 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: ".about-quote", start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative bg-void py-24 sm:py-32">
      <div className="gutter">
        <SectionHead label="Who is building it" heading={ABOUT.mandate} lead={ABOUT.body} />

        {/* Three across the full width — stacked in one column it left two
            thirds of the row empty next to a very tall heading. */}
        <dl className="mt-14 grid gap-x-10 sm:grid-cols-3">
          {ABOUT.milestones.map(([k, v]) => (
            <div key={k} className="border-t border-edge py-6">
              <dt className="display text-[clamp(1.05rem,2vw,1.5rem)] text-text-hi">{k}</dt>
              <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-text-mid">{v}</dd>
            </div>
          ))}
        </dl>

        {/* The quote */}
        {/* A 22ch measure at display scale ran to six lines down the left edge
            with the right half dark. A wider measure at a smaller size says the
            same thing in three and uses the row. */}
        <figure className="relative my-20 overflow-hidden py-8 sm:my-24">
          <span aria-hidden className="grad-rule mb-9 block h-px w-24" />
          <blockquote className="about-quote display max-w-[38ch] text-[clamp(1.45rem,3vw,2.5rem)] text-text-hi">
            {ABOUT.quote}
          </blockquote>
        </figure>

        {/* Patent coverage */}
        <div className="patent-list border-t border-edge pt-10">
          <p className="label text-text-lo">Protected by broad patent coverage</p>
          {/* Three across rather than three stacked: each claim is short, so a
              full-width row per claim left most of the line empty. */}
          <ul className="mt-8 grid gap-x-10 sm:grid-cols-3">
            {ABOUT.patents.map((claim) => (
              <li key={claim} className="patent-row border-t border-edge py-6">
                <span aria-hidden className="grad-rule mb-5 block h-px w-6" />
                <span className="display block text-[clamp(1.05rem,1.7vw,1.3rem)] text-text-hi">
                  {claim}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Founders */}
        <div className="about-team mt-20 border-t border-edge pt-10 sm:mt-28">
          <p className="label text-text-lo">The minds behind it</p>
          {/* Two names and the provenance note share one row of three, so the
              right-hand third is used rather than left dark. */}
          <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {ABOUT.team.map((person) => (
              <div key={person.name} className="about-person">
                <p className="display text-[clamp(1.4rem,2.8vw,2.2rem)] text-text-hi">
                  {person.name}
                </p>
                <p className="label mt-2 text-text-mid">{person.role}</p>
              </div>
            ))}
            <p className="text-[0.8125rem] leading-relaxed text-text-lo sm:self-end sm:pb-1">
              Founded {BRAND.founded} in {BRAND.city}. Engineered, manufactured and supported in
              India, for Indian air.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ABOUT, BRAND } from "@/data/site";
import Reveal from "./ui/Reveal";
import SectionLabel from "./ui/SectionLabel";

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
        <SectionLabel>Who is building it</SectionLabel>

        <Reveal as="h2" className="display mt-6 max-w-[16ch] text-[clamp(2.1rem,5.6vw,4.4rem)]">
          {ABOUT.mandate}
        </Reveal>

        <div className="mt-12 grid gap-12 border-t border-edge pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal
            as="p"
            split="words"
            className="max-w-[50ch] text-[0.95rem] leading-relaxed text-text-mid sm:text-lg"
          >
            {ABOUT.body}
          </Reveal>

          <dl className="grid grid-cols-1 gap-px self-start sm:grid-cols-3 lg:grid-cols-1">
            {ABOUT.milestones.map(([k, v]) => (
              <div key={k} className="border-t border-edge py-4 first:border-t-0 lg:first:border-t">
                <dt className="display text-[clamp(1.05rem,2vw,1.5rem)] text-text-hi">{k}</dt>
                <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-text-mid">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The quote */}
        <figure className="relative my-24 overflow-hidden py-10 sm:my-32">
          <blockquote className="about-quote display max-w-[22ch] text-[clamp(1.7rem,4.2vw,3.4rem)] text-text-hi">
            {ABOUT.quote}
          </blockquote>
        </figure>

        {/* Patent coverage */}
        <div className="patent-list border-t border-edge pt-10">
          <p className="label text-text-lo">Protected by broad patent coverage</p>
          <ul className="mt-8 flex flex-col">
            {ABOUT.patents.map((claim) => (
              <li
                key={claim}
                className="patent-row flex items-baseline gap-5 border-b border-edge py-5 last:border-b-0"
              >
                <span aria-hidden className="grad-rule mt-3 h-px w-6 shrink-0" />
                <span className="display text-[clamp(1.05rem,2vw,1.5rem)] text-text-hi">
                  {claim}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Founders */}
        <div className="about-team mt-20 border-t border-edge pt-10 sm:mt-28">
          <p className="label text-text-lo">The minds behind it</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-12">
            {ABOUT.team.map((person) => (
              <div key={person.name} className="about-person">
                <p className="display text-[clamp(1.4rem,2.8vw,2.2rem)] text-text-hi">
                  {person.name}
                </p>
                <p className="label mt-2 text-text-mid">{person.role}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[46ch] text-[0.8125rem] leading-relaxed text-text-lo">
            Founded {BRAND.founded} in {BRAND.city}. Engineered, manufactured and supported in
            India, for Indian air.
          </p>
        </div>
      </div>
    </section>
  );
}

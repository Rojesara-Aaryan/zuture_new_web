"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { MODELS, PLATFORM, SHOT } from "@/data/site";
import SectionLabel from "./ui/SectionLabel";
import Reveal from "./ui/Reveal";

const ACCENT = { fresh: "#36cc00", recirc: "#00c8ff" } as const;

/**
 * The two models, what they share, and the development status.
 *
 * No measured performance anywhere in here. The unit is a prototype, so this
 * describes the technology and then says so plainly, in the place a reader
 * goes looking for a spec sheet.
 */
export default function Models() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>(".model").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: i === 0 ? -24 : 24 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "zuture",
            scrollTrigger: { trigger: ".split", start: "top 74%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".split-rule",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "zutureIn",
          scrollTrigger: { trigger: ".split", start: "top 78%", once: true },
        },
      );

      gsap.fromTo(
        ".spec-row",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.04,
          scrollTrigger: { trigger: ".spec-list", start: "top 84%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="models" ref={root} className="relative bg-void">
      <div className="gutter pt-24 sm:pt-32">
        <SectionLabel>Two of them</SectionLabel>
        <Reveal
          as="h2"
          className="display mt-7 max-w-[20ch] text-[clamp(2.1rem,5.6vw,4.4rem)] text-text-hi"
        >
          One platform.{" "}
          <span className="display-em text-text-mid">Two ways to catch a particle.</span>
        </Reveal>
      </div>

      {/* The pair */}
      <div className="split relative mt-14 grid sm:mt-20 lg:grid-cols-2">
        <span
          aria-hidden
          className="split-rule absolute inset-y-0 left-1/2 hidden w-px origin-top bg-edge-bright lg:block"
        />

        {MODELS.map((m) => {
          const c = ACCENT[m.accent];
          return (
            <article
              key={m.id}
              className="model relative flex flex-col overflow-hidden border-t border-edge px-[max(1.25rem,4.5vw)] py-14 sm:py-20 lg:border-t-0"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[30rem] w-[42rem] -translate-x-1/2 rounded-[50%] blur-[90px]"
                style={{ backgroundColor: c, opacity: 0.1 }}
              />

              <div className="relative mb-12 aspect-16/10 w-full overflow-hidden rounded-xl">
                <Image
                  src={SHOT.models[m.id]}
                  alt={`${m.name} unit`}
                  fill
                  quality={95}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-void/70 via-transparent to-transparent" />
              </div>

              <div className="relative">
                <p className="label text-text-lo">{m.edition}</p>
                <h3 className="display mt-4 text-[clamp(2.4rem,5.8vw,4.2rem)]" style={{ color: c }}>
                  {m.name}
                </h3>
                <p className="display-em mt-4 text-[clamp(1.2rem,2.4vw,1.8rem)] text-text-hi">
                  {m.line}
                </p>
                <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-text-mid">
                  {m.body}
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5">
                  {m.facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="label text-text-lo">{k}</dt>
                      <dd className="display mt-1.5 text-[1.05rem] text-text-hi">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          );
        })}
      </div>

      <div className="gutter pt-20 sm:pt-28">
        {/* What both do */}
        <div>
          <p className="label border-t border-edge pt-6 text-text-lo">True of both</p>
          <ul className="spec-list mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM.map(([k, v, note]) => (
              <li key={k} className="spec-row flex flex-col gap-2 border-t border-edge py-6">
                <span className="label text-text-lo">{k}</span>
                <span className="display text-[clamp(1.1rem,2.2vw,1.6rem)] text-text-hi">{v}</span>
                <span className="text-[0.8125rem] leading-relaxed text-text-mid">{note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="pb-24 sm:pb-32" />
    </section>
  );
}

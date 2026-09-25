"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import Image from "next/image";
import { TREATMENT, SCALE, SHOT } from "@/data/site";
import Reveal from "./ui/Reveal";

/**
 * The positioning section, and the one place the page inverts to light.
 *
 * Laid out as a bento of unequal panels rather than another stack of rows:
 * three treatments sit small, "Decide" takes the wide cell because it is the
 * patented one, and the size claim closes the grid. The tonal flip is the
 * page's only change of key — it marks this as the centre of the argument.
 */
export default function Treatment() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        ".bento-cell",
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "zuture",
          scrollTrigger: { trigger: ".bento", start: "top 78%", once: true },
        },
      );

      /**
       * Flip the fixed chrome while this act sits behind the header.
       *
       * Applied from the trigger's current state, not only when it is crossed.
       * This section is the first thing on /system, so on that route it is
       * already behind the header at scroll 0 and nothing is ever crossed —
       * onToggle alone left a dark header and a light logo on a bone page.
       */
      const paint = (on: boolean) => document.documentElement.classList.toggle("on-light", on);
      const theme = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onToggle: (self) => paint(self.isActive),
        onRefresh: (self) => paint(self.isActive),
      });
      paint(theme.isActive);

      return () => {
        theme.kill();
        document.documentElement.classList.remove("on-light");
      };
    },
    { scope: root },
  );

  const filter = TREATMENT[0];
  const decide = TREATMENT.find((t) => t.key)!;
  const middle = TREATMENT.filter((t) => !t.key && t !== filter);

  return (
    <section id="system" ref={root} className="relative bg-bone text-ink">
      <div className="gutter py-24 sm:py-32">
        {/* Heading left, definition bottom-right. Same opener as the dark
            sections, written out here because this act is inverted to bone and
            carries its own ink-on-light colours. */}
        <header className="grid gap-y-7 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <p className="label flex items-center gap-3 text-ink/45">
              <span aria-hidden className="grad-rule h-px w-8 shrink-0 sm:w-12" />
              The system
            </p>
            <Reveal as="h2" className="display mt-7 text-[clamp(2rem,5vw,3.75rem)] text-ink">
              Not a purifier.
              <br />
              <span className="display-em">An intelligent air treatment system.</span>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal
              as="p"
              split="words"
              className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/60 lg:pb-2"
            >
              <span className="text-ink">Treat</span>, verb &mdash; to put something through a
              process that changes it. A purifier strains the air already in the room and hands it
              back. Zuture does four things to it, and works out for itself which one the room
              needs.
            </Reveal>
          </div>
        </header>

        <div className="bento mt-16 grid gap-3 sm:mt-20 sm:grid-cols-2 lg:grid-cols-6">
          {/* Decide — the wide, dark, gradient one */}
          <article className="bento-cell relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink p-7 text-bone sm:col-span-2 sm:p-9 lg:col-span-4 lg:row-span-2">
            <div
              aria-hidden
              className="grad-rule pointer-events-none absolute inset-x-0 top-0 h-px opacity-90"
            />
            <div
              aria-hidden
              className="aura pointer-events-none absolute -right-1/4 -top-1/3 h-[34rem] w-[34rem] opacity-50"
            />
            <div className="relative">
              <p className="label text-bone/45">{decide.note}</p>
              <h3 className="display grad-text mt-5 text-[clamp(2.5rem,6.4vw,5rem)]">
                {decide.verb}
              </h3>
            </div>
            <p className="relative mt-10 max-w-[46ch] text-[0.9375rem] leading-relaxed text-bone/70 sm:text-base">
              {decide.body}
            </p>
          </article>

          {/* Filter */}
          <article className="bento-cell flex flex-col justify-between rounded-2xl border border-ink/12 p-7 lg:col-span-2">
            <div>
              <h3 className="display text-[clamp(1.9rem,3.8vw,2.9rem)] text-ink">{filter.verb}</h3>
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink/60">{filter.body}</p>
            </div>
            <p className="label mt-8 text-ink/40">{filter.note}</p>
          </article>

          {/* Where it goes — tall accent cell. Deliberately no dimensions:
              the unit is a prototype and those are not measured yet. */}
          <article className="bento-cell flex flex-col justify-between rounded-2xl bg-ink/[0.045] p-7 lg:col-span-2 lg:row-span-2">
            <div>
              <p className="label text-ink/40">{SCALE.kicker}</p>
              <p className="display mt-5 text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-ink">
                {SCALE.headline}
              </p>
              <p className="mt-6 text-[0.875rem] leading-relaxed text-ink/60">{SCALE.body}</p>
            </div>
            <p className="display-em mt-8 text-[clamp(1rem,1.9vw,1.35rem)] text-ink/70">
              {SCALE.lead}
            </p>
          </article>

          {/* Replace, Condition */}
          {middle.map((t) => (
            <article
              key={t.verb}
              className="bento-cell flex flex-col justify-between rounded-2xl border border-ink/12 p-7 lg:col-span-2"
            >
              <div>
                <h3 className="display text-[clamp(1.9rem,3.8vw,2.9rem)] text-ink">{t.verb}</h3>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-ink/60">{t.body}</p>
              </div>
              <p className="label mt-8 text-ink/40">{t.note}</p>
            </article>
          ))}

          {/* The object itself, as a cell */}
          <article className="bento-cell relative overflow-hidden rounded-2xl bg-ink sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <Image
              src={SHOT.system}
              alt="The Zuture unit"
              fill
              quality={95}
              sizes="(max-width: 1024px) 92vw, 32vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
            <p className="label absolute bottom-6 left-6 text-bone/60">Z&#8209;Active &middot; ESP</p>
          </article>

          {/* Closing line across the foot of the grid */}
          <article className="bento-cell flex items-center rounded-2xl border border-ink/12 px-7 py-8 sm:col-span-2 lg:col-span-4">
            <p className="display text-[clamp(1.3rem,2.6vw,2rem)] text-ink">
              {SCALE.lead}{" "}
              <span className="display-em text-ink/50">
                Three plant rooms&rsquo; worth of work, on one wall.
              </span>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import Image from "next/image";
import { CASE, SHOT } from "@/data/site";
import SectionLabel from "./ui/SectionLabel";

/**
 * A sticky split rather than a stack.
 *
 * The figure holds still on the left and swaps as the statements scroll past
 * it on the right — so the numbers accumulate into an argument instead of each
 * one wiping the last away. On tablets it collapses to a sticky strip above
 * the list, which keeps the same relationship in a single column.
 *
 * Phones get neither. Below 640px the strip sat cramped under the header and
 * blurred the statements scrolling beneath it, so there each statement simply
 * leads with its own figure, large and in the brand gradient.
 */
export default function Case() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const triggers = CASE.map((_, idx) =>
        ScrollTrigger.create({
          trigger: `#case-item-${idx}`,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => {
            if (self.isActive) setI(idx);
          },
        }),
      );

      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root },
  );

  const current = CASE[i];

  return (
    <section id="case" ref={root} className="relative bg-void">
      <div className="gutter pt-24 sm:pt-32">
        <SectionLabel>The case</SectionLabel>
      </div>

      <div className="grid items-start gap-x-16 gutter pb-24 pt-10 sm:pb-32 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Sticky figure */}
        <div className="sticky top-16 z-10 mb-8 border-y border-edge bg-void/85 py-5 backdrop-blur-sm max-sm:hidden lg:top-24 lg:mb-0 lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
          <div className="flex items-baseline justify-between gap-6 lg:block">
            <p
              key={current.figure}
              className="display text-[clamp(3rem,11vw,9.5rem)] leading-none text-text-hi [animation:case-in_.55s_var(--ease-out-expo)_both]"
            >
              {current.figure}
            </p>
            <p className="label shrink-0 text-text-lo lg:mt-6">
              <span className="data-num text-text-hi">{String(i + 1).padStart(2, "0")}</span>
              <span> / {String(CASE.length).padStart(2, "0")}</span>
            </p>
          </div>

          {/* The unit sits under the figure and holds still while the
              statements move — the one fixed point in the section. */}
          <div className="relative mt-9 hidden aspect-square w-full max-w-[17rem] overflow-hidden rounded-xl lg:block">
            <Image
              src={SHOT.case}
              alt="The Zuture unit"
              fill
              quality={95}
              sizes="(max-width: 1024px) 1px, 18rem"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-void via-transparent to-transparent" />
          </div>

          <div className="mt-8 hidden gap-1.5 lg:flex">
            {CASE.map((c, idx) => (
              <span
                key={c.figure}
                className={`h-px flex-1 transition-colors duration-500 ${
                  idx <= i ? "bg-text-hi" : "bg-edge-bright"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statements */}
        <ol className="flex flex-col">
          {CASE.map((c, idx) => (
            <li
              key={c.figure}
              id={`case-item-${idx}`}
              /* The last statement is the pivot the whole section is built
                 towards, and it carries no source line, so it was the shortest
                 block and its figure held on screen for less scroll than any
                 of the ones before it. The extra room below it keeps the
                 sticky column pinned long enough to read the "0" and lets the
                 argument land before the next section arrives. Phones have no
                 sticky figure to hold, so there the room is dropped. */
              className="border-t border-edge py-12 first:border-t-0 first:pt-0 last:pb-4 sm:py-16 sm:last:pb-[34vh]"
            >
              <p
                className={`display text-[clamp(1.6rem,3.6vw,3rem)] transition-colors duration-500 ${
                  idx === i ? "text-text-hi" : "text-text-mid"
                }`}
              >
                <span className="display-em grad-text lg:hidden max-sm:mb-3 max-sm:block max-sm:text-[clamp(2.75rem,13vw,3.5rem)] max-sm:font-extrabold max-sm:leading-[0.9]">
                  {c.figure}{" "}
                </span>
                {c.lead}
              </p>
              <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-text-mid">
                {c.body}
              </p>
              {c.source && <p className="label mt-5 text-text-lo">&mdash; {c.source}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

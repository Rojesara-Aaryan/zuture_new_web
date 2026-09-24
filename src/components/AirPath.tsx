"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { PATH, DEVELOPMENT } from "@/data/site";
import SectionLabel from "./ui/SectionLabel";
import Reveal from "./ui/Reveal";

const ACCENT = { fresh: "#36cc00", recirc: "#00c8ff" } as const;

/**
 * Each model's sequence, written out in full and side by side.
 *
 * A drawn spine with numbered nodes, because "steps on a line" is a pattern
 * everyone already reads without being taught. Showing both in full — rather
 * than sharing the first two stages and forking — costs a little repetition
 * and buys the thing that matters: one column, one model, top to bottom, and
 * the longer spine is visibly the longer process.
 *
 * `catches` carries the explanation. If someone reads only those five words
 * per stage, they still understand the product.
 */
export default function AirPath() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>(".lane").forEach((lane) => {
        gsap
          .timeline({ scrollTrigger: { trigger: lane, start: "top 78%", once: true } })
          // The line draws downward — the air's direction of travel.
          .fromTo(
            lane.querySelector(".spine"),
            { scaleY: 0 },
            { scaleY: 1, duration: 1.1, ease: "zutureIn" },
          )
          .fromTo(
            lane.querySelectorAll(".node"),
            { scale: 0, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.14, ease: "back.out(2)" },
            0.25,
          )
          .fromTo(
            lane.querySelectorAll(".stage-copy"),
            { autoAlpha: 0, x: -14 },
            { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.14 },
            0.35,
          )
          .fromTo(
            lane.querySelector(".lane-close"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.2",
          );
      });
    },
    { scope: root },
  );

  return (
    <section id="path" ref={root} className="relative bg-void py-24 sm:py-32">
      <div className="gutter">
        <SectionLabel>How it works</SectionLabel>

        <Reveal as="h2" className="display mt-7 max-w-[20ch] text-[clamp(2rem,5.2vw,4rem)] text-text-hi">
          Every stage, and what it catches.
        </Reveal>

        <p className="mt-6 max-w-[54ch] text-[0.95rem] leading-relaxed text-text-mid">
          Air is pulled through one filter after another. Here is each one, in order, and what it
          takes out.
        </p>

        <div className="mt-14 grid gap-16 sm:mt-20 lg:grid-cols-2 lg:gap-14">
          {PATH.map((lane) => {
            const c = ACCENT[lane.accent];
            return (
              <div key={lane.id} className="lane">
                {/* Which model this column is */}
                <div
                  className="flex flex-wrap items-baseline gap-x-3 border-t-2 pb-8 pt-5"
                  style={{ borderColor: c }}
                >
                  <span className="display text-[clamp(1.4rem,2.8vw,2rem)]" style={{ color: c }}>
                    {lane.model}
                  </span>
                  <span className="label text-text-lo">{`// ${lane.short}`}</span>
                  <span className="label ml-auto text-text-lo">
                    {lane.stages.length} stages
                  </span>
                </div>

                <div className="relative">
                  {/* The spine the nodes sit on */}
                  <span
                    aria-hidden
                    className="spine absolute left-[1.125rem] top-2 h-[calc(100%-1rem)] w-px origin-top"
                    style={{ backgroundColor: c, opacity: 0.45 }}
                  />

                  <p className="label relative mb-7 flex items-center gap-4 text-text-lo">
                    <span
                      aria-hidden
                      className="ml-[0.875rem] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: c }}
                    />
                    Air in
                  </p>

                  <ol className="flex flex-col gap-9">
                    {lane.stages.map((st) => (
                      <li key={st.n} className="relative flex gap-5">
                        <span
                          className="node data-num z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[0.75rem]"
                          style={{
                            color: c,
                            borderColor: `${c}59`,
                            backgroundColor: "#08090a",
                          }}
                        >
                          {st.n}
                        </span>

                        <div className="stage-copy pt-1">
                          <h3 className="display text-[clamp(1.05rem,2vw,1.4rem)] text-text-hi">
                            {st.name}
                          </h3>
                          {/* The line that does the work */}
                          <p className="mt-2 text-[0.9375rem] leading-snug" style={{ color: c }}>
                            {st.catches}
                          </p>
                          <p className="mt-2.5 max-w-[46ch] text-[0.8125rem] leading-relaxed text-text-mid">
                            {st.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <p className="label relative mt-8 flex items-center gap-4 text-text-hi">
                    <span
                      aria-hidden
                      className="ml-[0.5625rem] h-5 w-5 shrink-0 rounded-full border"
                      style={{ borderColor: c, backgroundColor: `${c}1f` }}
                    />
                    Clean air out
                  </p>
                </div>

                <p className="lane-close mt-8 border-t border-edge pt-5 text-[0.875rem] text-text-hi">
                  {lane.close}
                </p>
              </div>
            );
          })}
        </div>

        {/* Said where a reader goes looking for a spec sheet */}
        <div className="mt-20 grid gap-8 border-t border-edge pt-10 sm:mt-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="label text-teal">{DEVELOPMENT.label}</p>
            <h3 className="display mt-4 text-[clamp(1.4rem,3vw,2.2rem)] text-text-hi">
              {DEVELOPMENT.title}
            </h3>
          </div>
          <div>
            <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-text-mid">
              {DEVELOPMENT.body}
            </p>
            <p className="label mt-5 text-text-lo">{DEVELOPMENT.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

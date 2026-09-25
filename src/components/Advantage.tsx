"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { MATRIX_COLUMNS, MATRIX_ROWS } from "@/data/site";
import SectionHead from "./ui/SectionHead";

const TOTAL = MATRIX_ROWS.length;
/** Counted from the matrix, never typed by hand, so the two cannot drift. */
const SCORES = MATRIX_COLUMNS.map((_, i) => MATRIX_ROWS.filter((r) => r.values[i]).length);

function Yes({ zuture = false }: { zuture?: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={zuture ? "text-teal" : "text-text-hi"}
    >
      <path
        d="M2.5 8.4 6.1 12 13.5 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function No() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-text-lo">
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A plain comparison table.
 *
 * This is the one place on the page where being legible beats being clever:
 * readable column headers, a tick or a cross (never a dash, which reads as
 * "unknown"), and a tinted Zuture column so the eye has a lane to follow. On
 * phones the table stops being a table and each capability becomes a labelled
 * row, because three columns at 390px is unreadable at any type size.
 */
export default function Advantage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".cmp-row",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          scrollTrigger: { trigger: ".cmp", start: "top 82%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="advantage" ref={root} className="relative bg-void py-24 sm:py-32">
      <div className="gutter">
        <SectionHead
          label="Benchmarking"
          heading="Zuture advantage."
          headingClass="text-[clamp(2rem,5.2vw,4rem)] text-text-hi"
          lead={
            <>
              A straight comparison with the two things people buy instead &mdash; a standard air
              purifier, and standard ventilation.
            </>
          }
        />

        {/* ---------- Desktop / tablet: a real table ---------- */}
        <div className="cmp mt-12 hidden sm:block">
          <div className="relative">
            {/* The lane the eye should follow */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-full w-[10.5rem] rounded-t-lg bg-teal/[0.055] lg:w-[12rem]"
            />
            <span
              aria-hidden
              className="grad-rule pointer-events-none absolute right-0 top-0 h-[3px] w-[10.5rem] rounded-t-lg lg:w-[12rem]"
            />

            <table className="relative w-full border-collapse">
              <caption className="sr-only">
                Capability comparison between a standard purifier, standard ventilation and Zuture
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="label pb-5 pr-6 pt-6 text-left font-normal text-text-lo">
                    What it does
                  </th>
                  {MATRIX_COLUMNS.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={`label w-[10.5rem] pb-5 pt-6 text-center font-normal lg:w-[12rem] ${
                        i === 2 ? "text-teal" : "text-text-mid"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_ROWS.map((row) => (
                  <tr key={row.label} className="cmp-row">
                    <th
                      scope="row"
                      className="border-t border-edge py-4 pr-6 text-left text-sm font-normal leading-snug text-text-hi"
                    >
                      {row.label}
                    </th>
                    {row.values.map((on, i) => (
                      <td key={i} className="border-t border-edge py-4">
                        <span className="sr-only">{on ? "Yes" : "No"}</span>
                        <span className="flex justify-center">
                          {on ? <Yes zuture={i === 2} /> : <No />}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ---------- Phones: one block per capability ---------- */}
        <div className="cmp mt-10 flex flex-col sm:hidden">
          {MATRIX_ROWS.map((row) => (
            <div key={row.label} className="cmp-row border-t border-edge py-5">
              <p className="text-[0.9375rem] leading-snug text-text-hi">{row.label}</p>
              <div className="mt-3.5 grid grid-cols-3 gap-2">
                {row.values.map((on, i) => {
                  const isZ = i === 2;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 rounded-md px-2.5 py-2 ${
                        isZ ? "bg-teal/[0.08]" : "bg-white/[0.025]"
                      }`}
                    >
                      {on ? <Yes zuture={isZ} /> : <No />}
                      <span
                        className={`label text-[0.5625rem] ${isZ ? "text-teal" : "text-text-lo"}`}
                      >
                        {MATRIX_COLUMNS[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* The count, stated plainly rather than left for the reader to do */}
        <p className="mt-8 border-t border-edge pt-6 text-[0.9375rem] leading-relaxed text-text-mid">
          Out of {TOTAL}, a purifier does{" "}
          <span className="text-text-hi">{SCORES[0]}</span>, ventilation does{" "}
          <span className="text-text-hi">{SCORES[1]}</span>, and Zuture does{" "}
          <span className="text-teal">{SCORES[2]}</span>.
        </p>
      </div>
    </section>
  );
}

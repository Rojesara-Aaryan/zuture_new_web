"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { FRAGMENTS } from "@/data/site";
import SectionLabel from "./ui/SectionLabel";

const N = FRAGMENTS.length;
const PEAK = 34; // how far the shutter ever opens, in percent

/**
 * A shutter over three close-ups. It opens, it closes, it moves on — and it
 * never opens all the way, because the product is not out yet. The withholding
 * is the content, so it is built from clip-path and photography only.
 */
export default function Aperture() {
  const root = useRef<HTMLElement>(null);
  const slit = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const paint = (p: number) => {
        const c = p * N;
        const idx = Math.min(Math.floor(c), N - 1);
        const local = c - idx;
        // Zero at both ends of each cycle, one in the middle: open, then shut.
        const openness = Math.sin(local * Math.PI);
        // Never shuts completely: a 6% slit always stays lit, so the section
        // is never just a black screen between fragments.
        const inset = 47 - openness * (PEAK - 3);

        if (slit.current) {
          slit.current.style.clipPath = `inset(${inset}% 0% ${inset}% 0%)`;
          // Push in slightly while open, so the glimpse is never quite still.
          slit.current.style.transform = `scale(${(1 + openness * 0.06).toFixed(4)})`;
        }
        if (meter.current)
          meter.current.textContent = String(Math.round(openness * PEAK)).padStart(2, "0");
        setI(idx);
      };

      paint(0);

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${N * 105}%`,
        pin: ".ap-stage",
        scrub: 0.45,
        onUpdate: (self) => paint(self.progress),
      });

      return () => st.kill();
    },
    { scope: root },
  );

  const current = FRAGMENTS[i];

  return (
    <section id="glimpse" ref={root} className="relative bg-void">
      <div className="ap-stage relative flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:overflow-visible motion-reduce:pb-24">
        <div className="relative flex items-center justify-between gutter pt-24 sm:pt-28">
          <SectionLabel>A first look, more or less</SectionLabel>
          <p className="label text-text-lo motion-reduce:hidden">
            Exposed{" "}
            <span ref={meter} className="data-num text-text-hi">
              00
            </span>
            %
          </p>
        </div>

        {/* The shutter */}
        <div className="relative flex-1 motion-reduce:hidden">
          <div ref={slit} className="absolute inset-0" style={{ clipPath: "inset(50% 0% 50% 0%)" }}>
            {FRAGMENTS.map((f, idx) => (
              <Image
                key={f.src}
                src={f.src}
                alt={f.caption}
                fill
                quality={95}
                priority={idx === 0}
                sizes="100vw"
                className="object-cover transition-opacity duration-300"
                style={{ objectPosition: f.pos, opacity: idx === i ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        <div className="relative gutter pb-9 motion-reduce:hidden">
          <div className="flex flex-col gap-2 pt-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <p
              key={current.caption}
              className="display text-[clamp(1.2rem,2.6vw,2rem)] text-text-hi [animation:case-in_.5s_var(--ease-out-expo)_both]"
            >
              {current.caption}
            </p>
            <p
              key={current.note}
              className="max-w-[52ch] text-[0.875rem] leading-relaxed text-text-mid [animation:case-in_.5s_.06s_var(--ease-out-expo)_both] sm:text-right"
            >
              {current.note}
            </p>
          </div>
        </div>

        {/* Reduced motion: no shutter to scrub, so show the fragments plainly. */}
        <div className="hidden gutter motion-reduce:block">
          <ul className="mt-10 flex flex-col gap-12">
            {FRAGMENTS.map((f) => (
              <li key={f.src}>
                <div className="relative aspect-[16/7] w-full overflow-hidden">
                  <Image
                    src={f.src}
                    alt={f.caption}
                    fill
                    quality={95}
                    sizes="92vw"
                    className="object-cover"
                    style={{ objectPosition: f.pos }}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2 border-t border-edge pt-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="display text-xl text-text-hi">{f.caption}</p>
                  <p className="max-w-[52ch] text-sm text-text-mid">{f.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

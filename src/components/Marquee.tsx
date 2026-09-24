"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { TICKER } from "@/data/site";

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector(".mq-track")!;

      // Two copies scroll as one; wrapping at -50% makes the seam invisible.
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      // Scroll velocity bends the ticker — the page's momentum becomes airflow.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-3.5, 3.5, self.getVelocity() / 320);
          gsap.to(tween, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true });
          gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3, overwrite: false });
        },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="relative w-full overflow-hidden border-y border-edge bg-ink py-5 select-none"
    >
      <div className="mq-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {TICKER.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="display px-7 text-[clamp(1.05rem,2vw,1.7rem)] text-text-hi/85">
                  {item}
                </span>
                <span
                  aria-hidden
                  className={`text-lg leading-none ${i % 2 ? "text-recirc" : "text-fresh"}`}
                >
                  &middot;
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

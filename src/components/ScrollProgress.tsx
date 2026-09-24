"use client";

import { useRef } from "react";
import { useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Read progress, drawn in the logo gradient. The only piece of chrome that is
 * always brand-coloured, so the palette is present without being applied to
 * anything that has to stay legible.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.body.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      },
    });
    return () => st.kill();
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-70 h-px bg-edge/60 motion-reduce:hidden"
    >
      <div ref={bar} className="grad-rule h-full w-full origin-left" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

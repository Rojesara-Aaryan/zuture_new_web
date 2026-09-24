"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Every section is introduced the same way: a short mono label preceded by a
 * sliver of the logo gradient. The rule draws itself, then the words arrive —
 * so the eye is led left to right into the heading below.
 */
export default function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 90%", once: true } })
        .fromTo(".sl-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "zutureIn" })
        .fromTo(".sl-text", { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.5 }, "-=0.3");
    },
    { scope: root },
  );

  return (
    <p ref={root} className={`label flex items-center gap-3 text-text-lo ${className}`}>
      <span
        aria-hidden
        className="sl-rule grad-rule h-px w-8 shrink-0 origin-left sm:w-12"
      />
      <span className="sl-text">{children}</span>
    </p>
  );
}

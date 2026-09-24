"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Lines read best for display type; words for body copy; chars for labels. */
  split?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
};

const DEFAULT_STAGGER = { lines: 0.09, words: 0.018, chars: 0.012 } as const;

/**
 * Masked reveal. Each line sits in its own overflow-hidden box and slides up;
 * words and chars fade and lift instead, which stays readable at body size.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  split = "lines",
  delay = 0,
  stagger,
  start = "top 85%",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      let instance: SplitText | null = null;

      const build = () => {
        instance?.revert();
        instance = new SplitText(el, {
          type: split,
          // Only lines get the clipping mask; masking words would box each one.
          mask: split === "lines" ? "lines" : undefined,
        });

        const targets =
          split === "lines" ? instance.lines : split === "words" ? instance.words : instance.chars;

        gsap.set(el, { autoAlpha: 1 });

        const from =
          split === "lines"
            ? { yPercent: 115, rotate: 1.2 }
            : { autoAlpha: 0, yPercent: 45, filter: "blur(4px)" };
        const to =
          split === "lines"
            ? { yPercent: 0, rotate: 0 }
            : { autoAlpha: 1, yPercent: 0, filter: "blur(0px)" };

        gsap.fromTo(targets, from, {
          ...to,
          duration: split === "lines" ? 1.1 : 0.7,
          delay,
          stagger: stagger ?? DEFAULT_STAGGER[split],
          ease: "zuture",
          scrollTrigger: { trigger: el, start, once },
        });
      };

      document.fonts.ready.then(build);

      return () => instance?.revert();
    },
    { scope: ref, dependencies: [split] },
  );

  return (
    <Tag ref={ref} data-anim className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}

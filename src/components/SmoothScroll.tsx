"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type LenisInstance = NonNullable<LenisRef["lenis"]>;

const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis.
 * One clock keeps ScrollTrigger pins frame-locked to the smoothed position.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // The server snapshot is false so the first client render matches it, then
  // this settles on the real preference and tracks it live. Changing the
  // options prop rebuilds the Lenis instance.
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  useEffect(() => {
    // Lenis is created in ReactLenis's own effect, and this component is its
    // parent — so on mount the ref is still empty. Bind inside the ticker
    // instead, which also re-binds if the instance is ever rebuilt.
    let bound: LenisInstance | null = null;

    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;

      if (bound !== lenis) {
        bound?.off("scroll", ScrollTrigger.update);
        lenis.on("scroll", ScrollTrigger.update);
        bound = lenis;
      }

      // autoRaf is off, so this is the only thing stepping Lenis. It must run
      // even under reduced motion or Lenis swallows wheel events and the page
      // stops scrolling altogether.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      bound?.off("scroll", ScrollTrigger.update);
    };
  }, [reduced]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: reduced ? 0 : 1.15,
        lerp: reduced ? 1 : 0.1,
        smoothWheel: !reduced,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const LINES = ["INDOOR · OUTDOOR", "SOMETHING IS COMING", "ALMOST"];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      // Decided here rather than during render. Reading sessionStorage while
      // rendering makes the server and the client disagree about whether this
      // overlay exists, and the losing copy stays in the DOM across the whole
      // page — which is how a full-screen layer ends up eating every click.
      const skip =
        prefersReducedMotion() || sessionStorage.getItem("zuture:intro") === "1";

      const finish = () => {
        // Marked as seen only once it has actually played. Writing this up
        // front made StrictMode's second effect pass read it back and skip the
        // intro entirely, so it never ran on a first visit.
        sessionStorage.setItem("zuture:intro", "1");
        document.documentElement.style.overflow = "";
        setGone(true);
        onDone();
      };

      if (skip) {
        document.documentElement.style.overflow = "";
        setGone(true);
        onDone();
        return;
      }

      document.documentElement.style.overflow = "clip";

      const count = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.set(root.current, { autoAlpha: 1 })
        .fromTo(
          ".pre-glint",
          { autoAlpha: 0, scale: 1.25 },
          { autoAlpha: 0.75, scale: 1, duration: 2.2, ease: "zuture" },
          0,
        )
        .to(
          count,
          {
            v: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current)
                counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0,
        )
        .fromTo(".pre-bar", { scaleX: 0 }, { scaleX: 1, duration: 2, ease: "power2.inOut" }, 0)
        .fromTo(
          ".pre-line",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.62 },
          0.2,
        )
        .to(".pre-line", { autoAlpha: 0, y: -8, duration: 0.4, stagger: 0.62 }, 0.75)
        .fromTo(
          ".pre-logo",
          { clipPath: "inset(0 100% 0 0)", autoAlpha: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "zutureIn" },
          1.85,
        )
        .to(".pre-meta", { autoAlpha: 0, duration: 0.4 }, 2.5)
        .to(".pre-glint", { autoAlpha: 0, scale: 1.08, duration: 0.8 }, 2.5)
        .to(".pre-logo", { autoAlpha: 0, filter: "blur(6px)", duration: 0.6 }, 2.7)
        .to(root.current, { yPercent: -100, duration: 1.1, ease: "zutureIn" }, 2.9);

      // If anything interrupts the timeline, the page must not stay locked.
      return () => {
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      /* pointer-events-none is load-bearing: nothing in here is interactive,
         so even a stuck overlay can never block the page underneath. */
      className="pointer-events-none fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-void opacity-0"
    >
      <Image
        src="/shot/unit-void.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pre-glint object-cover opacity-0"
      />

      <div className="pre-meta relative flex flex-col items-center">
        <div className="relative h-6 w-[220px] sm:h-8 sm:w-[300px]">
          {LINES.map((l) => (
            <span
              key={l}
              className="pre-line label absolute inset-0 flex items-center justify-center text-text-mid opacity-0"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      <Image
        src="/brand/logo-colour.png"
        alt="Zuture"
        width={300}
        height={68}
        priority
        className="pre-logo absolute w-[180px] opacity-0 sm:w-[240px]"
      />

      <div className="absolute inset-x-0 bottom-0 gutter pb-8">
        <div className="flex items-end justify-between">
          <span className="label text-text-lo">
            <span ref={counter} className="data-num text-text-hi">
              000
            </span>
            <span className="ml-1">/ 100</span>
          </span>
          <span className="label text-text-lo">Zuture</span>
        </div>
        <div className="mt-4 h-px w-full bg-edge">
          <div className="pre-bar h-full w-full origin-left bg-text-hi" />
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { BRAND, SHOT } from "@/data/site";
import Reveal from "./ui/Reveal";

/**
 * A held breath between the case and the system.
 *
 * A hard vertical split: the macro shot takes one half outright, at full
 * brightness and edge to edge, and the argument takes the other against solid
 * black. Nothing else on the site is built this way — every other section runs
 * type across a full-width column — so this reads as a change of pace rather
 * than another stack of text.
 *
 * It replaces three earlier attempts that all kept the copy in one column: the
 * heading, paragraph and pull quote stacked down the left ran to 1288px with
 * half the screen empty, and the photograph was reduced to a backdrop so faint
 * it registered as black. Giving the image a real half solves both at once —
 * the copy has nowhere to sprawl, and the product is finally seen.
 *
 * The text side is the right one on purpose. The rest of the page runs down the
 * left margin; setting this against the opposite edge is the point.
 */
export default function BlindSpot() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".bs-quote",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "zuture",
          scrollTrigger: { trigger: ".bs-quote", start: "top 88%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="difference" ref={root} className="relative bg-void">
      <div className="grid lg:grid-cols-2">
        {/* The panel. No scrim over the image — it carries no text, so it has
            nothing to protect and every reason to be seen properly. */}
        <div className="relative min-h-[46svh] w-full overflow-hidden lg:min-h-[86svh]">
          <Image
            src={SHOT.blindSpot}
            alt="The intake grille of the Zuture unit, close up"
            fill
            quality={95}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          {/* Softens only the seam, so the two halves meet rather than collide.
              Side by side that edge is vertical; stacked it is horizontal. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-linear-to-r from-transparent from-72% to-void/75 lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-void via-transparent to-transparent lg:hidden"
          />
        </div>

        {/* The argument */}
        <div className="flex flex-col justify-center px-[max(1.25rem,4.5vw)] py-20 sm:py-24 lg:py-28">
          <p className="label flex items-center gap-3 text-text-lo">
            <span aria-hidden className="grad-rule h-px w-8 shrink-0 sm:w-12" />
            The blind spot
          </p>

          <Reveal
            as="h2"
            className="display mt-8 max-w-[18ch] text-[clamp(1.9rem,3.7vw,3.15rem)] text-text-hi"
            start="top 88%"
          >
            Filtration was only ever a third of the answer.
          </Reveal>

          <Reveal
            as="p"
            split="words"
            className="mt-7 max-w-[50ch] text-[0.9375rem] leading-relaxed text-text-mid"
          >
            Straining particles out of the air already in the room is one job. It does nothing
            about the CO&#8322; two people put there in an hour, the VOCs coming off the furniture,
            or the damp. For those the air has to be replaced &mdash; and something has to know
            when.
          </Reveal>

          {/**
           * Deliberately NOT a Reveal.
           *
           * Reveal splits its element into lines, which tore the gradient span
           * into two independent boxes — the ramp ran cyan to green across
           * "Zuture's patented technology" and then restarted at cyan on
           * "does.". A plain fade leaves the span whole.
           *
           * The measure is 38ch rather than 30 so the turn fits on one line.
           * background-clip paints across the whole box, so a phrase that wraps
           * shows the full ramp on the long line and only its cyan start on the
           * short one — which reads as a mistake rather than a gradient.
           */}
          <figure className="bs-quote mt-12 border-t border-edge pt-10 opacity-0 motion-reduce:opacity-100">
            <blockquote className="display-em max-w-[38ch] text-[clamp(1.15rem,1.95vw,1.65rem)] text-text-hi">
              {BRAND.differentiator}{" "}
              <span className="grad-text-run">{BRAND.differentiatorTurn}</span>
            </blockquote>
            <figcaption className="label mt-6 leading-[1.8] text-text-lo">
              {BRAND.patent} &middot; {BRAND.claim} {BRAND.category}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

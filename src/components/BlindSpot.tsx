"use client";

import Image from "next/image";
import { BRAND, SHOT } from "@/data/site";
import Reveal from "./ui/Reveal";

/**
 * A held breath between the case and the system. Left-aligned like every other
 * section — the variety here comes from the full-bleed backdrop and the
 * near-empty right half, not from moving the text off the page's spine.
 */
export default function BlindSpot() {
  return (
    <section
      id="difference"
      className="relative flex min-h-[70svh] items-center overflow-hidden bg-void py-24 sm:py-32"
    >
      <div className="absolute inset-0">
        <Image
          src={SHOT.blindSpot}
          alt=""
          fill
          quality={95}
          sizes="100vw"
          className="object-cover object-right opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-r from-void via-void/88 to-void/35" />
      </div>

      <div className="relative max-w-[58rem] gutter">
        <p className="label flex items-center gap-3 text-text-lo">
          <span aria-hidden className="grad-rule h-px w-8 shrink-0 sm:w-12" />
          The blind spot
        </p>

        <Reveal
          as="h2"
          className="display mt-8 max-w-[17ch] text-[clamp(2.1rem,6.2vw,4.75rem)] text-text-hi"
          start="top 88%"
        >
          Filtration was only ever a third of the answer.
        </Reveal>

        <Reveal
          as="p"
          split="words"
          className="mt-8 max-w-[52ch] text-[0.9375rem] leading-relaxed text-text-mid"
        >
          Straining particles out of the air already in the room is one job. It does nothing about
          the CO&#8322; two people put there in an hour, nothing about the VOCs coming off the
          furniture, and nothing about the damp. For those, the air has to actually be replaced
          &mdash; and something has to know when that is a good idea.
        </Reveal>

        <figure className="mt-16">
          <span aria-hidden className="grad-rule block h-px w-16" />
          <Reveal
            as="blockquote"
            className="display-em mt-8 max-w-[24ch] text-[clamp(1.5rem,3.6vw,2.9rem)] text-text-hi"
          >
            {BRAND.differentiator}
          </Reveal>
          <figcaption className="label mt-7 text-text-lo">
            {BRAND.patent} &middot; {BRAND.claim} {BRAND.category}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

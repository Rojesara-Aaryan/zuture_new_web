"use client";

import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

/**
 * A section opener: heading on the left, standfirst bottom-right.
 *
 * Display type needs a short measure to stay readable, which meant every
 * section opened with a heading down the left and the right-hand half of the
 * screen empty. Setting the standfirst in that column — aligned to the foot of
 * the heading rather than the top, so the two meet on a baseline — uses the
 * space for something worth reading instead of filling it with decoration.
 *
 * Below `lg` it stacks, because at that width there is no spare column.
 */
export default function SectionHead({
  label,
  heading,
  lead,
  headingClass = "text-[clamp(2.1rem,5.6vw,4.4rem)] text-text-hi",
  className = "",
}: {
  label: string;
  heading: React.ReactNode;
  lead?: React.ReactNode;
  headingClass?: string;
  className?: string;
}) {
  return (
    <div className={`grid gap-y-7 lg:grid-cols-12 lg:gap-x-10 ${className}`}>
      <div className="lg:col-span-7">
        <SectionLabel>{label}</SectionLabel>
        <Reveal as="h2" className={`display mt-7 ${headingClass}`}>
          {heading}
        </Reveal>
      </div>

      {lead && (
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <Reveal
            as="p"
            split="words"
            className="max-w-[46ch] text-[0.95rem] leading-relaxed text-text-mid lg:pb-2"
          >
            {lead}
          </Reveal>
        </div>
      )}
    </div>
  );
}

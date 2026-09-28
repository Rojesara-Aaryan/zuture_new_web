"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { FAQ, faqId } from "@/data/faq";
import { CONTACT } from "@/data/site";
import SectionHead from "./ui/SectionHead";

/**
 * Questions and answers.
 *
 * Built on native <details>, not a scripted accordion: every answer is in the
 * HTML that crawlers and answer engines read, it opens without JavaScript, and
 * the browser handles keyboard and screen-reader behaviour. Each question has
 * its own id so an answer can be linked to directly.
 *
 * Group titles sit in a left column and questions run beside them — the same
 * seven/five split the section openers use, so the page reads as part of the
 * site rather than a help-centre bolted on.
 */
export default function Faq() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".faq-group").forEach((g) => {
        gsap.fromTo(
          g.querySelectorAll(".faq-item"),
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            scrollTrigger: { trigger: g, start: "top 85%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="faq"
      ref={root}
      className="relative bg-void pb-24 pt-32 sm:pb-32 sm:pt-40"
    >
      <div className="gutter">
        <SectionHead
          as="h1"
          label="Questions"
          heading={
            <>
              Fresh air, <span className="display-em text-text-mid">asked and answered.</span>
            </>
          }
          lead="Straight answers on air purifiers, fresh air, CO2 and HEPA, and on how Zuture works, how it is installed and what living with it is like."
        />

        <div className="mt-16 flex flex-col gap-14 sm:mt-24 sm:gap-20">
          {FAQ.map((group) => (
            <div
              key={group.id}
              id={group.id}
              className="faq-group grid gap-y-6 border-t border-edge pt-8 lg:grid-cols-12 lg:gap-x-10"
            >
              <h2 className="label text-text-lo lg:col-span-3">{group.title}</h2>

              <div className="lg:col-span-9">
                {group.items.map((f) => (
                  <details
                    key={f.q}
                    id={faqId(f.q)}
                    className="faq-item group border-b border-edge py-5 first:pt-0 sm:py-6"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-[1.0625rem] font-medium leading-snug text-text-hi transition-colors group-hover:text-white sm:text-lg">
                        {f.q}
                      </h3>
                      <span
                        aria-hidden
                        className="relative mt-1.5 h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-teal" />
                        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-teal" />
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-text-mid">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-edge pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[48ch] text-[0.9375rem] leading-relaxed text-text-mid">
            Something we have not answered? Write to{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-text-hi underline underline-offset-4">
              {CONTACT.email}
            </a>
            .
          </p>
          <Link
            href="/about#reserve"
            className="label self-start rounded-full border border-edge-bright px-5 py-2.5 text-text-hi transition-colors duration-300 hover:border-fresh hover:bg-fresh hover:text-void sm:self-auto"
          >
            Reserve yours
          </Link>
        </div>
      </div>
    </section>
  );
}

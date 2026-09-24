"use client";

import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { LEGAL_META, OPEN_ITEMS, type Section } from "@/data/legal";
import { BRAND, CONTACT } from "@/data/site";

/**
 * Shared shell for the policy pages. Long-form legal text needs a measure and
 * a plain reading rhythm, so this drops the display type and sets everything
 * at body size on a single column.
 */
export default function LegalPage({
  title,
  intro,
  sections,
  other,
}: {
  title: string;
  intro: string;
  sections: Section[];
  other: { href: string; label: string };
}) {
  const lenis = useLenis();

  return (
    <div className="min-h-screen bg-void">
      <header className="gutter flex items-center justify-between border-b border-edge py-5">
        <Link href="/" className="relative block h-[22px] w-[97px] shrink-0">
          <Image
            src="/brand/logo-colour.png"
            alt="Zuture"
            fill
            priority
            sizes="120px"
            className="object-contain object-left"
          />
        </Link>
        <Link href="/" className="label text-text-lo transition-colors hover:text-text-hi">
          &larr; Back to site
        </Link>
      </header>

      <main className="gutter py-20 sm:py-28">
        <div className="max-w-[46rem]">
          <p className="label text-text-lo">Legal</p>
          <h1 className="display mt-5 text-[clamp(2rem,5vw,3.5rem)] text-text-hi">{title}</h1>
          <p className="label mt-5 text-text-lo">Effective {LEGAL_META.effective}</p>

          <p className="mt-8 border-t border-edge pt-8 text-[0.95rem] leading-relaxed text-text-mid">
            {intro}
          </p>

          {/* Stated openly rather than left as [PLACEHOLDER] in the body text. */}
          <aside className="mt-10 rounded-lg border border-edge-bright bg-white/[0.02] p-6">
            <p className="label text-teal">Still to be completed</p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-text-mid">
              Zuture is pre-launch and these documents are not final. The following need your
              counsel&rsquo;s input before this site goes live:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {OPEN_ITEMS.map((item) => (
                <li key={item} className="flex gap-3 text-[0.8125rem] leading-relaxed text-text-lo">
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-text-lo" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="mt-14 flex flex-col gap-12">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-[1.0625rem] font-medium leading-snug text-text-hi">
                  {s.heading}
                </h2>
                {s.paras?.map((p) => (
                  <p key={p} className="mt-4 text-[0.9375rem] leading-relaxed text-text-mid">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 flex flex-col gap-3">
                    {s.list.map((li) => (
                      <li
                        key={li}
                        className="flex gap-3 text-[0.9375rem] leading-relaxed text-text-mid"
                      >
                        <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-text-lo" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-edge pt-8">
            <Link href={other.href} className="label text-teal transition-opacity hover:opacity-70">
              {other.label} &rarr;
            </Link>
            <a
              href={`mailto:${CONTACT.email}`}
              className="label text-text-lo transition-colors hover:text-text-hi"
            >
              {CONTACT.email}
            </a>
            <button
              onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1 }) : window.scrollTo(0, 0))}
              className="label ml-auto text-text-lo transition-colors hover:text-text-hi"
            >
              Back to top
            </button>
          </div>

          <p className="label mt-12 text-text-lo">
            &copy; {new Date().getFullYear()} {BRAND.legal}
          </p>
        </div>
      </main>
    </div>
  );
}

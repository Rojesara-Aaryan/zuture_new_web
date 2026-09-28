import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/data/site";

/**
 * 404.
 *
 * Anyone arriving here followed a dead link, most likely an old zuture.co
 * address this site does not redirect. Rather than a bare error, it gives them
 * the pages they were most likely after. Next serves it with a real 404 status
 * and marks it noindex, so it never competes with the pages it points to.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const WAYS = [
  { href: "/", label: "Home", note: "What Zuture is, and why indoor air needs more than a purifier" },
  { href: "/system", label: "The system", note: "How it filters, brings in fresh air and decides" },
  { href: "/models", label: "The models", note: "Z-ACTIVE and Z-PURE, compared" },
  { href: "/faq", label: "FAQ", note: "Indoor air, CO2, HEPA, installation" },
  { href: "/about", label: "Reserve yours", note: "Free, no payment, not binding" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void">
      <header className="gutter flex items-center justify-between border-b border-edge py-5">
        <Link href="/" className="relative block h-[22px] w-[97px] shrink-0" aria-label="Zuture — home">
          <Image src="/brand/logo-colour.png" alt="Zuture" fill priority sizes="120px" className="object-contain object-left" />
        </Link>
      </header>

      <main className="gutter py-20 sm:py-28">
        <p className="label text-text-lo">404</p>
        <h1 className="display mt-6 max-w-[14ch] text-[clamp(2.4rem,7vw,5.5rem)] text-text-hi">
          Nothing to breathe here.
        </h1>
        <p className="mt-6 max-w-[48ch] text-[0.95rem] leading-relaxed text-text-mid">
          This page does not exist, or has moved. One of these is probably what you were looking for.
        </p>

        <ul className="mt-14 max-w-3xl border-t border-edge">
          {WAYS.map((w) => (
            <li key={w.href} className="border-b border-edge">
              <Link
                href={w.href}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <span className="text-lg font-medium text-text-hi transition-colors group-hover:text-fresh">
                  {w.label}
                </span>
                <span className="text-sm text-text-mid">{w.note}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-text-lo">
          Or write to{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-text-hi underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </main>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND, CONTACT } from "@/data/site";

export default function Footer() {
  return (
    <footer className="relative bg-void gutter pb-10 pt-24 sm:pt-32">
      <div className="grid gap-10 border-t border-edge pt-10 max-sm:grid-cols-2 max-sm:gap-x-6 max-sm:gap-y-9 sm:grid-cols-2 lg:grid-cols-5">
        <div className="max-sm:col-span-2">
          <Image
            src="/brand/logo-colour.png"
            alt="Zuture"
            width={300}
            height={68}
            className="h-5 w-auto"
          />
          <p className="label mt-5 text-text-lo">{BRAND.legal}</p>
          <p className="label mt-1 text-text-lo">
            {BRAND.claim} {BRAND.category}
          </p>
        </div>

        <div>
          <p className="label text-text-lo">Headquarters</p>
          <a
            href={CONTACT.map}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm leading-relaxed text-text-mid transition-colors hover:text-text-hi"
          >
            {CONTACT.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </a>
        </div>

        <div>
          <p className="label text-text-lo">Enquiries</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-3 block text-sm text-text-hi transition-colors hover:text-fresh"
          >
            {CONTACT.email}
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="mt-1.5 block text-sm text-text-mid transition-colors hover:text-text-hi"
          >
            {CONTACT.phone}
          </a>
          <p className="mt-2 text-xs text-text-lo">{CONTACT.hours}</p>
        </div>

        <div>
          <p className="label text-text-lo">Legal</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-text-mid transition-colors hover:text-text-hi"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-text-mid transition-colors hover:text-text-hi"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label text-text-lo">Elsewhere</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {CONTACT.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-mid transition-colors hover:text-text-hi"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-edge pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-text-lo">
          &copy; {new Date().getFullYear()} {BRAND.legal} &middot; Made in India
        </p>
        <p className="label text-text-lo">
          {BRAND.patent} &middot; Est. {BRAND.founded}
        </p>
      </div>
    </footer>
  );
}

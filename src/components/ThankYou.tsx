"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONTACT, DEVELOPMENT, MODELS } from "@/data/site";
import { WITHDRAW_MAILTO } from "@/data/legal";
import SectionHead from "./ui/SectionHead";

const ACCENT = { fresh: "#36cc00", recirc: "#00c8ff" } as const;

/**
 * Where a reservation lands.
 *
 * A page of its own, rather than a message swapped into the form, so a
 * completed reservation is a page view analytics can count, and so a refresh
 * or the back button cannot resubmit. Every promise here is one the site
 * already makes in the reservation copy and the Terms — nothing more.
 */
export default function ThankYou() {
  const core = useSearchParams().get("core");
  const model = MODELS.find((m) => m.id === core);
  const accent = model ? ACCENT[model.accent] : ACCENT.fresh;

  const next = [
    ["Nothing to pay", "No payment has been taken, and the reservation is not binding."],
    ["We will be in touch", "Before we ship, we will contact you with pricing, lead time and a fitting date."],
    ["Specification first", DEVELOPMENT.note.replace("Reserve a unit and you", "You")],
  ] as const;

  return (
    <section className="relative bg-void pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="gutter">
        <SectionHead
          as="h1"
          label="Reservation received"
          heading={
            <>
              <span style={{ color: accent }}>Reserved.</span>{" "}
              <span className="display-em text-text-mid">We have your details.</span>
            </>
          }
          lead={
            model
              ? `Your reservation for a Zuture ${model.name} (${model.edition}) is in, for the first batch.`
              : "Your reservation is in, for the first batch."
          }
        />

        <ul className="mt-16 grid border-t border-edge md:grid-cols-3">
          {next.map(([title, body], i) => (
            <li
              key={title}
              className="border-b border-edge py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <h2 className="label" style={{ color: accent }}>
                {title}
              </h2>
              <p className="mt-4 max-w-[40ch] text-[0.95rem] leading-relaxed text-text-mid">
                {body}
                {i === 0 && (
                  <>
                    {" "}
                    <a href={WITHDRAW_MAILTO} className="text-text-hi underline underline-offset-2">
                      Withdraw it
                    </a>{" "}
                    with one email, at any time.
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-12 max-w-[56ch] text-sm leading-relaxed text-text-lo">
          Something to add or change? Email{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-text-mid underline underline-offset-2 hover:text-text-hi">
            {CONTACT.email}
          </a>{" "}
          or call {CONTACT.phone}.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/faq"
            className="label rounded-full border border-edge-bright px-6 py-3 text-text-hi transition-colors hover:border-fresh hover:text-fresh"
          >
            Questions &amp; answers
          </Link>
          <Link
            href="/"
            className="label rounded-full border border-edge-bright px-6 py-3 text-text-hi transition-colors hover:border-fresh hover:text-fresh"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

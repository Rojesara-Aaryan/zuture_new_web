"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Image from "next/image";
import Link from "next/link";
import { MODELS, RESERVE, SHOT } from "@/data/site";
import Reveal from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";

type Status = "idle" | "sending" | "done" | "error";

const ACCENT = { fresh: "#36cc00", recirc: "#00c8ff" } as const;

export default function Reserve() {
  const root = useRef<HTMLElement>(null);
  // MODELS is `as const`, so infer the union rather than the first literal.
  const [model, setModel] = useState<(typeof MODELS)[number]["id"]>(MODELS[0].id);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const chosen = MODELS.find((m) => m.id === model) ?? MODELS[0];
  const accent = ACCENT[chosen.accent];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".reserve-field",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          scrollTrigger: { trigger: ".reserve-form", start: "top 82%", once: true },
        },
      );
    },
    { scope: root },
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email ?? ""))) {
      setError("Enter a valid email address");
      setStatus("error");
      return;
    }
    if (String(data.name ?? "").trim().length < 2) {
      setError("Enter your name");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      // TODO(zuture): point this at the same CRM the live enquiry form uses.
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, model }),
      });
      setStatus(res.ok ? "done" : "error");
      if (!res.ok) setError("Something went wrong. Try again, or email us.");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again, or email us.");
    }
  }

  return (
    <section
      id="reserve"
      ref={root}
      className="grain relative overflow-hidden bg-void pt-24 sm:pt-32"
    >
      <div aria-hidden className="absolute inset-0">
        <Image
          src={SHOT.reserve}
          alt=""
          fill
          quality={95}
          sizes="100vw"
          className="object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-r from-void via-void/90 to-void/50" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full blur-[130px] transition-colors duration-700"
        style={{ backgroundColor: accent, opacity: 0.1 }}
      />

      <div className="relative gutter">
        <p className="label text-text-lo">{RESERVE.eyebrow}</p>

        <Reveal as="h2" className="display mt-6 max-w-[11ch] text-[clamp(2.4rem,6.6vw,5.25rem)]">
          {RESERVE.title}
        </Reveal>

        <div className="mt-12 grid gap-14 border-t border-edge pt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal
              as="p"
              split="words"
              className="max-w-[44ch] text-[0.95rem] leading-relaxed text-text-mid sm:text-lg"
            >
              {RESERVE.body}
            </Reveal>
            <p className="label mt-8 text-teal">{RESERVE.note}</p>
          </div>

          {status === "done" ? (
            <div role="status" className="border-t-2 pt-8" style={{ borderColor: accent }}>
              <p className="display text-[clamp(1.35rem,2.6vw,2.1rem)]" style={{ color: accent }}>
                Reserved.
              </p>
              <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-text-mid">
                Your place in the first batch is held. We will be in touch with pricing, lead time
                and a fitting date before we ship.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="reserve-form">
              {/* Model */}
              <fieldset className="reserve-field">
                <legend className="label text-text-lo">Choose a core</legend>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {MODELS.map((m) => {
                    const on = m.id === model;
                    const c = ACCENT[m.accent];
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModel(m.id)}
                        aria-pressed={on}
                        className="flex flex-col items-start rounded-lg border p-4 text-left transition-colors duration-300"
                        style={{
                          borderColor: on ? c : "#2b3138",
                          backgroundColor: on ? `${c}0f` : "transparent",
                        }}
                      >
                        <span
                          className="display text-[clamp(1.2rem,2.6vw,1.8rem)]"
                          style={{ color: on ? c : "#8a9197" }}
                        >
                          {m.name}
                        </span>
                        <span className="label mt-1.5 text-text-lo">{m.edition}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2">
                <Field name="name" label="Name" autoComplete="name" required className="reserve-field" />
                <Field name="email" label="Email" type="email" autoComplete="email" required className="reserve-field" />
                <Field name="phone" label="Phone" type="tel" autoComplete="tel" className="reserve-field" />
                <Field name="room_size" label="Room size (sq ft)" inputMode="numeric" placeholder="e.g. 400" className="reserve-field" />

                <div className="reserve-field sm:col-span-2">
                  <label htmlFor="space" className="label block text-text-lo">
                    Space type
                  </label>
                  <select
                    id="space"
                    name="space"
                    defaultValue=""
                    className="mt-3 w-full appearance-none border-b border-edge-bright bg-transparent pb-3 text-base text-text-hi outline-none transition-colors focus:border-teal"
                  >
                    <option value="" className="bg-ink">
                      Select a space
                    </option>
                    {RESERVE.spaces.map((s) => (
                      <option key={s} value={s} className="bg-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {status === "error" && (
                <p role="alert" className="label mt-6 text-[#ff5a36]">
                  {error}
                </p>
              )}

              <div className="reserve-field mt-9 flex flex-wrap items-center gap-5">
                <Magnetic strength={0.22}>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="label whitespace-nowrap rounded-full px-7 py-3.5 text-void transition-opacity duration-300 disabled:opacity-50"
                    style={{ backgroundColor: accent }}
                  >
                    {status === "sending" ? "Reserving…" : `Reserve ${chosen.name}`}
                  </button>
                </Magnetic>
                <p className="max-w-[34ch] text-xs leading-relaxed text-text-lo">
                  No payment now, and we only contact you about this reservation. By reserving you
                  agree to our{" "}
                  <Link href="/terms" className="text-text-mid underline underline-offset-2 hover:text-text-hi">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-text-mid underline underline-offset-2 hover:text-text-hi">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label block text-text-lo">
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="mt-3 w-full border-b border-edge-bright bg-transparent pb-3 text-base text-text-hi outline-none transition-colors placeholder:text-text-lo focus:border-teal"
      />
    </div>
  );
}

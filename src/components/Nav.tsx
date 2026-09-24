"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { NAV } from "@/data/site";
import Magnetic from "./ui/Magnetic";

const RESERVE = "/about#reserve";

export default function Nav({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!start) return;
      // The bar drops in, then its contents settle — otherwise the whole
      // header arrives as one slab and the motion reads as a jump.
      gsap
        .timeline()
        .fromTo(root.current, { yPercent: -110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9 })
        .fromTo(
          ".nav-item",
          { autoAlpha: 0, y: -10 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 },
          "-=0.45",
        );
    },
    { scope: root, dependencies: [start] },
  );

  useGSAP(
    () => {
      if (!menu.current) return;
      const links = menu.current.querySelectorAll(".menu-link");
      if (open) {
        lenis?.stop();
        gsap
          .timeline()
          .set(menu.current, { display: "flex" })
          .fromTo(
            menu.current,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "zutureIn" },
          )
          .fromTo(
            links,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.7, stagger: 0.06 },
            "-=0.35",
          );
      } else {
        lenis?.start();
        gsap.to(menu.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
          ease: "zutureIn",
          onComplete: () => gsap.set(menu.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open] },
  );

  /**
   * Links are now routes, not anchors, but two of them still carry a hash.
   *
   * A cross-page hash is left to the layout, which scrolls to it once the new
   * page has mounted. A hash on the page we are already on never triggers that
   * effect — the pathname does not change — so it is handled here instead.
   */
  const go = (href: string) => {
    setOpen(false);
    // Opening the mobile menu stops Lenis, and scrollTo is a no-op while it is
    // stopped. setOpen only restarts it on the next render, which is too late
    // for this call — so restart it here, before asking it to move.
    lenis?.start();

    const [path, hash] = href.split("#");
    const samePage = (path || "/") === pathname;

    if (hash && samePage) {
      const target = document.querySelector<HTMLElement>(`#${hash}`);
      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
        else target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (samePage && !hash) {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push(href);
  };

  return (
    <>
      <header ref={root} className="fixed inset-x-0 top-0 z-60 gutter py-5 opacity-0">
        {/* Display type scrolls under the header; this keeps both readable. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[190%]"
          style={{
            background: "linear-gradient(to bottom, var(--nav-scrim) 35%, transparent)",
          }}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={() => go("/")}
            aria-label="Zuture — home"
            className="nav-item relative block h-[22px] w-[97px] shrink-0"
          >
            <Image
              src="/brand/logo-colour.png"
              alt="Zuture"
              fill
              priority
              sizes="120px"
              className="logo-light object-contain object-left"
            />
            <Image
              src="/brand/logo-black.png"
              alt=""
              fill
              sizes="120px"
              className="logo-dark absolute inset-0 object-contain object-left"
            />
          </button>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.href;
              return (
                <button
                  key={n.href}
                  onClick={() => go(n.href)}
                  aria-current={active ? "page" : undefined}
                  className={`nav-item label transition-colors duration-300 hover:text-(--nav-fg) ${
                    active ? "text-(--nav-fg)" : "chrome-dim"
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.28} className="nav-item hidden sm:block">
              <button
                onClick={() => go(RESERVE)}
                className="label chrome-fg chrome-edge rounded-full border px-5 py-2.5 transition-colors duration-300 hover:bg-fresh hover:text-void hover:border-fresh"
              >
                Reserve yours
              </button>
            </Magnetic>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="nav-item chrome-fg chrome-edge relative flex h-10 w-10 flex-col items-center justify-center gap-1.25 rounded-full border md:hidden"
            >
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-0.75 rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-0.75 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        className="fixed inset-0 z-55 hidden flex-col justify-center gutter bg-ink"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        {[...NAV, { label: "Reserve yours", href: RESERVE }].map((n) => (
          <div key={n.href} className="overflow-hidden py-1.5">
            <button
              onClick={() => go(n.href)}
              className="menu-link display block text-left text-[11vw] text-text-hi"
            >
              {n.label}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

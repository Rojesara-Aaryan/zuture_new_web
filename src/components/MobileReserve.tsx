"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";

const RESERVE = "/about#reserve";

/**
 * The reservation button, pinned to the bottom of the screen on phones.
 *
 * Below `sm` the header has no room for "Reserve yours" and it lives inside
 * the menu, so without this a phone visitor never sees a call to action unless
 * they go looking. It is `sm:hidden`: tablets and desktop keep the header
 * button and never render this.
 *
 * It stays out of the way: it waits for the intro, and it slides off whenever
 * the reservation form or the footer is on screen — there is nothing to point
 * at once the form is right there — and on the thank-you page.
 */
export default function MobileReserve({ start }: { start: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById("reserve"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const onScreen = new Set<Element>();
    // The observer reports every target once on attach, so `covered` is
    // correct for the new page without being reset here.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setCovered(onScreen.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  const hidden = !start || covered || pathname === "/thank-you";

  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const form = pathname === "/about" ? document.getElementById("reserve") : null;
    if (!form) return router.push(RESERVE); // the layout scrolls to the hash
    if (lenis) lenis.scrollTo(form, { offset: -20, duration: 1.2 });
    else form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      inert={hidden}
      className={`fixed inset-x-0 bottom-0 z-50 gutter pb-[max(1rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-500 ease-out motion-reduce:transition-none sm:hidden ${
        hidden ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Link
        href={RESERVE}
        onClick={go}
        className="label flex w-full items-center justify-between rounded-full bg-fresh px-6 py-3.5 text-void shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)]"
      >
        <span>Reserve yours</span>
        <span className="opacity-70">Free · no payment</span>
      </Link>
    </div>
  );
}

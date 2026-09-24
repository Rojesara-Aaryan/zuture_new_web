"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "@/lib/gsap";
import ProtectMedia from "./ProtectMedia";
import Preloader from "./Preloader";
import Nav from "./Nav";
import ScrollProgress from "./ScrollProgress";
import Footer from "./Footer";

/**
 * True once the intro has finished and the page is allowed to animate.
 *
 * This is a context rather than a prop because the chrome now lives in the
 * layout and the hero lives in a page, so there is no longer a component that
 * renders both and could pass it down.
 */
const ReadyContext = createContext(false);
export const useReady = () => useContext(ReadyContext);

/**
 * Everything that persists across routes: the intro, the header, the progress
 * rule and the footer. Keeping these in the layout means navigating between
 * pages never replays the preloader or re-animates the header.
 */
export default function Chrome({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    document.documentElement.classList.add("anim-ready");

    // Pinned sections measure in pixels; late-loading images and webfonts
    // move every boundary underneath them. Re-measure once both have settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => window.removeEventListener("load", refresh);
  }, []);

  /**
   * Next resets the scroll position itself, but Lenis keeps its own and would
   * happily smooth-scroll back to where the previous page was. Reset it, then
   * re-measure, because every trigger on the new page is being created around
   * now and the old page's have just been killed.
   */
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;

    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.2 });
      else target.scrollIntoView();
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [pathname, lenis]);

  return (
    <ReadyContext.Provider value={ready}>
      <ProtectMedia />
      <Preloader onDone={() => setReady(true)} />
      <ScrollProgress />
      <Nav start={ready} />
      <main>{children}</main>
      <Footer />
    </ReadyContext.Provider>
  );
}

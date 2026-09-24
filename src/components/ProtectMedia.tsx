"use client";

import { useEffect } from "react";

/**
 * Deterrents against casually saving the product imagery.
 *
 * Read this before relying on it: you cannot actually prevent someone
 * downloading an image that a browser has rendered. Anyone can open devtools,
 * read the network tab, or press the screenshot key. This blocks the three
 * paths a normal visitor would take — right-click > save, drag-to-desktop, and
 * long-press > add to photos — and nothing more. The real protections are the
 * copyright notice in the Terms and only publishing what you are willing to
 * have copied.
 *
 * Deliberately not blocked: keyboard shortcuts and devtools. Those scripts
 * break accessibility tools and legitimate use, are bypassed in seconds, and
 * make a site feel hostile.
 */
export default function ProtectMedia() {
  useEffect(() => {
    const isMedia = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("img, picture, svg, video, [data-protect]");

    const onContextMenu = (e: MouseEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    // Covers drag-to-desktop and drag-into-another-tab.
    const onDragStart = (e: DragEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    // Safari/iOS fires this before showing the save sheet.
    const onSelectStart = (e: Event) => {
      if (isMedia(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("selectstart", onSelectStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("selectstart", onSelectStart);
    };
  }, []);

  return null;
}

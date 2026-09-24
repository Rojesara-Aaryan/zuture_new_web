"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

  CustomEase.create("zuture", "0.16, 1, 0.3, 1");
  CustomEase.create("zutureIn", "0.83, 0, 0.17, 1");

  gsap.defaults({ ease: "zuture", duration: 1 });
  registered = true;
}

registerGsap();

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };

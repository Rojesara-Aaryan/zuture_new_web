import type { Metadata } from "next";
import { PAGE_SEO, pageMeta } from "@/lib/seo";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Case from "@/components/Case";
import BlindSpot from "@/components/BlindSpot";
import Aperture from "@/components/Aperture";
import NextUp from "@/components/ui/NextUp";

export const metadata: Metadata = pageMeta(PAGE_SEO.home);

export default function Page() {
  return (
    <>
      <Hero />
      <Marquee />
      <Case />
      <BlindSpot />
      <Aperture />
      <NextUp from="/" />
    </>
  );
}

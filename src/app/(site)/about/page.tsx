import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, PAGE_SEO, pageMeta } from "@/lib/seo";
import About from "@/components/About";
import Reserve from "@/components/Reserve";

export const metadata: Metadata = pageMeta(PAGE_SEO.about);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "About", path: "/about" }])} />
      <About />
      <Reserve />
    </>
  );
}

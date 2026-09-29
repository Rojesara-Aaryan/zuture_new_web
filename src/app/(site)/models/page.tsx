import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, PAGE_SEO, pageMeta, productsLd, webPageLd } from "@/lib/seo";
import Models from "@/components/Models";
import NextUp from "@/components/ui/NextUp";

export const metadata: Metadata = pageMeta(PAGE_SEO.models);

export default function Page() {
  return (
    <>
      <JsonLd data={[webPageLd(PAGE_SEO.models), ...productsLd, breadcrumbLd([{ name: "The models", path: "/models" }])]} />
      <Models />
      <NextUp from="/models" />
    </>
  );
}

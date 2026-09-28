import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, PAGE_SEO, pageMeta } from "@/lib/seo";
import Treatment from "@/components/Treatment";
import AirPath from "@/components/AirPath";
import Advantage from "@/components/Advantage";
import NextUp from "@/components/ui/NextUp";

export const metadata: Metadata = pageMeta(PAGE_SEO.system);

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "The system", path: "/system" }])} />
      <Treatment />
      <AirPath />
      <Advantage />
      <NextUp from="/system" />
    </>
  );
}

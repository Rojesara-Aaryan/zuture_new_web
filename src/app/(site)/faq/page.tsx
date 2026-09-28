import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Faq from "@/components/Faq";
import { FAQ_FLAT } from "@/data/faq";
import { breadcrumbLd, faqLd, PAGE_SEO, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(PAGE_SEO.faq);

export default function Page() {
  return (
    <>
      {/* The same questions and answers that are on the page, word for word —
          structured data must match visible content or it is ignored. */}
      <JsonLd data={[faqLd(FAQ_FLAT), breadcrumbLd([{ name: "FAQ", path: "/faq" }])]} />
      <Faq />
    </>
  );
}

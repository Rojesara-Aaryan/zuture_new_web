import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PRIVACY } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Zuture",
  description:
    "What Zuture does with personal data collected through this pre-launch website.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <LegalPage
      title={PRIVACY.title}
      intro={PRIVACY.intro}
      sections={PRIVACY.sections}
      other={{ href: "/terms", label: "Terms & Conditions" }}
    />
  );
}

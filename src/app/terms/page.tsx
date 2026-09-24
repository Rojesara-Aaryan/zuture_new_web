import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { TERMS } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — Zuture",
  description:
    "Terms governing use of the Zuture pre-launch website and reservation enquiries.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <LegalPage
      title={TERMS.title}
      intro={TERMS.intro}
      sections={TERMS.sections}
      other={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}

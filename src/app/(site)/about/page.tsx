import type { Metadata } from "next";
import About from "@/components/About";
import Reserve from "@/components/Reserve";

export const metadata: Metadata = {
  title: "About — Zuture",
  description:
    "Who is building Zuture, where, and how far along it is. Reserve yours before launch.",
};

export default function Page() {
  return (
    <>
      <About />
      <Reserve />
    </>
  );
}

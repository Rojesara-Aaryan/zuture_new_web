import type { Metadata } from "next";
import Models from "@/components/Models";
import NextUp from "@/components/ui/NextUp";

export const metadata: Metadata = {
  title: "The models — Zuture",
  description:
    "Z-ACTIVE and Z-PURE: one platform built two ways. Z-ACTIVE brings treated outside air in. Z-PURE treats the air already in the room.",
};

export default function Page() {
  return (
    <>
      <Models />
      <NextUp from="/models" />
    </>
  );
}

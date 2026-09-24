import type { Metadata } from "next";
import Treatment from "@/components/Treatment";
import AirPath from "@/components/AirPath";
import Advantage from "@/components/Advantage";
import NextUp from "@/components/ui/NextUp";

export const metadata: Metadata = {
  title: "The system — Zuture",
  description:
    "Filter, replace, condition, decide. How one wall-mounted unit treats the air in a room, the path the air takes through it, and how that compares with a purifier or with ventilation.",
};

export default function Page() {
  return (
    <>
      <Treatment />
      <AirPath />
      <Advantage />
      <NextUp from="/system" />
    </>
  );
}

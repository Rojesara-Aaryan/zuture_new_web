import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYou from "@/components/ThankYou";

/**
 * After a reservation. Kept out of search (and out of the sitemap): it only
 * makes sense to someone who has just reserved, and each visit to it is the
 * count of completed reservations in analytics.
 */
export const metadata: Metadata = {
  title: "Reservation received",
  description: "Your Zuture reservation has been received. No payment taken.",
  robots: { index: false, follow: true },
};

export default function Page() {
  // ThankYou reads ?core= from the URL, which is only known in the browser;
  // the boundary lets the rest of the page prerender as static HTML.
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
}

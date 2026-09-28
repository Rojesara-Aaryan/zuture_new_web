import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { BRAND } from "@/data/site";
import { KEYWORDS, OG_IMAGE, SITE_URL, organizationLd, websiteLd } from "@/lib/seo";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // Resolves every relative URL below — canonicals, Open Graph, sitemap.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zuture — Intelligent Air Treatment System, Made in India",
    template: "%s | Zuture",
  },
  description:
    "India's 1st intelligent air treatment system: one wall-mounted unit that filters air, brings in fresh air and decides which your room needs. Launching soon.",
  applicationName: "Zuture",
  keywords: KEYWORDS,
  authors: [{ name: BRAND.legal, url: SITE_URL }],
  creator: BRAND.legal,
  publisher: BRAND.legal,
  category: "technology",
  // Name and status-bar style when the site is saved to an iPhone home screen.
  appleWebApp: { capable: true, title: "Zuture", statusBarStyle: "black-translucent" },
  // Stops iOS turning the phone number and address into blue links that
  // ignore the design; they are already real links where they should be.
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Pages without their own openGraph (the policy pages) inherit this.
  openGraph: { type: "website", siteName: "Zuture", locale: "en_IN", images: [OG_IMAGE] },
  twitter: {
    card: "summary_large_image",
    site: "@ZutureCO",
    creator: "@ZutureCO",
    images: [OG_IMAGE],
  },
  // Search Console ownership, via the HTML-tag method. Set the env var to the
  // content value Search Console gives you; nothing is emitted until you do.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  // Geographic targeting: an Indian company, selling in India first.
  other: { "geo.region": "IN-GJ", "geo.placename": "Ahmedabad, Gujarat, India" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-text-hi">
        {/* Who Zuture is, site-wide: what search and AI engines use to
            recognise the brand as one entity across every page. */}
        <JsonLd data={[organizationLd, websiteLd]} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

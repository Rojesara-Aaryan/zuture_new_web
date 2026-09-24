import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zuture — Launching soon",
  description:
    "India's 1st intelligent air treatment system. Not a purifier: one small wall-mounted unit that filters, replaces and conditions the air in a room, and decides which it needs. Z-ACTIVE and Z-PURE, launching soon.",
  openGraph: {
    title: "Zuture — Launching soon",
    description:
      "One small system that treats the air in a room, and decides how. India's 1st intelligent air treatment system, launching soon.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void text-text-hi">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

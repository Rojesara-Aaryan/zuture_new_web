import type { NextConfig } from "next";
import path from "node:path";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 *
 * Next and the JSON-LD blocks rely on inline scripts, so 'unsafe-inline' stays
 * for scripts and styles; what this policy buys is that nothing loads from, or
 * sends data to, anywhere but this site and EmailJS. There are no third-party
 * scripts, fonts are self-hosted by next/font, and the one outside connection is
 * the browser posting a reservation to api.emailjs.com. Vercel Analytics is
 * served from this site's own /_vercel/insights path, so 'self' covers it in
 * production; in development it loads a debug script from va.vercel-scripts.com.
 * 'unsafe-eval' is only needed by the dev server.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // api.emailjs.com: reservations are sent from the browser (lib/reservation.ts).
  `connect-src 'self' https://api.emailjs.com${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Same HSTS policy the live zuture.co already sends.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root; a stray lockfile in the parent dir otherwise
  // makes Turbopack guess wrong.
  turbopack: { root: path.resolve(".") },
  poweredByHeader: false,
  images: {
    // Next 16 defaults to [75] only; product renders need higher fidelity.
    qualities: [75, 90, 95, 100],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  /**
   * The live zuture.co has been indexed at these addresses (they are in its
   * sitemap). When this site replaces it on the same domain, each must land
   * somewhere sensible with a permanent redirect, or the rankings and inbound
   * links those URLs have earned are thrown away as 404s. /about, /faq,
   * /privacy and /terms exist here already and need nothing.
   */
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/product-inquiry", destination: "/about", permanent: true },
      { source: "/support-ticket", destination: "/faq", permanent: true },
      { source: "/blog", destination: "/faq", permanent: true },
      { source: "/returns", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;

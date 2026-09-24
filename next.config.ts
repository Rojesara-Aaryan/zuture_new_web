import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root; a stray lockfile in the parent dir otherwise
  // makes Turbopack guess wrong.
  turbopack: { root: path.resolve(".") },
  images: {
    // Next 16 defaults to [75] only; product renders need higher fidelity.
    qualities: [75, 90, 95, 100],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

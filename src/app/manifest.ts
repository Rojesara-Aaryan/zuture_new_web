import type { MetadataRoute } from "next";
import { DEFINITION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zuture — Intelligent Air Treatment System",
    short_name: "Zuture",
    description: DEFINITION,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["lifestyle", "utilities", "health"],
    lang: "en-IN",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

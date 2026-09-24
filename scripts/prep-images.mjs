/**
 * One-off: turn DATA/NEW_IMG into public/shot.
 *
 * The originals are only 1672x941 (~1.6MP). A full-bleed background on a
 * 1440px viewport at DPR2 needs 2880 device pixels, so the seven images used
 * full-bleed are enlarged with Lanczos and sharpened. That does not invent
 * detail — it just beats letting the browser do a cheap enlargement at paint
 * time. If you can re-export the originals at 2880px or more, do that and drop
 * the FULL_BLEED upscale below.
 *
 *   npm i -D sharp && node scripts/prep-images.mjs
 */
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "DATA/NEW_IMG";
const OUT = "public/shot";

const MAP = {
  "ChatGPT Image Sep 24, 2026, 02_19_53 PM.png": "hero-halo",
  "ChatGPT Image Sep 24, 2026, 02_12_49 PM.png": "shaft",
  "ChatGPT Image Sep 24, 2026, 02_24_38 PM.png": "unit-reflect",
  "ChatGPT Image Sep 24, 2026, 02_22_59 PM.png": "unit-dark",
  "ChatGPT Image Sep 24, 2026, 02_35_50 PM.png": "unit-studio",
  "ChatGPT Image Sep 24, 2026, 02_40_13 PM.png": "unit-void",
  "ChatGPT Image Sep 24, 2026, 01_00_01 PM.png": "unit-front",
  "ChatGPT Image Sep 24, 2026, 02_45_05 PM.png": "grille-sweep",
  "ChatGPT Image Sep 24, 2026, 03_04_46 PM.png": "grille-corner",
  "ChatGPT Image Sep 24, 2026, 03_00_58 PM.png": "grille-backlit",
  "ChatGPT Image Sep 24, 2026, 02_49_36 PM.png": "grille-chevron",
  "ChatGPT Image Sep 24, 2026, 02_58_40 PM.png": "edge-soft",
  "ChatGPT Image Sep 24, 2026, 02_51_25 PM.png": "latch",
  "ChatGPT Image Sep 24, 2026, 02_48_00 PM.png": "panel",
  "ChatGPT Image Sep 24, 2026, 02_57_19 PM.png": "corner-top",
};

/** Displayed edge to edge, so these need the extra pixels. */
const FULL_BLEED = new Set([
  "hero-halo", "edge-soft", "shaft",
  "corner-top", "grille-chevron", "grille-corner", "panel",
]);

await fs.mkdir(OUT, { recursive: true });
let total = 0;

async function write(pipeline, name) {
  if (FULL_BLEED.has(name)) {
    pipeline = pipeline
      .resize({ width: 2880, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 2.5 });
  } else {
    pipeline = pipeline.sharpen({ sigma: 0.7, m1: 0.5, m2: 2 });
  }
  const out = `${OUT}/${name}.webp`;
  await pipeline.webp({ quality: 92, effort: 6 }).toFile(out);
  const { size } = await fs.stat(out);
  total += size;
  console.log(name.padEnd(16), (size / 1024).toFixed(0) + "kb");
}

for (const [file, name] of Object.entries(MAP)) {
  await write(sharp(`${SRC}/${file}`), name);
}

// The case column wants a square with the unit filling it. Cropping here beats
// a CSS scale, which would only magnify a smaller served file.
await write(
  sharp(`${SRC}/ChatGPT Image Sep 24, 2026, 01_00_01 PM.png`).extract({
    left: 515, top: 160, width: 620, height: 620,
  }),
  "case-unit",
);

console.log("total", (total / 1024 / 1024).toFixed(2) + "MB");

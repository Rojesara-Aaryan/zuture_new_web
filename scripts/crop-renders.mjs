/**
 * One-off: crop the turntable renders to a single shared alpha bounding box.
 * A shared box (not per-frame) keeps the subject from drifting as the orbit
 * crossfades. Transparency is preserved so the product works on any backdrop.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const SRC = ["447", "448", "449", "450", "451", "452", "453", "454"].map(
  (n) => `DATA/PRODUCT/ZutureRender.${n}.png`,
);

let box = null;
const hashes = [];

for (const file of SRC) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });

  hashes.push(crypto.createHash("md5").update(data).digest("hex").slice(0, 8));

  let minX = info.width, minY = info.height, maxX = -1, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  box = box
    ? { minX: Math.min(box.minX, minX), minY: Math.min(box.minY, minY),
        maxX: Math.max(box.maxX, maxX), maxY: Math.max(box.maxY, maxY) }
    : { minX, minY, maxX, maxY };
}

console.log("alpha-silhouette hashes:", hashes.join(" "));

const meta = await sharp(SRC[0]).metadata();
const padX = Math.round((box.maxX - box.minX) * 0.05);
const padY = Math.round((box.maxY - box.minY) * 0.05);
const left = Math.max(0, box.minX - padX);
const top = Math.max(0, box.minY - padY);
const region = {
  left,
  top,
  width: Math.min(meta.width - left, box.maxX + padX - left),
  height: Math.min(meta.height - top, box.maxY + padY - top),
};
console.log("shared crop:", region);

for (let i = 0; i < SRC.length; i++) {
  const out = `public/product/frame-0${i + 1}.png`;
  await sharp(SRC[i]).extract(region).png({ compressionLevel: 9 }).toFile(out + ".tmp");
  await fs.rename(out + ".tmp", out);
  const st = await fs.stat(out);
  console.log(out, (st.size / 1024).toFixed(0) + "kb");
}

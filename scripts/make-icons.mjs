/**
 * Generate the site icons from the Zuture mark.
 *
 *   node scripts/make-icons.mjs
 *
 * Next's App Router picks these up by filename — no <link> tags needed:
 *   src/app/favicon.ico    the classic one, still what tabs and bookmarks use
 *   src/app/icon.png       512px, for everything modern
 *   src/app/apple-icon.png 180px, for an iOS home screen
 *
 * The mark is a gradient shape with transparent corners. iOS does not respect
 * transparency — it composites onto white, which would leave a pale halo around
 * a shape designed for dark — so the Apple icon alone is flattened onto the
 * brand's near-black with a little breathing room.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "public/brand/mark.png";
const VOID = { r: 8, g: 9, b: 10, alpha: 1 };

await sharp(SRC).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/icon.png");

await sharp({
  create: { width: 180, height: 180, channels: 4, background: VOID },
})
  .composite([
    {
      input: await sharp(SRC)
        .resize(140, 140, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer(),
      gravity: "centre",
    },
  ])
  .png()
  .toFile("src/app/apple-icon.png");

/**
 * A .ico is a tiny container. Modern ones may hold a PNG verbatim, so this
 * writes the 6-byte directory header, one 16-byte entry, then the PNG itself —
 * which avoids pulling in a dependency just to reformat one image.
 */
const png = await sharp(SRC)
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // palette size, 0 for truecolour
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // colour planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(header.length + entry.length, 12); // offset to the data

writeFileSync("src/app/favicon.ico", Buffer.concat([header, entry, png]));

console.log("icon.png 512  apple-icon.png 180  favicon.ico 32");

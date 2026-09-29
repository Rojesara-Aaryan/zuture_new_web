/**
 * Writes the copyright notice INTO every image the site serves as-is.
 *
 *   node scripts/stamp-copyright.mjs
 *
 * A photograph saved from the site, or found by reverse image search, then
 * still says who owns it: WebP files get an EXIF block (Artist, Copyright), PNG
 * files get "Author" and "Copyright" text chunks. Both are added by rewriting
 * the file container only — the compressed image data is copied byte for byte,
 * so nothing is re-encoded and not a pixel changes. Already-stamped files are
 * skipped, so it is safe to run again after adding images (run it after
 * prep-images.mjs, which writes files without metadata).
 *
 * Next's image optimiser re-encodes what it serves and drops metadata, so this
 * protects the originals under /public and the icons, not the resized copies.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import sharp from "sharp";

// sharp keeps files it has read open (and cached); on Windows that blocks the
// rewrite. Give it buffers only, and no cache.
sharp.cache(false);
const pixels = (f) => sharp(fs.readFileSync(f)).raw().toBuffer();

const year = new Date().getFullYear();
// EXIF text must be plain ASCII: no "©" and no en dash.
const COPYRIGHT = `Copyright 2021-${year} Zuture Enterprise Pvt Ltd. All rights reserved. Unauthorised use prohibited. zuture.co/terms#copyright`;
const ARTIST = "Zuture Enterprise Pvt Ltd";

const FILES = [
  ...["public/shot", "public/brand", "public/og"].flatMap((d) =>
    fs.readdirSync(d).map((f) => path.join(d, f)),
  ),
  "public/og.png",
  "src/app/icon.png",
  "src/app/apple-icon.png",
].filter((f) => /\.(webp|png)$/i.test(f));

/** A minimal little-endian TIFF/EXIF block with two ASCII tags, sorted by tag. */
function exif() {
  const tags = [
    [0x013b, ARTIST],
    [0x8298, COPYRIGHT],
  ].map(([tag, text]) => [tag, Buffer.from(text + "\0", "ascii")]);
  const ifdSize = 2 + tags.length * 12 + 4;
  let dataAt = 8 + ifdSize;
  const head = Buffer.alloc(8 + ifdSize);
  head.write("II", 0, "ascii");
  head.writeUInt16LE(42, 2);
  head.writeUInt32LE(8, 4);
  head.writeUInt16LE(tags.length, 8);
  const data = [];
  tags.forEach(([tag, bytes], i) => {
    const at = 10 + i * 12;
    head.writeUInt16LE(tag, at);
    head.writeUInt16LE(2, at + 2); // ASCII
    head.writeUInt32LE(bytes.length, at + 4);
    head.writeUInt32LE(dataAt, at + 8); // every string here is > 4 bytes
    data.push(bytes);
    dataAt += bytes.length;
  });
  // next-IFD offset (last 4 bytes of the IFD) is already 0
  return Buffer.concat([head, ...data]);
}

function chunk(type, payload) {
  const h = Buffer.alloc(8);
  h.write(type, 0, "ascii");
  h.writeUInt32LE(payload.length, 4);
  return Buffer.concat([h, payload, payload.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)]);
}

async function stampWebp(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") throw new Error("not a WebP");

  // Split into chunks after the 12-byte RIFF header.
  const chunks = [];
  for (let at = 12; at + 8 <= buf.length; ) {
    const type = buf.toString("ascii", at, at + 4);
    const size = buf.readUInt32LE(at + 4);
    chunks.push({ type, raw: buf.subarray(at, at + 8 + size + (size % 2)) });
    at += 8 + size + (size % 2);
  }
  if (chunks.some((c) => c.type === "EXIF")) return "already";

  let vp8x = chunks.find((c) => c.type === "VP8X");
  if (vp8x) {
    const raw = Buffer.from(vp8x.raw);
    raw[8] |= 0x08; // EXIF present
    vp8x.raw = raw;
  } else {
    // Simple format → extended format: VP8X must come first, with the canvas size.
    const { width, height } = await sharp(buf).metadata();
    const p = Buffer.alloc(10);
    p[0] = 0x08; // EXIF present
    p.writeUIntLE(width - 1, 4, 3);
    p.writeUIntLE(height - 1, 7, 3);
    vp8x = { type: "VP8X", raw: chunk("VP8X", p) };
    chunks.unshift(vp8x);
  }
  chunks.push({ type: "EXIF", raw: chunk("EXIF", exif()) });

  const body = Buffer.concat([Buffer.from("WEBP", "ascii"), ...chunks.map((c) => c.raw)]);
  const riff = Buffer.alloc(8);
  riff.write("RIFF", 0, "ascii");
  riff.writeUInt32LE(body.length, 4);
  fs.writeFileSync(file, Buffer.concat([riff, body]));
  return "stamped";
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}

function stampPng(file) {
  const buf = fs.readFileSync(file);
  const text = buf.toString("latin1");
  if (text.includes("tEXtCopyright\0")) return "already";
  const iend = buf.lastIndexOf(Buffer.from("IEND", "ascii")) - 4; // back to the length field
  if (iend < 8) throw new Error("no IEND chunk");
  const add = [
    pngChunk("tEXt", Buffer.from(`Author\0${ARTIST}`, "latin1")),
    pngChunk("tEXt", Buffer.from(`Copyright\0${COPYRIGHT}`, "latin1")),
  ];
  fs.writeFileSync(file, Buffer.concat([buf.subarray(0, iend), ...add, buf.subarray(iend)]));
  return "stamped";
}

let failed = 0;
for (const f of FILES) {
  try {
    const before = await pixels(f);
    const result = f.endsWith(".webp") ? await stampWebp(f) : stampPng(f);
    // Prove the promise in the header comment: the decoded pixels are identical.
    const after = await pixels(f);
    if (!before.equals(after)) throw new Error("pixels changed");
    console.log(`${result.padEnd(8)} ${f}`);
  } catch (e) {
    failed++;
    console.error(`FAILED   ${f}: ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);

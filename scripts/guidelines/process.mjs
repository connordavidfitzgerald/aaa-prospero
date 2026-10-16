// Turns a Figma guideline extraction (see extract.js) into site data:
//   <in>/<brand>/pages/NN.json + assets/*  →  src/data/guidelines/<brand>.json
//                                            public/media/guidelines/<brand>/{*,t/*}
// Raster assets are re-encoded as WebP at twice their largest on-page size
// (and a small copy for the grid thumbnails); SVGs are set to stretch to their
// exact Figma bounds.
//
//   node scripts/guidelines/process.mjs <extraction dir> [brand...]
import sharp from "sharp";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const [inDir, ...only] = process.argv.slice(2);
const brands = only.length ? only : ["ccam", "ecozoic", "chimie"];

const eachNode = (nodes, fn) => {
  for (const n of nodes) {
    fn(n);
    if (n.kids) eachNode(n.kids, fn);
  }
};

for (const brand of brands) {
  const src = path.join(inDir, brand);
  const out = path.join("public/media/guidelines", brand);
  const files = (await readdir(path.join(src, "pages"))).filter((f) => f.endsWith(".json")).sort();
  const pages = await Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(src, "pages", f), "utf8"))));

  // Largest size each asset is drawn at, in page px (of 1920).
  const size = new Map();
  for (const p of pages)
    eachNode(p.nodes, (n) => {
      const s = n.src ?? n.bgImg?.src;
      if (s) size.set(s, Math.max(size.get(s) ?? 0, n.w, n.h));
    });

  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, "t"), { recursive: true });
  const renamed = new Map();
  let bytes = 0;
  for (const [name, longest] of size) {
    const from = path.join(src, "assets", name);
    const base = name.replace(/\.\w+$/, "");
    if (name.endsWith(".svg")) {
      // Figma rounds SVG canvases up to whole pixels; stretch to the exact bounds.
      const svg = (await readFile(from, "utf8")).replace("<svg ", '<svg preserveAspectRatio="none" ');
      await writeFile(path.join(out, name), svg);
      renamed.set(name, name);
      continue;
    }
    const img = sharp(from);
    const fit = (px) => ({ width: Math.round(px), height: Math.round(px), fit: "inside", withoutEnlargement: true });
    const full = await img.clone().resize(fit(Math.min(2400, longest * 2))).webp({ quality: 80 }).toBuffer();
    const thumb = await img.clone().resize(fit(Math.max(48, longest * 0.3))).webp({ quality: 70 }).toBuffer();
    await writeFile(path.join(out, `${base}.webp`), full);
    await writeFile(path.join(out, "t", `${base}.webp`), thumb);
    bytes += full.length + thumb.length;
    renamed.set(name, `${base}.webp`);
  }
  for (const p of pages)
    eachNode(p.nodes, (n) => {
      if (n.src) n.src = renamed.get(n.src);
      if (n.bgImg) n.bgImg.src = renamed.get(n.bgImg.src);
    });

  await mkdir("src/data/guidelines", { recursive: true });
  await writeFile(`src/data/guidelines/${brand}.json`, JSON.stringify(pages));
  console.log(`${brand}: ${pages.length} pages, ${size.size} assets, raster ${(bytes / 1e6).toFixed(1)} MB`);
}

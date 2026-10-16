# Guidelines from Figma

The CCAM, Ecozoic and chimie guideline pages (`/work/<brand>/guidelines`) are
HTML rebuilt from the Figma file "A.A.A - Shared", page CURRENT:

| Brand   | Section                     | Node         |
| ------- | --------------------------- | ------------ |
| ccam    | CCAM 2026 Season Guidelines | `1475:3912`  |
| ecozoic | L4E Brand Guidelines — v2   | `1401:1311`  |
| chimie  | chimie Brand Guidelines     | `1405:22355` |

To regenerate after editing the designs:

1. Start the receiver. The Figma bridge plugin may only reach localhost ports
   9223–9232, so pick a free one:

   ```
   node scripts/guidelines/receiver.mjs /tmp/guides 9230
   ```

2. With the Figma Desktop Bridge plugin open on the file, run this through the
   figma-console MCP (`figma_execute`), one section at a time. Progress is
   written to `/tmp/guides/<brand>/progress.txt` and ends with `DONE`.

   ```js
   const code = await (await fetch("http://localhost:9230/extract.js")).text();
   await new (Object.getPrototypeOf(async function () {}).constructor)(code)();
   return __guideRun("ccam", "1475:3912");
   ```

3. Turn the extraction into site data and assets:

   ```
   node scripts/guidelines/process.mjs /tmp/guides
   ```

Frames are ordered by their number ("2.1 Logo — Introduction"). The extractor
keeps text, fills, strokes and simple shapes as data. It exports photos as
images, and vector art and logo lockups as SVG or PNG. Section labels (FR/EN)
live in `src/data/guidelines.ts`.

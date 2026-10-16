// Local sink for figma_execute: POST /<relative path> writes the body to OUT.
import http from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const OUT = process.argv[2];
http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") return res.end();
    if (req.method === "GET") {
      try {
        return res.end(await readFile(path.join(path.dirname(new URL(import.meta.url).pathname), path.basename(req.url))));
      } catch {
        res.statusCode = 404;
        return res.end();
      }
    }
    const rel = decodeURIComponent(req.url.slice(1)).replace(/\.\./g, "");
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const file = path.join(OUT, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, Buffer.concat(chunks));
    res.end("ok " + rel);
  })
  .listen(Number(process.argv[3] || 9230), "::", () => console.log("listening"));

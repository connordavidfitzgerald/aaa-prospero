// One-off: copies the chimie and Ecozoic case studies out of the AAA Sanity
// dataset (the one aaa-next reads) into this repo. Images land in
// public/media/<dir>/NN.jpg; text, links and Mux playback IDs go to
// src/data/projects.json. Run with `node scripts/fetch-project-media.mjs`.
import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";

const sanity = createClient({ projectId: "0uc9cjxv", dataset: "production", apiVersion: "2024-01-01", useCdn: true });

const PROJECTS = { chimie: "chimie", ecozoic: "eco" };
const loc = (f, lang) => `${f}[language == "${lang}"][0].value`;

const QUERY = /* groq */ `
*[_type == "project" && slug.current == $slug][0]{
  client, date,
  "description": {"fr": coalesce(${loc("description", "fr")}, ${loc("description", "en")}), "en": ${loc("description", "en")}},
  "services": {"fr": coalesce(${loc("services", "fr")}, ${loc("services", "en")}), "en": ${loc("services", "en")}},
  "links": coalesce(links[]{"label": {"fr": coalesce(${loc("label", "fr")}, ${loc("label", "en")}), "en": ${loc("label", "en")}}, href}, []),
  "media": media[].items[]{
    _type == "mediaImage" => {"kind": "image", "src": image.asset->url, "alt": ${loc("alt", "en")}, "w": image.asset->metadata.dimensions.width, "h": image.asset->metadata.dimensions.height},
    _type == "mediaVideo" => {"kind": "video", "playbackId": coalesce(video.asset->playbackId, muxPlaybackId), "aspect": video.asset->data.aspect_ratio}
  }
}`;

const out = {};
for (const [slug, dir] of Object.entries(PROJECTS)) {
  const p = await sanity.fetch(QUERY, { slug });
  await mkdir(`public/media/${dir}`, { recursive: true });
  const media = [];
  let i = 0;
  for (const m of p.media ?? []) {
    if (m.kind === "video") {
      if (m.playbackId) media.push({ kind: "video", playbackId: m.playbackId, ...(m.aspect && { aspect: m.aspect.replace(":", " / ") }) });
      continue;
    }
    if (!m.src) continue;
    const scale = Math.min(1, 2400 / Math.max(m.w, m.h));
    const file = `/media/${dir}/${String(++i).padStart(2, "0")}.jpg`;
    const res = await fetch(`${m.src}?w=${Math.round(m.w * scale)}&fm=jpg&q=82`);
    await writeFile(`public${file}`, Buffer.from(await res.arrayBuffer()));
    media.push({ kind: "image", src: file, w: Math.round(m.w * scale), h: Math.round(m.h * scale), alt: m.alt ?? "" });
    console.log(slug, file);
  }
  out[slug] = { client: p.client, date: p.date, description: p.description, services: p.services, links: p.links, media };
}
await writeFile("src/data/projects.json", JSON.stringify(out, null, 2) + "\n");

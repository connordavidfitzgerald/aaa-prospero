import { createClient } from "@sanity/client";

// Read-only client for Applied Archive Atelier's public dataset (the same one
// that powers appliedarchiveatelier.com). Queried at build time only.
export const sanity = createClient({
  projectId: "0uc9cjxv",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Resolve an internationalized-array field to the requested language, falling
// back to English. Queries using it must pass a `$lang` param.
export const loc = (field: string) =>
  `coalesce(${field}[language == $lang][0].value, ${field}[language == "en"][0].value)`;

/** Sanity CDN image URL at a given width. */
export const img = (url: string, w: number) =>
  url ? `${url}?w=${w}&auto=format&q=80` : "";

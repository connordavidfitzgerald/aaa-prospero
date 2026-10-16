export type Lang = "fr" | "en";
export const LANGS: Lang[] = ["fr", "en"];

/** A string in both languages. */
export type L = { fr: string; en: string };

export const t = (s: L, lang: Lang) => s[lang];

/** Site path for a page path in a language: FR at the root, EN under /en. */
export const href = (path: string, lang: Lang) => {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (lang === "fr") return clean ? `/${clean}` : "/";
  return clean ? `/en/${clean}` : "/en";
};

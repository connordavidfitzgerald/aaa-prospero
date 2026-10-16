import pages from "./ccam-guidelines.json";
import type { L } from "../lib/i18n";

// CCAM 2026 Season Guidelines, exported page by page from Figma
// (section 16:8435) into public/media/guidelines/ccam/NN.jpg.

export interface GuidePage {
  n: number;
  num: string;
  section: string;
  title: string;
}

export const GUIDE_PAGES = pages as GuidePage[];

const LABELS: Record<string, L> = {
  "0": { fr: "Page titre", en: "Title page" },
  "1": { fr: "La saison", en: "The season" },
  "2": { fr: "Titre de saison", en: "Season title" },
  "3": { fr: "Couleur", en: "Colour" },
  "4": { fr: "Typographie", en: "Typography" },
  "5": { fr: "Éléments graphiques", en: "Graphic elements" },
  "6": { fr: "Mise en page", en: "Layout" },
  "7": { fr: "Applications", en: "Applications" },
  "8": { fr: "Voix", en: "Voice" },
};

/** One entry per guideline chapter, pointing at its first page. */
export const GUIDE_SECTIONS = Object.entries(LABELS).map(([key, label]) => ({
  key,
  label,
  first: GUIDE_PAGES.find((p) => p.num.split(".")[0] === key)!.n,
}));

export const guideSrc = (n: number, thumb = false) =>
  `/media/guidelines/ccam/${thumb ? "thumb-" : ""}${String(n).padStart(2, "0")}.jpg`;

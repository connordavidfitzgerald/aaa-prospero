import ccam from "./guidelines/ccam.json";
import ecozoic from "./guidelines/ecozoic.json";
import chimie from "./guidelines/chimie.json";
import type { L } from "../lib/i18n";
import type { Brand, GuidePageData } from "../lib/guide";

// Brand guidelines rebuilt in HTML from Figma ("A.A.A - Shared", page
// CURRENT): CCAM 2026 Season Guidelines, L4E Brand Guidelines — v2 and chimie
// Brand Guidelines. Regenerate with scripts/guidelines (see README there).

const l = (fr: string, en: string): L => ({ fr, en });

const LABELS: Record<Brand, Record<string, L>> = {
  ccam: {
    "0": l("Page titre", "Title page"),
    "1": l("La saison", "The season"),
    "2": l("Titre de saison", "Season title"),
    "3": l("Couleur", "Colour"),
    "4": l("Typographie", "Typography"),
    "5": l("Éléments graphiques", "Graphic elements"),
    "6": l("Mise en page", "Layout"),
    "7": l("Applications", "Applications"),
    "8": l("Voix", "Voice"),
  },
  ecozoic: {
    "0": l("Page titre", "Title page"),
    "1": l("Introduction", "Introduction"),
    "2": l("Logo", "Logo"),
    "3": l("Couleur", "Colour"),
    "4": l("Typographie", "Typography"),
    "5": l("Éléments graphiques", "Graphic elements"),
    "6": l("Photographie", "Photography"),
    "7": l("Mise en page", "Layout"),
    "8": l("Interface", "Interface"),
    "9": l("Voix", "Voice"),
  },
  chimie: {
    "0": l("Page titre", "Title page"),
    "1": l("Introduction", "Introduction"),
    "2": l("Logo", "Logo"),
    "3": l("Couleur", "Colour"),
    "4": l("Typographie", "Typography"),
    "5": l("Éléments graphiques", "Graphic elements"),
    "6": l("Photographie", "Photography"),
    "7": l("Mise en page", "Layout"),
    "8": l("Applications", "Applications"),
    "9": l("Voix", "Voice"),
  },
};

const PAGES: Record<Brand, GuidePageData[]> = {
  ccam: ccam as GuidePageData[],
  ecozoic: ecozoic as GuidePageData[],
  chimie: chimie as GuidePageData[],
};

export const sectionKey = (num: string) => num.split(".")[0];

export const guide = (brand: Brand) => {
  const pages = PAGES[brand];
  /** One entry per chapter, pointing at its first page. */
  const sections = Object.entries(LABELS[brand]).map(([key, label]) => ({
    key,
    label,
    first: pages.find((p) => sectionKey(p.num) === key)!.n,
  }));
  return { pages, sections };
};

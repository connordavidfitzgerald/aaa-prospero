import type { L } from "../lib/i18n";

// The site's table of contents. Drives the Index page, the chapter dropdown,
// "Next →" links, arrow-key navigation and the number shown in the nav.

export type View =
  | "index"
  | "about"
  | "team"
  | "work"
  | "project"
  | "guidelines"
  | "text"
  | "process"
  | "phases"
  | "columns"
  | "calendar"
  | "table"
  | "analysis"
  | "steps"
  | "contact";

export interface Page {
  id: string;
  num: string;
  path: string;
  title: L;
  view: View;
  /** "media": full-bleed imagery under white text. "green": the closing contact page. */
  theme?: "dark" | "media" | "green";
}

export interface Chapter {
  num: string;
  title: L;
  pages: string[];
}

export const PAGES: Page[] = [
  { id: "index", num: "", path: "", title: { fr: "Index", en: "Index" }, view: "index", theme: "dark" },

  { id: "about", num: "1.1", path: "about", title: { fr: "À propos", en: "About" }, view: "about" },
  { id: "team", num: "1.2", path: "team", title: { fr: "L’équipe", en: "The team" }, view: "team" },

  { id: "work", num: "2", path: "work", title: { fr: "Projets choisis", en: "Selected projects" }, view: "work" },
  { id: "ccam", num: "2.1", path: "work/ccam", title: { fr: "CCAM", en: "CCAM" }, view: "project", theme: "media" },
  { id: "ccam-guidelines", num: "2.1a", path: "work/ccam/guidelines", title: { fr: "Guide CCAM", en: "CCAM Guidelines" }, view: "guidelines" },
  { id: "ecozoic", num: "2.2", path: "work/ecozoic", title: { fr: "Ecozoic", en: "Ecozoic" }, view: "project", theme: "media" },
  { id: "ecozoic-guidelines", num: "2.2a", path: "work/ecozoic/guidelines", title: { fr: "Guide Ecozoic", en: "Ecozoic Guidelines" }, view: "guidelines" },
  { id: "chimie", num: "2.3", path: "work/chimie", title: { fr: "chimie", en: "chimie" }, view: "project", theme: "media" },
  { id: "chimie-guidelines", num: "2.3a", path: "work/chimie/guidelines", title: { fr: "Guide chimie", en: "chimie Guidelines" }, view: "guidelines" },

  { id: "heard", num: "3.1", path: "mandate/what-we-heard", title: { fr: "Ce qu’on a entendu", en: "What we heard" }, view: "text" },
  { id: "approach", num: "3.2", path: "mandate/how-we-work", title: { fr: "Comment on travaille", en: "How we work" }, view: "process" },
  { id: "phases", num: "3.3", path: "mandate/four-phases", title: { fr: "Quatre phases", en: "Four phases" }, view: "phases" },
  { id: "phase-1", num: "3.4", path: "mandate/phase-1", title: { fr: "Phase 1 · Découverte", en: "Phase 1 · Discovery" }, view: "columns" },
  { id: "phase-2", num: "3.5", path: "mandate/phase-2", title: { fr: "Phase 2 · Identité et saison", en: "Phase 2 · Identity and season" }, view: "columns" },
  { id: "phase-3", num: "3.6", path: "mandate/phase-3", title: { fr: "Phase 3 · Production", en: "Phase 3 · Production" }, view: "columns" },
  { id: "phase-4", num: "3.7", path: "mandate/phase-4", title: { fr: "Phase 4 · Déploiement", en: "Phase 4 · Rollout" }, view: "columns" },
  { id: "seasons", num: "3.8", path: "mandate/seasons", title: { fr: "Saisons 2028-30", en: "Seasons 2028-30" }, view: "columns" },
  { id: "poster-studio", num: "3.9", path: "mandate/poster-studio", title: { fr: "Poster Studio", en: "Poster Studio" }, view: "columns" },
  { id: "calendar", num: "3.10", path: "mandate/calendar", title: { fr: "Calendrier", en: "Timeline" }, view: "calendar" },

  { id: "summary", num: "4.1", path: "investment/summary", title: { fr: "Sommaire budgétaire", en: "Budget summary" }, view: "table" },
  { id: "budget-identity", num: "4.2", path: "investment/identity", title: { fr: "Volet 1 · Identité", en: "Part 1 · Identity" }, view: "table" },
  { id: "budget-2027", num: "4.3", path: "investment/season-2027", title: { fr: "Saison 2027-28", en: "Season 2027-28" }, view: "table" },
  { id: "budget-2028", num: "4.4", path: "investment/seasons-2028-30", title: { fr: "Saisons 2028-30", en: "Seasons 2028-30" }, view: "table" },

  { id: "analysis", num: "5", path: "brand-analysis", title: { fr: "Analyse de la marque", en: "Brand analysis" }, view: "analysis" },
  { id: "next-steps", num: "6", path: "next-steps", title: { fr: "Prochaines étapes", en: "Next steps" }, view: "steps" },
  { id: "contact", num: "", path: "contact", title: { fr: "Contact", en: "Contact" }, view: "contact", theme: "green" },
];

export const CHAPTERS: Chapter[] = [
  { num: "1", title: { fr: "Qui nous sommes", en: "Who we are" }, pages: ["about", "team"] },
  { num: "2", title: { fr: "Projets choisis", en: "Selected projects" }, pages: ["work", "ccam", "ccam-guidelines", "ecozoic", "ecozoic-guidelines", "chimie", "chimie-guidelines"] },
  {
    num: "3",
    title: { fr: "Le mandat", en: "The mandate" },
    pages: ["heard", "approach", "phases", "phase-1", "phase-2", "phase-3", "phase-4", "seasons", "poster-studio", "calendar"],
  },
  { num: "4", title: { fr: "L’investissement", en: "The investment" }, pages: ["summary", "budget-identity", "budget-2027", "budget-2028"] },
  { num: "5", title: { fr: "Analyse de la marque", en: "Brand analysis" }, pages: ["analysis"] },
  { num: "6", title: { fr: "Prochaines étapes", en: "Next steps" }, pages: ["next-steps"] },
];

export const page = (id: string) => {
  const p = PAGES.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown page ${id}`);
  return p;
};

/** Pages in reading order, wrapping from the last back to the Index. */
export const nextPage = (id: string) => PAGES[(PAGES.findIndex((p) => p.id === id) + 1) % PAGES.length];
export const prevPage = (id: string) =>
  PAGES[(PAGES.findIndex((p) => p.id === id) - 1 + PAGES.length) % PAGES.length];

/** Chapter pages shown as sub-rows (a chapter's own landing page is the row itself). */
export const subPages = (c: Chapter) => c.pages.filter((id) => page(id).num !== c.num).map(page);
export const chapterHref = (c: Chapter) => page(c.pages[0]).path;

import type { L } from "../lib/i18n";

// Proposal copy, FR verbatim from the Figma "PROPOSAL CONTENT BASE" frames,
// EN translated. Editorial notes from the source ([ASSUMED], [À CONFIRMER],
// [À COMPLÉTER]) are kept here as TODO comments and never rendered.

const l = (fr: string, en: string): L => ({ fr, en });

export const UI = {
  siteTitle: l("Applied Archive Atelier pour le Théâtre Prospero", "Applied Archive Atelier for Théâtre Prospero"),
  index: l("Index", "Index"),
  contact: l("Contact", "Contact"),
  next: l("Suivant →", "Next →"),
  prev: l("← Précédent", "← Previous"),
  back: l("← Retour", "← Back"),
  langLabel: l("En", "Fr"),
  menu: l("Pages", "Pages"),
  close: l("Fermer", "Close"),
  core: l("Noyau", "Core"),
  collaborators: l("Collaborateurs", "Collaborators"),
  team: l("← L’équipe", "← The team"),
  role: l("Rôle", "Role"),
  location: l("Lieu", "Location"),
  skills: l("Compétences", "Skills"),
  contactLabel: l("Contact", "Contact"),
  video: l("Vidéo", "Video"),
  play: l("Lecture", "Play"),
  pause: l("Pause", "Pause"),
  soundOn: l("Son", "Sound on"),
  soundOff: l("Muet", "Sound off"),
  allPages: l("Toutes les pages", "All pages"),
  viewGuidelines: l("Voir le guide de saison ↗", "View brand guidelines ↗"),
  info: l("+Info", "+Info"),
  infoClose: l("−Info", "−Info"),
};

export const INDEX = {
  intro: l(
    "Réponse à l’appel d’offres du Théâtre Prospero.\nRefonte de l’identité et campagnes de saison.\nOctobre 2026.",
    "Response to Théâtre Prospero’s call for proposals.\nIdentity redesign and season campaigns.\nOctober 2026.",
  ),
};

export const ABOUT = {
  intro: l(
    "Atelier Archives Appliquées est une coopérative de producteurs de studios indépendants opérant sous une marque commune avec une gouvernance démocratique. Pour chaque projet, nous rassemblons l’équipe dont il a réellement besoin, et la dirigeons comme une seule.",
    "Applied Archive Atelier is a cooperative of independent studio producers working under one shared brand with democratic governance. For each project we bring together the team it actually needs, and run it as one.",
  ),
  // TODO [ASSUMED]: craft roles chosen with the client in Phase 2.
  team: l(
    "Pour le Prospero, l’équipe réunit stratégie, identité, design numérique, développement et production. Les artisans de la séance photo (photographe, costumière, coiffure et maquillage, vidéaste) sont choisis avec vous en Phase 2.",
    "For the Prospero, the team brings together strategy, identity, digital design, development and production. The photo-shoot crew (photographer, costume designer, hair and make-up, videographer) is chosen with you in Phase 2.",
  ),
  dedicatedTitle: l("Équipe dédiée", "Dedicated team"),
  dedicated: [
    {
      name: "Jean-Julien Hazoumé (JJ)",
      slug: "jean-julien",
      role: l("Direction de création, stratégie", "Creative direction, strategy"),
      focus: l("Plateforme de marque, UX/UI, lien avec votre équipe", "Brand platform, UX/UI, liaison with your team"),
    },
    {
      name: "Connor Fitzgerald",
      slug: "connor-fitzgerald",
      role: l("Direction artistique", "Art direction"),
      focus: l("Identité, Poster Studio, développement web", "Identity, Poster Studio, web development"),
    },
    // TODO [À CONFIRMER]: third team member.
    {
      name: "—",
      slug: "",
      role: l("Édition et motion", "Editorial and motion"),
      focus: l("Dépliant, programmes, vidéo de saison", "Season brochure, programmes, season video"),
    },
  ],
};

export const TEAM = {
  intro: l(
    "Notre studio est formé d’un collectif de cinq créatifs, mais notre famille s’étend à un réseau de collaborateurs avec qui nous travaillons lorsqu’un savoir-faire précis ou un regard neuf est nécessaire.",
    "Our studio is made from a collective of five creatives, but our family extends through our network of collaborators who we work with when specialized work or new perspectives are required.",
  ),
};

export const WORK = {
  intro: l(
    "Identités, campagnes de saison et guides de marque pour des organismes culturels et communautaires.",
    "Identities, season campaigns and brand guidelines for cultural and community organizations.",
  ),
};

export const CCAM = {
  client: "CCAM",
  description: l(
    "Mois de l’histoire des Noirs 2026 pour le Centre culturel afro-canadien de Montréal : titre de saison, série de conférences à Campus MIL, affiches de l’exposition Chantier à la Galerie Art Mûr, et un guide de saison pour que l’équipe décline le tout de façon autonome.",
    "Black History Month 2026 for the Centre culturel afro-canadien de Montréal: the season title, a conference series at Campus MIL, posters for the Chantier exhibition at Galerie Art Mûr, and season guidelines so the team can extend it all on its own.",
  ),
  services: l("Identité de saison, affiches, réseaux sociaux, guide", "Season identity, posters, social, guidelines"),
  media: [
    { src: "/media/ccam/subway.jpg", w: 1568, h: 1046, alt: "Affiche Chantier dans le métro" },
    { src: "/media/ccam/poster-landscape.jpg", w: 1568, h: 882, alt: "Affiche Chantier, format paysage" },
    { src: "/media/ccam/ig-104.jpg", w: 1080, h: 1350, alt: "Publication Instagram 104" },
    { src: "/media/ccam/ig-111.jpg", w: 1080, h: 1350, alt: "Publication Instagram 111" },
    { src: "/media/ccam/poster-portrait.jpg", w: 1226, h: 1568, alt: "Affiche Chantier, format portrait" },
    { src: "/media/ccam/ig-105.jpg", w: 1080, h: 1350, alt: "Publication Instagram 105" },
    { src: "/media/ccam/ig-115.jpg", w: 1080, h: 1350, alt: "Publication Instagram 115" },
    { src: "/media/ccam/poster-square.jpg", w: 1568, h: 1568, alt: "Affiche Chantier, format carré" },
    { src: "/media/ccam/ig-109.jpg", w: 1080, h: 1350, alt: "Publication Instagram 109" },
    { src: "/media/ccam/ig-112.jpg", w: 1080, h: 1350, alt: "Publication Instagram 112" },
  ],
};

// TODO [À COMPLÉTER]: the Figma portfolio page lists more case studies
// (chimie, Black Theatre Workshop, Routes to Rootz, Le Hub, BxB).

export const HEARD = {
  intro: l(
    "Le Prospero a bâti, rue Ontario, une salle où les écritures contemporaines les plus exigeantes trouvent un public qui revient, saison après saison. Ce qu’il lui faut maintenant, c’est une identité qui tienne cette promesse d’elle-même, peu importe ce qui est à l’affiche : radicale dans ce qu’elle ose, populaire dans la manière dont elle accueille.",
    "On rue Ontario, the Prospero has built a house where the most demanding contemporary writing finds an audience that comes back, season after season. What it needs now is an identity that keeps that promise on its own, whatever is on the bill: radical in what it dares, popular in how it welcomes.",
  ),
};

export const APPROACH = {
  // TODO [ASSUMED]: audience description.
  intro: l(
    "Le public du Prospero, ce sont des abonnés qui connaissent la maison et une génération qui ne l’a pas encore trouvée. Le rôle de l’identité, c’est d’être reconnaissable avant même qu’on sache ce qui joue, et d’ouvrir la porte à ceux qui n’ont jamais osé la pousser.",
    "The Prospero’s audience is subscribers who know the house and a generation that hasn’t found it yet. The identity’s job is to be recognisable before you even know what’s playing, and to open the door to those who have never dared to push it.",
  ),
  lead: l("Notre processus commence par l’écoute.", "Our process starts with listening."),
  steps: [
    l("La découverte façonne la stratégie.", "Discovery shapes strategy."),
    l("La stratégie façonne l’identité.", "Strategy shapes identity."),
    l("L’identité façonne tout ce qui suit.", "Identity shapes everything that follows."),
  ],
};

export const PHASES = {
  intro: l(
    "La première saison se construit en quatre phases, calées sur votre calendrier : on écoute, on propose, on produit, on déploie. L’identité institutionnelle et la campagne 2027-2028 avancent ensemble, pour que la saison soit la première démonstration de la marque.",
    "The first season is built in four phases, set to your calendar: we listen, we propose, we produce, we roll out. The institutional identity and the 2027-2028 campaign move forward together, so the season is the brand’s first demonstration.",
  ),
  outro: l(
    "Les saisons 2028-2029 et 2029-2030 suivent ensuite un cycle plus court, parce que la grille, les gabarits et les outils existent déjà.",
    "The 2028-2029 and 2029-2030 seasons then follow a shorter cycle, because the grid, templates and tools already exist.",
  ),
  rows: [
    { num: "Phase 1", name: l("Découverte", "Discovery"), when: l("nov.–déc. 2026", "Nov.–Dec. 2026"), page: "phase-1" },
    { num: "Phase 2", name: l("Identité et saison", "Identity and season"), when: l("janv. 2027", "Jan. 2027"), page: "phase-2" },
    { num: "Phase 3", name: l("Production", "Production"), when: l("fév.–mars 2027", "Feb.–Mar. 2027"), page: "phase-3" },
    { num: "Phase 4", name: l("Déploiement", "Rollout"), when: l("avril 2027", "April 2027"), page: "phase-4" },
    { num: l("Cycle annuel", "Annual cycle"), name: l("Saisons 2028-29 et 2029-30", "Seasons 2028-29 and 2029-30"), when: l("2028–2030", "2028–2030"), page: "seasons" },
  ],
};

export interface Columns {
  intro: L;
  columns: { title: L; items: L[] }[];
}

export const COLUMNS: Record<string, Columns> = {
  "phase-1": {
    intro: l("Phase 1 · Découverte. Novembre et décembre 2026.", "Phase 1 · Discovery. November and December 2026."),
    columns: [
      {
        title: l("Découverte", "Discovery"),
        items: [
          l(
            "Audit de la marque actuelle : logo, site, affiches et campagnes des trois dernières saisons, réseaux sociaux",
            "Audit of the current brand: logo, website, posters and campaigns from the last three seasons, social media",
          ),
          // TODO [ASSUMED]: interview selection to confirm.
          l(
            "Quatre entretiens : direction artistique, communications, production, un partenaire ou abonné",
            "Four interviews: artistic direction, communications, production, a partner or subscriber",
          ),
          l("Un atelier de découverte avec l’équipe du Prospero", "A discovery workshop with the Prospero team"),
          l(
            "Lecture du paysage : théâtres et institutions comparables, ici et ailleurs",
            "Landscape review: comparable theatres and institutions, here and elsewhere",
          ),
        ],
      },
      {
        title: l("Plateforme et concept de saison", "Platform and season concept"),
        items: [
          l(
            "Plateforme de marque : positionnement, ton, ce que « radical et populaire » veut dire concrètement pour le Prospero",
            "Brand platform: positioning, tone, what “radical and popular” concretely means for the Prospero",
          ),
          l(
            "Principes d’identité qui guideront le logo et la charte",
            "Identity principles to guide the logo and the visual standards",
          ),
          l(
            "Recherche pour le concept de la saison 2027-2028, à partir de la programmation",
            "Research for the 2027-2028 season concept, starting from the programme",
          ),
        ],
      },
    ],
  },
  "phase-2": {
    intro: l("Phase 2 · Identité et saison. Janvier 2027.", "Phase 2 · Identity and season. January 2027."),
    columns: [
      {
        title: l("Identité institutionnelle", "Institutional identity"),
        items: [
          l(
            "Deux pistes de logotype, présentées en contexte : façade, affiche, écran",
            "Two logotype directions, shown in context: façade, poster, screen",
          ),
          l("Raffinement de la piste retenue et déclinaisons", "Refinement of the chosen direction and its variations"),
          l(
            "Charte graphique : polices, palette institutionnelle, grille et système de mise en page",
            "Visual standards: typefaces, institutional palette, grid and layout system",
          ),
          l("Validation avec l’équipe du Prospero", "Sign-off with the Prospero team"),
        ],
      },
      {
        title: l("Orientation de saison 2027-2028", "2027-2028 season direction"),
        items: [
          l("Moodboards et lignes directrices : couleurs, thématiques, intentions", "Moodboards and guidelines: colours, themes, intentions"),
          l(
            "Protocole photo de la saison : un plateau, une lumière, une série de dix images",
            "Season photo protocol: one set, one light, a series of ten images",
          ),
          l("Pistes costumes, coiffure et maquillage", "Costume, hair and make-up directions"),
          l("Validation du concept avant la production", "Concept sign-off before production"),
        ],
      },
    ],
  },
  "phase-3": {
    intro: l("Phase 3 · Production. Février et mars 2027.", "Phase 3 · Production. February and March 2027."),
    columns: [
      {
        title: l("Séance photo et vidéo", "Photo and video shoot"),
        items: [
          l(
            "Une journée de tournage : les dix spectacles photographiés sur un même plateau, la vidéo de saison tournée dans la foulée",
            "One shoot day: all ten shows photographed on a single set, the season video shot straight after",
          ),
          l(
            "Direction artistique, costumes, coiffure et maquillage, supervision sur place",
            "Art direction, costumes, hair and make-up, on-set supervision",
          ),
          l(
            "Visuel moteur de la saison et déclinaisons pour chacun des spectacles",
            "The season’s key visual and variations for each show",
          ),
          l(
            "Vidéo de 30 secondes : idéation, scénarisation, direction artistique, montage et étalonnage",
            "30-second video: concept, script, art direction, editing and grading",
          ),
        ],
      },
      {
        title: l("Site web", "Website"),
        items: [
          l("Architecture de l’information et wireframes", "Information architecture and wireframes"),
          l(
            "Design d’interface : accueil, saison, fiche spectacle, à propos, soutenir, gabarits éditoriaux",
            "Interface design: home, season, show page, about, support, editorial templates",
          ),
          l("Développement sur un CMS que l’équipe met à jour seule", "Built on a CMS the team updates on its own"),
          l(
            "Billetterie Tuxedo reliée à chaque fiche spectacle, sans changement à votre système actuel",
            "Tuxedo ticketing linked to every show page, with no change to your current system",
          ),
        ],
      },
    ],
  },
  "phase-4": {
    intro: l("Phase 4 · Déploiement. Avril 2027.", "Phase 4 · Rollout. April 2027."),
    columns: [
      {
        title: l("Guide et gabarits", "Guidelines and templates"),
        items: [
          l(
            "Guide de style complet : logos, polices, couleurs, grilles, avec balises claires et exemples concrets",
            "Complete style guide: logos, typefaces, colours, grids, with clear rules and concrete examples",
          ),
          l(
            "Gabarits corporatifs : infolettre, offre d’emploi, signalétique, papeterie, campagne de financement",
            "Corporate templates: newsletter, job posting, signage, stationery, fundraising campaign",
          ),
          l("Poster Studio configuré pour le Prospero", "Poster Studio set up for the Prospero"),
        ],
      },
      {
        title: l("Boîte à outils de saison", "Season toolkit"),
        items: [
          l("Affiches 24 x 36 po et bannières de façade", "24 × 36 in posters and façade banners"),
          l(
            "Gabarits statiques et animés pour Instagram et Facebook : 4:5, stories, carrousels",
            "Static and animated templates for Instagram and Facebook: 4:5, stories, carousels",
          ),
          l("Bannières web et signatures de courriel", "Web banners and email signatures"),
          l(
            "Dépliant de saison imprimé et gabarit de programme de soirée numérique",
            "Printed season brochure and digital evening-programme template",
          ),
          l(
            "Livraison des fichiers sources : impression, vidéo, numérique. Dévoilement en mai 2027.",
            "Delivery of source files: print, video, digital. Launch in May 2027.",
          ),
        ],
      },
    ],
  },
  seasons: {
    intro: l("Saisons 2028-29 et 2029-30.", "Seasons 2028-29 and 2029-30."),
    columns: [
      {
        title: l("Chaque saison", "Each season"),
        items: [
          l("Nouveau concept et moodboards à partir de la programmation", "New concept and moodboards from the programme"),
          l(
            "Nouveau visuel moteur et dix déclinaisons, produites dans Poster Studio",
            "New key visual and ten variations, produced in Poster Studio",
          ),
          l("Une journée de séance photo selon le protocole établi", "One photo-shoot day following the established protocol"),
          l(
            "Vidéo de 30 secondes en motion, construite à partir des images de la séance et du gabarit de la première saison",
            "30-second motion video, built from the shoot images and the first season’s template",
          ),
        ],
      },
      {
        title: l("Ce qui reste en place", "What stays in place"),
        items: [
          l("L’identité, la charte et le guide de style", "The identity, standards and style guide"),
          l(
            "La grille du dépliant et des gabarits sociaux, mise à jour plutôt que redessinée",
            "The brochure grid and social templates, updated rather than redrawn",
          ),
          l("Le site, où chaque nouvelle saison entre par le CMS", "The website, where each new season goes in through the CMS"),
          // TODO [ASSUMED]: yearly rhythm.
          l(
            "Rythme type : concept à l’automne, séance à l’hiver, déploiement au printemps",
            "Typical rhythm: concept in the fall, shoot in the winter, rollout in the spring",
          ),
        ],
      },
    ],
  },
  "poster-studio": {
    intro: l(
      "Poster Studio. Un outil développé par notre coopérative, qui transforme la charte du Prospero en générateur.",
      "Poster Studio. A tool built by our cooperative that turns the Prospero’s standards into a generator.",
    ),
    columns: [
      {
        title: l("Ce que c’est", "What it is"),
        items: [
          l(
            "Un outil développé par notre coopérative : il transforme la charte du Prospero en générateur",
            "A tool built by our cooperative: it turns the Prospero’s standards into a generator",
          ),
          l(
            "L’équipe entre le titre, les dates et l’image; l’affiche ou la publication sort déjà conforme",
            "The team enters the title, dates and image; the poster or post comes out already on-brand",
          ),
          l(
            "Ni Figma, ni Canva : l’espace entre les deux, là où un guide de style sert au quotidien",
            "Neither Figma nor Canva: the space between, where a style guide is used day to day",
          ),
        ],
      },
      {
        title: l("Pourquoi ici", "Why here"),
        items: [
          l(
            "L’appel d’offres demande que l’équipe interne décline les outils de façon autonome. Poster Studio rend ça concret.",
            "The call for proposals asks for the in-house team to extend the tools on its own. Poster Studio makes that concrete.",
          ),
          l(
            "Nous l’utilisons aussi pour produire les déclinaisons de chaque spectacle, ce qui permet de tenir trois saisons dans le budget",
            "We also use it to produce each show’s variations, which keeps three seasons within budget",
          ),
          l(
            "Accès annuel : 400 $ la première année, puis 600 $ par année, en ligne séparée au budget",
            "Annual access: $400 the first year, then $600 a year, as a separate budget line",
          ),
        ],
      },
    ],
  },
};

export const CALENDAR = {
  intro: l("Calendrier. Dévoilement en mai 2027.", "Timeline. Launch in May 2027."),
  months: [
    { month: l("nov. 2026", "Nov. 2026"), text: l("Signature et démarrage", "Signing and kick-off") },
    { month: l("déc. 2026", "Dec. 2026"), text: l("Fin de la Phase 1 : découverte et plateforme de marque", "End of Phase 1: discovery and brand platform") },
    { month: l("janv. 2027", "Jan. 2027"), text: l("Phase 2 : validation de l’identité et du concept de saison", "Phase 2: identity and season concept sign-off") },
    { month: l("fév.–mars 2027", "Feb.–Mar. 2027"), text: l("Phase 3 : séance photo, vidéo, visuels, site web", "Phase 3: photo shoot, video, visuals, website") },
    { month: l("avril 2027", "April 2027"), text: l("Phase 4 : guide de style, boîte à outils, livraison des fichiers", "Phase 4: style guide, toolkit, file delivery") },
    { month: l("mai 2027", "May 2027"), text: l("Dévoilement de la saison", "Season launch") },
  ],
  bands: [
    { label: l("Phases 1 et 2 : découverte et identité", "Phases 1 and 2: discovery and identity"), span: [1, 6] },
    { label: l("Phases 3 et 4 : production et déploiement", "Phases 3 and 4: production and rollout"), span: [7, 10] },
    { label: l("Dévoilement", "Launch"), span: [11, 12] },
  ] as { label: L; span: [number, number] }[],
};

/** A budget row. Numbers are display strings; `note` trails the label
    ("CAD, avant taxes" on totals). */
export interface BudgetRow {
  label: L;
  cells: (L | string)[];
  note?: L;
}

export interface Budget {
  /** Two-line title, the first line highlighted in green (Figma FR 20–23). */
  title: [L, L];
  notes: L[];
  head: L[];
  rows: BudgetRow[];
}

const H = {
  part: l("Volet", "Part"),
  base: l("Base", "Base"),
  pm: l("GP + coop", "PM + co-op"),
  total: l("Total", "Total"),
  item: l("Livrable", "Deliverable"),
  hours: l("Heures", "Hours"),
  rate: l("Taux (CAD)", "Rate (CAD)"),
  subtotal: l("Sous-total", "Subtotal"),
};

// FR uses "31 460 $"; EN uses "$31,460". Write amounts once, format per language.
const $ = (fr: string): L => {
  const n = fr.replace(/\s/g, "").replace("$", "");
  const [int, dec] = n.split(",");
  const en = `$${Number(int).toLocaleString("en-CA")}${dec ? "." + dec : ""}`;
  return { fr: fr.replace(/ /g, " "), en };
};
const hrs = (h: number) => `${h}h`;
const forfait = l("forfait", "flat fee");
const pm = l("Gestion de projet (15 %)", "Project management (15%)");
const coop = l("Contribution coopérative (10 %)", "Co-op contribution (10%)");
const cad = l("CAD, avant taxes", "CAD, before taxes");
const budget = l("Budget", "Budget");
const outOfPocket = l(
  "Déboursés au coût (studio, matériaux de costumes, musique)",
  "Expenses at cost (studio, costume materials, music)",
);

export const BUDGETS: Record<string, Budget> = {
  summary: {
    title: [l("Sommaire", "Summary"), l("Budget ventilé par volet", "Budget by part")],
    notes: [
      l("Plafond de l’appel d’offres : 125 000 $.", "Call for proposals ceiling: $125,000."),
      l(
        "Base : honoraires de création, cachets de production et déboursés. La gestion de projet (15 %) et la contribution coopérative (10 %) s’appliquent aux honoraires et aux cachets; les déboursés sont refacturés au coût.",
        "Base: creative fees, production fees and expenses. Project management (15%) and the co-op contribution (10%) apply to fees; expenses are billed at cost.",
      ),
      l("Montants en CAD, avant taxes.", "Amounts in CAD, before taxes."),
    ],
    head: [H.part, H.base, H.pm, H.total],
    rows: [
      { label: l("Volet 1 · Identité institutionnelle et site web", "Part 1 · Institutional identity and website"), cells: [$("31 460 $"), $("8 336,90 $"), $("39 796,90 $")] },
      { label: l("Volet 2 · Saison 2027-2028", "Part 2 · Season 2027-2028"), cells: [$("31 860 $"), $("7 939,40 $"), $("39 799,40 $")] },
      { label: l("Volet 2 · Saison 2028-2029", "Part 2 · Season 2028-2029"), cells: [$("17 700 $"), $("4 187 $"), $("21 887 $")] },
      { label: l("Volet 2 · Saison 2029-2030", "Part 2 · Season 2029-2030"), cells: [$("17 700 $"), $("4 187 $"), $("21 887 $")] },
      { label: l("Poster Studio · accès annuel (400 $, 600 $, 600 $)", "Poster Studio · annual access ($400, $600, $600)"), cells: [$("1 600 $"), "", $("1 600 $")] },
      { label: l("Total du mandat, trois saisons", "Total for the mandate, three seasons"), cells: [$("100 320 $"), $("24 650,30 $"), $("124 970,30 $")], note: cad },
    ],
  },
  "budget-identity": {
    title: [budget, l("Volet 1 · Identité institutionnelle", "Part 1 · Institutional identity")],
    notes: [
      l("Portée confirmée, prix fixe.", "Confirmed scope, fixed price."),
      l("Facturation par phase, au démarrage de chacune. Montants en CAD, avant taxes.", "Invoiced per phase, at the start of each. Amounts in CAD, before taxes."),
    ],
    head: [H.item, H.hours, H.rate, H.subtotal],
    rows: [
      { label: l("Stratégie de marque (audit, 4 entretiens, atelier, plateforme)", "Brand strategy (audit, 4 interviews, workshop, platform)"), cells: [hrs(32), $("160 $"), $("5 120 $")] },
      { label: l("Design d’identité visuelle (logo, 2 pistes, déclinaisons)", "Visual identity design (logo, 2 directions, variations)"), cells: [hrs(44), $("120 $"), $("5 280 $")] },
      { label: l("Charte graphique et guide de style", "Visual standards and style guide"), cells: [hrs(36), $("120 $"), $("4 320 $")] },
      { label: l("Gabarits corporatifs (infolettre, emploi, signalétique, financement)", "Corporate templates (newsletter, jobs, signage, fundraising)"), cells: [hrs(20), $("120 $"), $("2 400 $")] },
      { label: l("Site web : architecture de l’information et design UI", "Website: information architecture and UI design"), cells: [hrs(50), $("130 $"), $("6 500 $")] },
      { label: l("Site web : développement (CMS, lien Tuxedo, SEO de base)", "Website: development (CMS, Tuxedo link, basic SEO)"), cells: [hrs(56), $("140 $"), $("7 840 $")] },
      { label: H.subtotal, cells: ["", "", $("31 460 $")] },
      { label: pm, cells: ["", "", $("4 719 $")] },
      { label: coop, cells: ["", "", $("3 617,90 $")] },
      { label: l("Total Volet 1", "Total Part 1"), cells: ["", "", $("39 796,90 $")], note: cad },
    ],
  },
  "budget-2027": {
    title: [budget, l("Saison 2027-2028", "Season 2027-2028")],
    notes: [
      l("Portée confirmée, prix fixe.", "Confirmed scope, fixed price."),
      l("Facturation par phase, au démarrage de chacune. Montants en CAD, avant taxes.", "Invoiced per phase, at the start of each. Amounts in CAD, before taxes."),
      l(
        "Les déboursés (location de studio, matériaux de costumes, licence musicale) sont refacturés au coût, sans frais ajoutés.",
        "Expenses (studio rental, costume materials, music licence) are billed at cost, with no mark-up.",
      ),
    ],
    head: [H.item, H.hours, H.rate, H.subtotal],
    rows: [
      { label: l("Orientation créative et moodboards", "Creative direction and moodboards"), cells: [hrs(18), $("120 $"), $("2 160 $")] },
      { label: l("Visuel moteur de la saison", "Season key visual"), cells: [hrs(24), $("120 $"), $("2 880 $")] },
      { label: l("Poster Studio : configuration (développement)", "Poster Studio: setup (development)"), cells: [hrs(14), $("140 $"), $("1 960 $")] },
      { label: l("Poster Studio : configuration (design)", "Poster Studio: setup (design)"), cells: [hrs(6), $("120 $"), $("720 $")] },
      { label: l("Déclinaisons des 10 spectacles", "Variations for the 10 shows"), cells: [hrs(20), $("120 $"), $("2 400 $")] },
      { label: l("Direction artistique photo (préparation, supervision)", "Photo art direction (preparation, supervision)"), cells: [hrs(18), $("140 $"), $("2 520 $")] },
      { label: l("Vidéo de saison 30 s (idéation, réalisation, montage)", "30 s season video (concept, direction, editing)"), cells: [hrs(36), $("140 $"), $("5 040 $")] },
      { label: l("Boîte à outils (affiches, façade, réseaux, bannières, signatures)", "Toolkit (posters, façade, social, banners, signatures)"), cells: [hrs(30), $("120 $"), $("3 600 $")] },
      { label: l("Animation des gabarits sociaux", "Social template animation"), cells: [hrs(6), $("140 $"), $("840 $")] },
      { label: l("Dépliant de saison", "Season brochure"), cells: [hrs(22), $("120 $"), $("2 640 $")] },
      { label: l("Gabarit de programme numérique", "Digital programme template"), cells: [hrs(6), $("120 $"), $("720 $")] },
      { label: l("Préparation et livraison des fichiers", "File preparation and delivery"), cells: [hrs(4), $("120 $"), $("480 $")] },
      { label: l("Cachets : photographe, coiffure et maquillage, costumière, vidéaste", "Fees: photographer, hair and make-up, costume designer, videographer"), cells: ["", forfait, $("4 000 $")] },
      { label: H.subtotal, cells: ["", "", $("29 960 $")] },
      { label: pm, cells: ["", "", $("4 494 $")] },
      { label: coop, cells: ["", "", $("3 445,40 $")] },
      { label: outOfPocket, cells: ["", "", $("1 900 $")] },
      { label: l("Total Saison 2027-2028", "Total Season 2027-2028"), cells: ["", "", $("39 799,40 $")], note: cad },
    ],
  },
  "budget-2028": {
    title: [budget, l("Saisons 2028-29 et 2029-30", "Seasons 2028-29 and 2029-30")],
    notes: [
      l("Montants par saison. La même portée s’applique à chacune des deux saisons.", "Amounts per season. The same scope applies to each of the two seasons."),
      l(
        "Facturation au démarrage de chaque saison. Montants en CAD, avant taxes. Déboursés refacturés au coût.",
        "Invoiced at the start of each season. Amounts in CAD, before taxes. Expenses billed at cost.",
      ),
      l("Spectacle additionnel au-delà de dix : 455,40 $ par spectacle.", "Each show beyond ten: $455.40 per show."),
    ],
    head: [H.item, H.hours, H.rate, H.subtotal],
    rows: [
      { label: l("Orientation créative et moodboards", "Creative direction and moodboards"), cells: [hrs(10), $("120 $"), $("1 200 $")] },
      { label: l("Visuel moteur", "Key visual"), cells: [hrs(16), $("120 $"), $("1 920 $")] },
      { label: l("Poster Studio : mise à jour de la saison", "Poster Studio: season update"), cells: [hrs(4), $("140 $"), $("560 $")] },
      { label: l("Déclinaisons des 10 spectacles (Poster Studio)", "Variations for the 10 shows (Poster Studio)"), cells: [hrs(15), $("120 $"), $("1 800 $")] },
      { label: l("Direction artistique photo", "Photo art direction"), cells: [hrs(10), $("140 $"), $("1 400 $")] },
      { label: l("Vidéo de saison 30 s en motion", "30 s season motion video"), cells: [hrs(20), $("140 $"), $("2 800 $")] },
      { label: l("Boîte à outils : mise à jour", "Toolkit: update"), cells: [hrs(10), $("120 $"), $("1 200 $")] },
      { label: l("Dépliant de saison (grille existante)", "Season brochure (existing grid)"), cells: [hrs(12), $("120 $"), $("1 440 $")] },
      { label: l("Préparation et livraison des fichiers", "File preparation and delivery"), cells: [hrs(4), $("120 $"), $("480 $")] },
      { label: l("Cachets : photographe, coiffure et maquillage, costumière", "Fees: photographer, hair and make-up, costume designer"), cells: ["", forfait, $("3 000 $")] },
      { label: H.subtotal, cells: ["", "", $("15 800 $")] },
      { label: pm, cells: ["", "", $("2 370 $")] },
      { label: coop, cells: ["", "", $("1 817 $")] },
      { label: outOfPocket, cells: ["", "", $("1 900 $")] },
      { label: l("Total par saison", "Total per season"), cells: ["", "", $("21 887 $")], note: cad },
      { label: l("Total pour les deux saisons", "Total for both seasons"), cells: ["", "", $("43 774 $")] },
    ],
  },
};

// FR from the proposal document (Figma FR 25); "soutien" corrected to "soutient".
export const ANALYSIS = {
  intro: l(
    "Le Prospero se présente comme une maison qui soutient ses créations, sans jamais disparaître. Radical dans l’image, qui dérange; populaire dans le cadre; l’étrange, tenu par le familier.",
    "The Prospero presents itself as a house that stands behind its productions without ever disappearing. Radical in the image, which unsettles; popular in the frame; the strange, held by the familiar.",
  ),
  angles: [
    {
      title: l("L’image qui dérange", "The image that unsettles"),
      text: l(
        "Une couleur par saison, appliquée sans ton secondaire : c’est la programmation qui donne sa couleur à l’année et réunit une dizaine de spectacles sous une même signature. Pas de photo de scène, mais un visage cadré serré, perturbé par un seul élément étranger. Le Prospero vend une sensation, fait confiance au public devant l’ambiguïté, et garde l’étrangeté portée par une vraie personne.",
        "One colour per season, applied with no secondary tone: it’s the programme that gives the year its colour and brings some ten shows together under one signature. No stage photography, but a tightly framed face, disrupted by a single foreign element. The Prospero sells a sensation, trusts its audience with ambiguity, and keeps the strangeness carried by a real person.",
      ),
    },
    {
      title: l("Le cadre qui rassure", "The frame that reassures"),
      text: l(
        "Le mot-symbole massif et condensé, plus proche de l’affiche militante que du logo culturel, et le sans-serif du texte courant restent identiques d’une affiche à l’autre. Ce sont eux qui rendent le Prospero familier, quel que soit le spectacle.",
        "The massive, condensed wordmark, closer to the activist poster than to the cultural logo, and the sans-serif of the running text stay the same from one poster to the next. They are what make the Prospero familiar, whatever the show.",
      ),
    },
    {
      title: l("Les autres au premier plan", "Others in the foreground"),
      text: l(
        "Les crédits forment un bloc dense qui occupe l’affiche : la création comme travail collectif, loin du vedettariat. Le titre, lui, change de voix à chaque spectacle. La maison se retire pour laisser parler l’auteur, ce qui est la mission même d’un lieu d’écritures contemporaines.",
        "The credits form a dense block that fills the poster: creation as collective work, far from the star system. The title, meanwhile, changes voice with every show. The house steps back to let the author speak, which is the very mission of a venue for contemporary writing.",
      ),
    },
  ],
  media: [
    { src: "/media/prospero/site.jpg", w: 1568, h: 705, alt: "Site web du Théâtre Prospero, La jeune fille suppliciée sur une étagère" },
    { src: "/media/prospero/la-mouette.jpg", w: 657, h: 993, alt: "Affiche La Mouette, Théâtre Prospero" },
    { src: "/media/prospero/si-vous-voulez.jpg", w: 660, h: 990, alt: "Affiche Si vous voulez de la lumière, Théâtre Prospero" },
  ],
};

export const STEPS = {
  intro: l("Quatre étapes pour démarrer en novembre 2026.", "Four steps to start in November 2026."),
  steps: [
    l("Relire cette proposition et nous faire part de vos questions.", "Read this proposal and send us your questions."),
    l("Rencontre de présentation, si le Prospero retient notre candidature.", "A presentation meeting, if the Prospero shortlists us."),
    l(
      "Confirmer la portée du Volet 1 et de la saison 2027-2028, et signer l’entente de service.",
      "Confirm the scope of Part 1 and the 2027-2028 season, and sign the service agreement.",
    ),
    l(
      "Première facture au démarrage de la Phase 1, en novembre 2026. Les phases et les saisons suivantes sont facturées à leur démarrage.",
      "First invoice at the start of Phase 1, in November 2026. Later phases and seasons are invoiced as they start.",
    ),
  ],
};

export const CONTACT = {
  intro: l("Some work is worth doing together.", "Some work is worth doing together."),
  person: l("Personne-ressource", "Contact person"),
  name: "Jean-Julien Hazoumé",
  email: "jeanjulien@appliedarchiveatelier.com",
  emailLabel: l("Courriel", "Email"),
  signoff: l("À très bientôt !", "Talk soon!"),
};

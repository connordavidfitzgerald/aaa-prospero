import type { L } from "./i18n";

export type Media =
  | { kind: "image"; src: string; alt?: string; w?: number; h?: number }
  | { kind: "video"; playbackId: string; aspect?: string };

/** A case study: CCAM is written in copy.ts, Ecozoic and chimie come from src/data/projects.json. */
export interface Project {
  client: string;
  description: L;
  services: L;
  links: { label: L; href: string }[];
  media: Media[];
}

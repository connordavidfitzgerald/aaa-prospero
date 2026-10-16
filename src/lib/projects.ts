import { sanity, loc } from "./sanity";
import type { Lang } from "./i18n";

export type Media =
  | { kind: "image"; src: string; alt?: string; w?: number; h?: number }
  | { kind: "video"; playbackId: string; aspect?: string };

export interface SanityProject {
  client: string;
  description: string;
  services: string;
  date: string;
  cover: string;
  links: { label: string; href: string }[];
  media: Media[];
}

const QUERY = /* groq */ `
*[_type == "project" && slug.current == $slug][0]{
  client,
  "description": ${loc("description")},
  "services": ${loc("services")},
  date,
  "cover": image.image.asset->url,
  "links": coalesce(links[]{"label": ${loc("label")}, href}, []),
  "media": media[].items[]{
    _type == "mediaImage" => {"kind": "image", "src": image.asset->url, "alt": ${loc("alt")}, "w": image.asset->metadata.dimensions.width, "h": image.asset->metadata.dimensions.height},
    _type == "mediaVideo" => {"kind": "video", "playbackId": coalesce(video.asset->playbackId, muxPlaybackId), "aspect": video.asset->data.aspect_ratio}
  }
}`;

export async function getProject(slug: string, lang: Lang): Promise<SanityProject> {
  const p = await sanity.fetch<SanityProject>(QUERY, { slug, lang });
  return {
    ...p,
    media: (p.media ?? [])
      .filter((m) => (m.kind === "image" ? m.src : m.playbackId))
      .map((m) =>
        m.kind === "video" && m.aspect ? { ...m, aspect: m.aspect.replace(":", " / ") } : m,
      ),
  };
}

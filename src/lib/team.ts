import { sanity, loc } from "./sanity";
import type { Lang } from "./i18n";

export interface Member {
  slug: string;
  name: string;
  role: string;
  services: string[];
  location: string;
  image: string;
  bio: string;
  email: string;
  instagram: string;
  linkedin: string;
  memberType: "core" | "collaborator";
  videoPlaybackId?: string;
  /** CSS aspect-ratio, e.g. "16 / 9". */
  videoAspect?: string;
}

type Raw = Omit<Member, "services" | "videoAspect"> & {
  services: string | null;
  videoAspect: string | null;
};

const QUERY = /* groq */ `
*[_type == "teamMember" && memberType in ["core", "collaborator"]]{
  "slug": slug.current,
  name,
  "role": coalesce(${loc("role")}, ""),
  "services": ${loc("services")},
  "location": coalesce(${loc("location")}, ""),
  "image": coalesce(image.asset->url, ""),
  "bio": coalesce(${loc("bio")}, ""),
  "email": coalesce(email, ""),
  "instagram": coalesce(instagram, ""),
  "linkedin": coalesce(linkedin, ""),
  memberType,
  "videoPlaybackId": video.asset->playbackId,
  "videoAspect": video.asset->data.aspect_ratio
}`;

const cache = new Map<Lang, Promise<Member[]>>();

/** Core members then collaborators, each group alphabetical (as in Figma). */
export function getTeam(lang: Lang): Promise<Member[]> {
  if (!cache.has(lang)) {
    cache.set(
      lang,
      sanity.fetch<Raw[]>(QUERY, { lang }).then((raw) => {
        const members: Member[] = raw.map((m) => ({
          ...m,
          services: (m.services ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          videoPlaybackId: m.videoPlaybackId ?? undefined,
          videoAspect: m.videoAspect ? m.videoAspect.replace(":", " / ") : undefined,
        }));
        const byName = (a: Member, b: Member) => a.name.localeCompare(b.name, "fr");
        return [
          ...members.filter((m) => m.memberType === "core").sort(byName),
          ...members.filter((m) => m.memberType === "collaborator").sort(byName),
        ];
      }),
    );
  }
  return cache.get(lang)!;
}

// Types and CSS helpers for guideline pages rebuilt from Figma (see
// scripts/guidelines). Every length is in Figma px on a 1920×1080 page and is
// written as a multiple of --u, so a page scales with its container.

export type Brand = "ccam" | "ecozoic" | "chimie";

export interface Seg {
  t: string;
  f: string;
  s: string;
  z: number;
  c?: string;
  ls?: number | string;
  lh?: number | string;
  tc?: "UPPER" | "LOWER" | "TITLE" | "SMALL_CAPS" | "SMALL_CAPS_FORCED";
  td?: "UNDERLINE" | "STRIKETHROUGH";
  li?: "ORDERED" | "UNORDERED";
  ind?: number;
}

interface Base {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  rot?: number;
  fx?: { shadow?: string[]; blur?: number; backdrop?: number };
}
export interface TextNode extends Base {
  type: "text";
  align: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  valign: "TOP" | "CENTER" | "BOTTOM";
  auto: "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT" | "TRUNCATE";
  segs: Seg[];
}
export interface BoxNode extends Base {
  type: "box" | "group";
  bg?: string[];
  stroke?: { color: string; align: "INSIDE" | "CENTER" | "OUTSIDE"; w?: number; sides?: number[]; dash?: boolean };
  radius?: number | number[] | string;
  clip?: boolean;
  bgImg?: { src: string; fit: "cover" | "contain" };
  kids?: GuideNode[];
}
export interface ImageNode extends Base {
  type: "img" | "art";
  src: string;
  name?: string;
}
export type GuideNode = TextNode | BoxNode | ImageNode;

export interface GuidePageData {
  n: number;
  id: string;
  num: string;
  section: string;
  title: string;
  bg: string[];
  nodes: GuideNode[];
}

export const u = (n: number) => (n === 0 ? "0" : `calc(var(--u) * ${Math.round(n * 100) / 100})`);
const pxToU = (s: string) => s.replace(/(-?[\d.]+)px/g, (_, n) => u(Number(n)));

/** Background layers: CSS draws the first on top, as extract.js orders them. */
export const background = (layers: string[]) =>
  layers.length === 1 && layers[0].startsWith("#")
    ? `background:${layers[0]}`
    : `background:${layers.map((l) => (l.startsWith("#") ? `linear-gradient(${l},${l})` : l)).join(",")}`;

const radiusCss = (r: BoxNode["radius"]) =>
  r === undefined ? [] : [`border-radius:${typeof r === "string" ? r : Array.isArray(r) ? r.map(u).join(" ") : u(r)}`];

export function strokeCss(stroke: NonNullable<BoxNode["stroke"]>) {
  const { color, align, w, sides, dash } = stroke;
  if (sides) return [`border-style:${dash ? "dashed" : "solid"}`, `border-color:${color}`, `border-width:${sides.map(u).join(" ")}`];
  if (!w) return [];
  const offset = align === "INSIDE" ? -w : align === "CENTER" ? -w / 2 : 0;
  return [`outline:${u(w)} ${dash ? "dashed" : "solid"} ${color}`, `outline-offset:${u(offset)}`];
}

/** A group's stroke is drawn by an overlay after its children (Figma paints it on top). */
export const strokeOverlay = (n: BoxNode) =>
  ["left:0", "top:0", "width:100%", "height:100%", "pointer-events:none", ...strokeCss(n.stroke!), ...radiusCss(n.radius)].join(";");

export function boxStyle(n: Base & Partial<BoxNode>, imgUrl?: string) {
  const s = [`left:${u(n.x)}`, `top:${u(n.y)}`, `width:${u(n.w)}`, `height:${u(n.h)}`];
  const layers = [...(n.bg ?? [])];
  if (imgUrl) layers.push(`center/${n.bgImg!.fit} no-repeat url("${imgUrl}")`);
  if (layers.length) s.push(background(layers));
  if (n.stroke && n.type !== "group") s.push(...strokeCss(n.stroke));
  s.push(...radiusCss(n.radius));
  if (n.clip) s.push("overflow:hidden");
  return [...s, ...common(n)].join(";");
}

export function common(n: Base) {
  const s: string[] = [];
  if (n.opacity !== undefined) s.push(`opacity:${n.opacity}`);
  if (n.rot) s.push(`transform-origin:0 0`, `transform:rotate(${-n.rot}deg)`);
  if (n.fx?.shadow) s.push(`box-shadow:${n.fx.shadow.map(pxToU).join(",")}`);
  // Figma's blur radius is roughly twice the CSS standard deviation.
  if (n.fx?.blur) s.push(`filter:blur(${u(n.fx.blur / 2)})`);
  if (n.fx?.backdrop) s.push(`backdrop-filter:blur(${u(n.fx.backdrop / 2)})`);
  return s;
}

const WEIGHT: Record<string, number> = { Regular: 400, Medium: 500, Bold: 700 };
const CASE = { UPPER: "text-transform:uppercase", LOWER: "text-transform:lowercase", TITLE: "text-transform:capitalize" } as Record<string, string>;

export function segStyle(g: Seg) {
  const s = [`font-size:${u(g.z)}`];
  if (g.f === "Inter") s.push(`font-family:"G Inter",sans-serif`, `font-weight:${WEIGHT[g.s] ?? 400}`);
  else if (g.f === "Times New Roman") s.push(`font-family:"Times New Roman",serif`);
  else s.push(`font-family:"G ${g.f} ${g.s}",sans-serif`);
  if (g.c) s.push(`color:${g.c}`);
  if (g.ls !== undefined) s.push(`letter-spacing:${typeof g.ls === "number" ? u(g.ls) : g.ls}`);
  if (g.lh !== undefined) s.push(`line-height:${typeof g.lh === "number" ? u(g.lh) : g.lh}`);
  if (g.tc && CASE[g.tc]) s.push(CASE[g.tc]);
  if (g.tc?.startsWith("SMALL_CAPS")) s.push("font-variant-caps:small-caps");
  if (g.td) s.push(`text-decoration:${g.td === "UNDERLINE" ? "underline" : "line-through"}`);
  return s.join(";");
}

const JUSTIFY = { TOP: "flex-start", CENTER: "center", BOTTOM: "flex-end" };
const ALIGN = { LEFT: "left", CENTER: "center", RIGHT: "right", JUSTIFIED: "justify" };
export const textStyle = (n: TextNode) =>
  [
    `left:${u(n.x)}`,
    `top:${u(n.y)}`,
    `width:${u(n.w)}`,
    `height:${u(n.h)}`,
    `justify-content:${JUSTIFY[n.valign]}`,
    `text-align:${ALIGN[n.align]}`,
    ...common(n),
  ].join(";");

/** Split a text node's segments into paragraphs (Figma lists are per paragraph). */
export function paragraphs(segs: Seg[]) {
  const paras: Seg[][] = [[]];
  for (const g of segs) {
    const parts = g.t.split("\n");
    parts.forEach((t, i) => {
      if (i > 0) paras.push([]);
      // Figma's soft return (U+2028) breaks the line within a paragraph.
      if (t) paras[paras.length - 1].push({ ...g, t: t.replace(/\u2028/g, "\n") });
    });
  }
  // Each paragraph keeps the style of the segment that opened it, for its strut.
  let last = segs[0];
  return paras.map((p) => {
    const head = p[0] ?? last;
    last = p[p.length - 1] ?? last;
    return { head, segs: p };
  });
}

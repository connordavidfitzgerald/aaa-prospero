// Runs inside the Figma plugin (figma_execute; see README). Installs globalThis.__guideExtract,
// which walks guideline frames into JSON + exported assets, POSTing everything
// to the local receiver at localhost:9230.
const SINK = "http://localhost:9230/";
const post = (path, body) => fetch(SINK + path, { method: "POST", body });

const hex = (c, a = 1) => {
  const h = "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
  return a < 1 ? h + Math.round(a * 255).toString(16).padStart(2, "0") : h;
};
const r2 = (n) => Math.round(n * 100) / 100;
const fnv = (bytes) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 7) h = Math.imul(h ^ bytes[i], 16777619) >>> 0;
  return (h >>> 0).toString(36) + bytes.length.toString(36);
};

const visibleFills = (n) => (Array.isArray(n.fills) ? n.fills.filter((f) => f.visible !== false && (f.opacity ?? 1) > 0) : []);
const visibleStrokes = (n) => (Array.isArray(n.strokes) ? n.strokes.filter((f) => f.visible !== false && (f.opacity ?? 1) > 0) : []);

function gradientCss(f) {
  const stops = f.gradientStops.map((s) => `${hex(s.color, s.color.a * (f.opacity ?? 1))} ${r2(s.position * 100)}%`).join(", ");
  if (f.type === "GRADIENT_RADIAL") return `radial-gradient(${stops})`;
  const [[a, b, c], [d, e, g]] = f.gradientTransform;
  // Inverse of the 2x3 affine, applied to the gradient's start/end handles.
  const det = a * e - b * d;
  const inv = (x, y) => [(e * (x - c) - b * (y - g)) / det, (-d * (x - c) + a * (y - g)) / det];
  const [x0, y0] = inv(0, 0.5);
  const [x1, y1] = inv(1, 0.5);
  const deg = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90;
  return `linear-gradient(${r2(deg)}deg, ${stops})`;
}

function paint(n) {
  const out = [];
  for (const f of visibleFills(n).reverse()) {
    if (f.type === "SOLID") out.push(hex(f.color, f.opacity ?? 1));
    else if (f.type.startsWith("GRADIENT")) out.push(gradientCss(f));
  }
  return out;
}

function stroke(n) {
  const s = visibleStrokes(n).find((p) => p.type === "SOLID");
  if (!s) return undefined;
  const o = { color: hex(s.color, s.opacity ?? 1), align: n.strokeAlign, dash: n.dashPattern && n.dashPattern.length ? true : undefined };
  if (typeof n.strokeTopWeight === "number" && [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight].some((w) => w !== n.strokeTopWeight)) {
    o.sides = [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight];
  } else o.w = n.strokeWeight === figma.mixed ? n.strokeTopWeight : n.strokeWeight;
  if (!o.sides && !o.w) return undefined;
  return o;
}

function radius(n) {
  if (n.type === "ELLIPSE") return "50%";
  if (n.cornerRadius === figma.mixed) return [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius];
  return n.cornerRadius || undefined;
}

function effects(n) {
  const out = {};
  for (const e of n.effects || []) {
    if (e.visible === false) continue;
    if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW")
      (out.shadow ||= []).push(`${e.type === "INNER_SHADOW" ? "inset " : ""}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread || 0}px ${hex(e.color, e.color.a)}`);
    if (e.type === "LAYER_BLUR") out.blur = e.radius;
    if (e.type === "BACKGROUND_BLUR") out.backdrop = e.radius;
  }
  return Object.keys(out).length ? out : undefined;
}

const ART_TYPES = new Set(["VECTOR", "BOOLEAN_OPERATION", "STAR", "POLYGON"]);
function scan(n) {
  const s = { text: 0, vec: 0, mask: 0, img: 0, rot: 0, maskRect: true };
  const visit = (c) => {
    if (c.visible === false) return;
    if (c.type === "TEXT") s.text++;
    if (ART_TYPES.has(c.type)) s.vec++;
    if (c.isMask) {
      s.mask++;
      if (!(c.type === "RECTANGLE" && !c.cornerRadius)) s.maskRect = false;
    }
    if (visibleFills(c).some((f) => f.type === "IMAGE")) s.img++;
    if (c.rotation && Math.abs(c.rotation) > 0.01 && c.type !== "LINE") s.rot++;
    if ("children" in c) c.children.forEach(visit);
  };
  visit(n);
  return s;
}

let ASSET_DIR = "";
let stats;
// Figma refuses to export nodes with nothing visible; skip those.
const safeExport = async (n, opts) => {
  try {
    return await n.exportAsync(opts);
  } catch (e) {
    return null;
  }
};
async function exportArt(n, s, why) {
  const bb = n.absoluteRenderBounds || n.absoluteBoundingBox;
  if (!bb || bb.width < 0.5 || bb.height < 0.5) return null;
  const big = Math.max(bb.width, bb.height);
  const raster = s.img > 0 || s.vec > 400;
  let bytes, ext;
  if (!raster) {
    bytes = await safeExport(n, { format: "SVG", svgOutlineText: true, svgIdAttribute: false });
    ext = "svg";
    if (bytes && bytes.length > 300000) bytes = null;
  }
  if (!bytes) {
    const scale = Math.max(0.5, Math.min(2, 1800 / big));
    const jpg = s.img > 0 && s.maskRect && s.vec === 0 && !(await hasPng(n)) && big >= 300;
    ext = jpg ? "jpg" : "png";
    bytes = await safeExport(n, { format: jpg ? "JPG" : "PNG", constraint: { type: "SCALE", value: scale } });
    if (!bytes) return null;
  }
  const name = `${fnv(bytes)}.${ext}`;
  await post(`${ASSET_DIR}/${name}`, bytes);
  stats.assets++;
  stats.bytes += bytes.length;
  return { type: "art", why, x: bb.x, y: bb.y, w: bb.width, h: bb.height, src: name, name: n.name, lostText: s.text || undefined };
}

// Source images that are PNGs may carry transparency (logos, cut-outs).
async function hasPng(n) {
  const nodes = "findAll" in n ? [n, ...n.findAll(() => true)] : [n];
  for (const c of nodes)
    for (const f of visibleFills(c))
      if (f.type === "IMAGE" && f.imageHash) {
        const im = figma.getImageByHash(f.imageHash);
        const b = im && (await im.getBytesAsync());
        if (!b) continue;
        if (b[0] === 0x89) return true;
      }
  return false;
}
async function imageFillNode(n) {
  const bb = n.absoluteRenderBounds || n.absoluteBoundingBox;
  const scale = Math.max(0.5, Math.min(2, 1800 / Math.max(bb.width, bb.height)));
  const png = (await hasPng(n)) || n.cornerRadius === figma.mixed || n.cornerRadius > 0 || n.type === "ELLIPSE";
  const bytes = await safeExport(n, { format: png ? "PNG" : "JPG", constraint: { type: "SCALE", value: scale } });
  if (!bytes) return null;
  const name = `${fnv(bytes)}.${png ? "png" : "jpg"}`;
  await post(`${ASSET_DIR}/${name}`, bytes);
  stats.assets++;
  stats.bytes += bytes.length;
  return { type: "img", x: bb.x, y: bb.y, w: bb.width, h: bb.height, src: name, opacity: n.opacity < 1 ? r2(n.opacity) : undefined };
}

async function imageFillBg(n) {
  // Background image on a container: send the source image, CSS fits it.
  const f = visibleFills(n).find((p) => p.type === "IMAGE");
  const img = figma.getImageByHash(f.imageHash);
  if (!img) return undefined;
  const bytes = await img.getBytesAsync();
  const isPng = bytes[0] === 0x89;
  const name = `${fnv(bytes)}.${isPng ? "png" : "jpg"}`;
  await post(`${ASSET_DIR}/${name}`, bytes);
  stats.assets++;
  stats.bytes += bytes.length;
  return { src: name, fit: f.scaleMode === "FIT" ? "contain" : "cover" };
}

function textNode(n) {
  const segs = n.getStyledTextSegments(["fontName", "fontSize", "fills", "letterSpacing", "lineHeight", "textCase", "textDecoration", "listOptions", "indentation"]);
  return {
    type: "text",
    align: n.textAlignHorizontal,
    valign: n.textAlignVertical,
    auto: n.textAutoResize,
    para: n.paragraphSpacing || undefined,
    paraIndent: n.paragraphIndent || undefined,
    segs: segs.map((s) => {
      const fill = s.fills.find((f) => f.visible !== false && f.type === "SOLID");
      return {
        t: s.characters,
        f: s.fontName.family,
        s: s.fontName.style,
        z: r2(s.fontSize),
        c: fill ? hex(fill.color, fill.opacity ?? 1) : undefined,
        ls: s.letterSpacing.value ? (s.letterSpacing.unit === "PERCENT" ? `${r2(s.letterSpacing.value / 100)}em` : r2(s.letterSpacing.value)) : undefined,
        lh: s.lineHeight.unit === "AUTO" ? undefined : s.lineHeight.unit === "PERCENT" ? `${r2(s.lineHeight.value / 100)}` : r2(s.lineHeight.value),
        tc: s.textCase !== "ORIGINAL" ? s.textCase : undefined,
        td: s.textDecoration !== "NONE" ? s.textDecoration : undefined,
        li: s.listOptions && s.listOptions.type !== "NONE" ? s.listOptions.type : undefined,
        ind: s.indentation || undefined,
      };
    }),
  };
}

async function walk(n) {
  if (n.visible === false || n.opacity === 0) return null;
  const t = n.absoluteTransform;
  const rot = n.rotation && Math.abs(n.rotation) > 0.01 ? r2(n.rotation) : undefined;
  const base = { x: t[0][2], y: t[1][2], w: n.width, h: n.height };
  const common = {
    opacity: n.opacity < 1 ? r2(n.opacity) : undefined,
    fx: effects(n),
    rot,
  };

  if (n.type === "TEXT") return { ...base, ...common, ...textNode(n), name: undefined };

  if (n.type === "LINE") {
    const s = visibleStrokes(n).find((p) => p.type === "SOLID");
    if (!s) return null;
    // A line is a box of its stroke weight along its length.
    const bb = n.absoluteBoundingBox;
    const w = n.strokeWeight;
    const vertical = Math.abs(Math.abs(n.rotation) - 90) < 1;
    return {
      type: "box",
      x: bb.x - (vertical ? w / 2 : 0),
      y: bb.y - (vertical ? 0 : w / 2),
      w: vertical ? w : bb.width,
      h: vertical ? bb.height : w,
      bg: [hex(s.color, s.opacity ?? 1)],
      dash: n.dashPattern && n.dashPattern.length ? true : undefined,
      opacity: common.opacity,
    };
  }

  const isContainer = "children" in n && n.type !== "BOOLEAN_OPERATION";
  const s = scan(n);
  if (ART_TYPES.has(n.type)) return exportArt(n, s, "vector");
  if (rot && n.type !== "TEXT") return exportArt(n, s, "rotated");
  if (isContainer) {
    const kidsVis = n.children.filter((c) => c.visible !== false);
    const m0 = kidsVis[0];
    if (m0 && m0.isMask && (m0.type === "RECTANGLE" || m0.type === "FRAME") && !m0.rotation && m0.cornerRadius !== figma.mixed && s.text > 0) {
      // A rectangular mask is just a clipping box around its siblings.
      const mt = m0.absoluteTransform;
      const g = { type: "group", x: mt[0][2], y: mt[1][2], w: m0.width, h: m0.height, clip: true, radius: m0.cornerRadius || undefined, opacity: common.opacity, kids: [] };
      for (const c of kidsVis.slice(1)) {
        const k = await walk(c);
        if (k) g.kids.push(k);
      }
      return g;
    }
    // Only masks among this container's own children; deeper ones are handled on the way down.
    if (kidsVis.some((c) => c.isMask)) return exportArt(n, s, "mask");
    if (s.text === 0 && (s.vec > 0 || n.type === "INSTANCE")) return exportArt(n, s, "art");
  }

  const fills = visibleFills(n);
  if (!isContainer && fills.some((f) => f.type === "IMAGE")) return imageFillNode(n);

  const node = {
    type: isContainer ? "group" : "box",
    ...base,
    ...common,
    bg: paint(n),
    stroke: stroke(n),
    radius: "cornerRadius" in n || n.type === "ELLIPSE" ? radius(n) : undefined,
    clip: n.clipsContent || undefined,
  };
  if (!node.bg.length) delete node.bg;
  if (isContainer && fills.some((f) => f.type === "IMAGE")) node.bgImg = await imageFillBg(n);
  if (isContainer) {
    node.kids = [];
    for (const c of n.children) {
      const k = await walk(c);
      if (k) node.kids.push(k);
    }
    // Plain groups with nothing of their own just pass their children up.
    if (n.type === "GROUP" && !node.bg && !node.stroke && !node.fx && !node.opacity) return { type: "flat", kids: node.kids };
  } else if (!node.bg && !node.stroke && !node.fx) return null;
  return node;
}

// Make coordinates relative to the parent container and drop undefined keys.
function relativise(nodes, ox, oy) {
  const out = [];
  for (const n of nodes) {
    if (n.type === "flat") {
      out.push(...relativise(n.kids, ox, oy));
      continue;
    }
    const m = {};
    for (const [k, v] of Object.entries(n)) if (v !== undefined) m[k] = v;
    m.x = r2(n.x - ox);
    m.y = r2(n.y - oy);
    m.w = r2(n.w);
    m.h = r2(n.h);
    if (n.kids) m.kids = relativise(n.kids, n.x, n.y);
    out.push(m);
  }
  return out;
}

globalThis.__guideExtract = async (brand, frameIds, startN) => {
  ASSET_DIR = `${brand}/assets`;
  const log = [];
  let n = startN;
  for (const id of frameIds) {
    stats = { assets: 0, bytes: 0 };
    const f = await figma.getNodeByIdAsync(id);
    const m = f.name.match(/^(\d+\.\d+)\s+(.*)$/);
    const [section, title] = m[2].includes(" — ") ? m[2].split(" — ") : [m[2], m[2]];
    const kids = [];
    for (const c of f.children) {
      const k = await walk(c);
      if (k) kids.push(k);
    }
    const bg = paint(f);
    const page = {
      n,
      id: f.id,
      num: m[1],
      section,
      title,
      bg: bg.length ? bg : ["#ffffff"],
      nodes: relativise(kids, f.absoluteTransform[0][2], f.absoluteTransform[1][2]),
    };
    await post(`${brand}/pages/${String(n).padStart(2, "0")}.json`, JSON.stringify(page));
    log.push(`${n} ${m[1]} assets=${stats.assets} kb=${Math.round(stats.bytes / 1024)}`);
    n++;
  }
  return log;
};
// Kick off a whole section without blocking the tool call; progress goes to
// <brand>/progress.txt.
globalThis.__guideRun = (brand, sectionId) => {
  (async () => {
    const s = await figma.getNodeByIdAsync(sectionId);
    const key = (f) => f.name.split(" ")[0].split(".").map(Number);
    const frames = s.children
      .filter((c) => c.type === "FRAME")
      .sort((a, b) => key(a)[0] - key(b)[0] || key(a)[1] - key(b)[1] || a.y - b.y || a.x - b.x);
    const done = [];
    for (let i = 0; i < frames.length; i++) {
      try {
        done.push(...(await globalThis.__guideExtract(brand, [frames[i].id], i + 1)));
      } catch (e) {
        done.push(`${i + 1} ERROR ${frames[i].name}: ${e && e.message}`);
      }
      await post(`${brand}/progress.txt`, done.join("\n") + `\n${i + 1}/${frames.length}`);
    }
    await post(`${brand}/progress.txt`, done.join("\n") + "\nDONE");
  })();
  return "started";
};
return "installed";

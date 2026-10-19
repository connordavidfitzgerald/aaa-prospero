import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { navigate } from "astro:transitions/client";
import type { WorkGL } from "./work-gl";

// Site-wide behaviour, loaded once and kept alive across Astro client-side
// navigations. Page controllers mount on `astro:page-load` and are torn down
// on `astro:before-swap`.

gsap.registerPlugin(SplitText);

const root = document.documentElement;
const preview = "preview" in root.dataset;
const reduced = preview || matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE = "expo.out";

/* ------------------------------------------------------------------ Lenis */

const lenis = reduced ? null : new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 });
if (lenis) {
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------------------------------------------------------------- Overlay */

// One open "menu" at a time (the chapter dropdown or the guideline sections).
let closeOpenMenu: (() => void) | null = null;

const overlay = () => document.querySelector<HTMLElement>("[data-nav-overlay]");

function showOverlay(show: boolean) {
  const el = overlay();
  if (!el) return;
  if (show) root.setAttribute("data-nav-open", "");
  else root.removeAttribute("data-nav-open");
  gsap.to(el, { autoAlpha: show ? 1 : 0, duration: show ? 0.45 : 0.3, ease: show ? "power2.out" : "power2.in" });
  if (show) lenis?.stop();
  else lenis?.start();
}

/** Open a dropdown list: overlay in, items rise in one after another. */
function openList(list: HTMLElement, items: Element[]) {
  gsap.killTweensOf([list, ...items]);
  gsap.set(list, { autoAlpha: 1 });
  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 10 },
    { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.022, delay: 0.05 },
  );
}

function closeList(list: HTMLElement, items: Element[], instant = false) {
  gsap.killTweensOf([list, ...items]);
  if (instant) return gsap.set(list, { autoAlpha: 0 });
  gsap.to(items, { autoAlpha: 0, y: -6, duration: 0.2, ease: "power2.in", stagger: { each: 0.008, from: "end" } });
  gsap.to(list, { autoAlpha: 0, duration: 0.2, delay: 0.18 });
}

/* -------------------------------------------------------------------- Nav */

function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!nav || nav.dataset.ready) return;
  nav.dataset.ready = "1";

  const toggle = nav.querySelector<HTMLButtonElement>("[data-nav-toggle]")!;
  const menu = nav.querySelector<HTMLElement>("[data-nav-menu]")!;
  // The menu fades as a whole; its links keep their CSS opacities.
  const fade = (show: boolean, instant = false) => {
    gsap.killTweensOf(menu);
    if (instant) return gsap.set(menu, { autoAlpha: 0 });
    gsap.to(menu, { autoAlpha: show ? 1 : 0, duration: show ? 0.4 : 0.2, ease: show ? "power2.out" : "power2.in" });
  };

  const close = (instant = false) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    toggle.setAttribute("aria-expanded", "false");
    fade(false, instant);
    showOverlay(false);
    closeOpenMenu = null;
  };
  const open = () => {
    closeOpenMenu?.();
    toggle.setAttribute("aria-expanded", "true");
    menu.scrollTop = 0;
    fade(true);
    showOverlay(true);
    closeOpenMenu = () => close();
  };

  toggle.addEventListener("click", () => (toggle.getAttribute("aria-expanded") === "true" ? close() : open()));
  overlay()?.addEventListener("click", () => closeOpenMenu?.());
  menu.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a")) close();
  });
}

/** Sync the persisted nav with the page that was just swapped in. */
function updateNav(first: boolean) {
  const main = document.getElementById("main");
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  if (!main || !nav) return;
  const { page = "", num = "", title = "", alt = "" } = main.dataset;
  const isIndex = page === "index";

  nav.querySelectorAll<HTMLAnchorElement>("[data-nav-lang], [data-nav-lang-mobile]").forEach((a) => (a.href = alt));

  const home = nav.querySelector<HTMLElement>("[data-home-label]");
  if (home) swapText(home, isIndex ? home.dataset.title! : home.dataset.index!, first);

  const toggle = nav.querySelector<HTMLElement>("[data-nav-toggle]")!;
  toggle.classList.toggle("opacity-0", isIndex);
  toggle.classList.toggle("pointer-events-none", isIndex);
  if (!isIndex) {
    swapText(nav.querySelector("[data-nav-num]")!, num, first);
    swapText(nav.querySelector("[data-nav-title]")!, title, first, 0.04);
  }

  const current = page.startsWith("member-") ? "team" : page;
  nav.querySelectorAll<HTMLElement>("[data-menu-link]").forEach((a) => {
    if (a.dataset.menuLink === current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

/** Roll a text label: old copy slides up out of its mask, new copy rises in. */
function swapText(el: HTMLElement, text: string, instant: boolean, delay = 0) {
  if (el.textContent === text) return;
  if (instant || reduced) {
    el.textContent = text;
    return;
  }
  gsap.killTweensOf(el);
  gsap
    .timeline({ delay })
    .to(el, { yPercent: -110, duration: 0.3, ease: "power3.in" })
    .add(() => {
      el.textContent = text;
    })
    .fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: EASE });
}

/* ------------------------------------------------------- Page transitions */

async function leave() {
  closeOpenMenu?.();
  const main = document.getElementById("main");
  if (!main || reduced) return;
  await gsap.to(main, { autoAlpha: 0, y: -14, duration: 0.42, ease: "power2.in" });
}

document.addEventListener("astro:before-preparation", (e) => {
  const original = e.loader;
  e.loader = async () => {
    await Promise.all([original(), leave()]);
  };
});

document.addEventListener("astro:before-swap", () => {
  teardown.forEach((fn) => fn());
  teardown = [];
});

document.addEventListener("astro:after-swap", () => {
  root.classList.add("js");
  root.removeAttribute("data-nav-open");
  gsap.set(overlay(), { autoAlpha: 0 });
  lenis?.scrollTo(0, { immediate: true, force: true });
  lenis?.start();
});

/* -------------------------------------------------------- Entrance motion */

// Reveal targets animate as they enter the viewport. Everything that becomes
// visible in the same frame is staggered top-to-bottom.
function initEntrances(main: HTMLElement) {
  const targets = main.querySelectorAll<HTMLElement>("[data-split], [data-reveal], [data-rule], [data-media], [data-bar]");
  if (reduced) {
    gsap.set(targets, { visibility: "visible" });
    return () => {};
  }

  gsap.set(main.querySelectorAll("[data-rule]"), { "--rule": 0 });
  gsap.set(main.querySelectorAll("[data-bar]"), { scaleX: 0 });

  const splits: SplitText[] = [];
  let queue: HTMLElement[] = [];
  let raf = 0;

  const play = (el: HTMLElement, delay: number) => {
    if (el.matches("[data-split]")) {
      gsap.set(el, { visibility: "visible" });
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 105, duration: 1, ease: EASE, stagger: 0.07, delay }),
      });
      splits.push(split);
    } else if (el.matches("[data-media]")) {
      const inner = el.firstElementChild;
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", delay },
      );
      if (inner) gsap.fromTo(inner, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: EASE, delay });
    } else if (el.matches("[data-rule]")) {
      gsap.to(el, { "--rule": 1, duration: 1.2, ease: "expo.inOut", delay });
    } else if (el.matches("[data-bar]")) {
      gsap.to(el, { scaleX: 1, duration: 1.4, ease: "expo.inOut", delay: delay + 0.2 });
    } else {
      gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, delay });
    }
  };

  const flush = () => {
    raf = 0;
    queue
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      .forEach((el, i) => play(el, 0.08 + Math.min(i * 0.035, 0.7)));
    queue = [];
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        queue.push(entry.target as HTMLElement);
      }
      if (queue.length && !raf) raf = requestAnimationFrame(flush);
    },
    { rootMargin: "0px 0px -6% 0px" },
  );

  // Pinned (fixed, full-screen) views never scroll, so their bottom row would
  // never clear the observer's margin: reveal those as soon as fonts load.
  document.fonts.ready.then(() => {
    targets.forEach((el) => (el.closest("[data-pinned]") ? queue.push(el) : io.observe(el)));
    if (queue.length && !raf) raf = requestAnimationFrame(flush);
  });

  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    splits.forEach((s) => s.revert());
  };
}

/* ---------------------------------------------------------- Team list */

// After aaa-next: hovering a row drops a green bar over it and swaps the
// centred picture to that member. On touch layouts the row nearest the
// sticky picture is highlighted as you scroll, and tapping the picture opens
// that member.
function initTeam(main: HTMLElement) {
  const list = main.querySelector<HTMLElement>("[data-team]");
  if (!list) return;
  const sticky = list.querySelector<HTMLElement>("[data-team-sticky]")!;
  const frame = list.querySelector<HTMLElement>("[data-team-frame]")!;
  const rows = [...list.querySelectorAll<HTMLAnchorElement>("[data-team-row]")];
  const imgs = [...list.querySelectorAll<HTMLElement>("[data-team-img]")];
  const bar = (row: HTMLElement) => row.querySelector<HTMLElement>("[data-team-hl]")!;
  const picture = (slug: string | null) =>
    imgs.forEach((img) => gsap.set(img, { opacity: img.dataset.teamImg === slug ? 1 : 0 }));

  let active: string | null = null;
  const offs: (() => void)[] = [];
  const on = (el: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    el.addEventListener(type, fn, opts);
    offs.push(() => el.removeEventListener(type, fn));
  };

  if (matchMedia("(min-width: 48rem) and (hover: hover)").matches) {
    rows.forEach((row) => {
      const hl = bar(row);
      on(row, "mouseenter", () => {
        gsap.to(hl, { scaleY: 1, transformOrigin: "center top", duration: 0.25, ease: "power3.out", overwrite: true });
        picture(row.dataset.teamRow!);
      });
      on(row, "mouseleave", () => {
        gsap.to(hl, { scaleY: 0, transformOrigin: "center bottom", duration: 0.05, ease: "power3.out", overwrite: true });
        picture(null);
      });
    });
  } else {
    // Detection line sits just below the sticky picture, so the active name
    // is always in clear view.
    const update = () => {
      const top = sticky.getBoundingClientRect().bottom;
      const line = top + (innerHeight - top) * 0.1;
      let best: HTMLElement | null = null;
      let dist = Infinity;
      for (const row of rows) {
        const r = row.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < dist) [dist, best] = [d, row];
      }
      const pastEnd = rows[rows.length - 1].getBoundingClientRect().bottom < line;
      const slug = pastEnd || !best ? null : best.dataset.teamRow!;
      if (slug === active) return;
      active = slug;
      rows.forEach((row) =>
        gsap.to(bar(row), { scaleY: row.dataset.teamRow === slug ? 1 : 0, duration: 0.2, ease: "power3.out", overwrite: true }),
      );
      picture(slug);
    };
    let raf = 0;
    const queue = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    on(window, "scroll", queue, { passive: true });
    on(window, "resize", queue);
    on(frame, "click", () => active && navigate(rows.find((r) => r.dataset.teamRow === active)!.href));
    offs.push(() => cancelAnimationFrame(raf));
    update();
  }

  teardown.push(() => offs.forEach((off) => off()));
}

/* ---------------------------------------------------------- Row links */

// Table rows can't be wrapped in a link, so a row with data-row-href opens
// its page when clicked anywhere; its label carries the real <a>.
function initRowLinks(main: HTMLElement) {
  const click = (e: MouseEvent) => {
    const row = (e.target as Element).closest<HTMLElement>("[data-row-href]");
    if (!row || (e.target as Element).closest("a") || getSelection()?.toString()) return;
    navigate(row.dataset.rowHref!);
  };
  main.addEventListener("click", click);
  teardown.push(() => main.removeEventListener("click", click));
}

/* -------------------------------------------------------- Work index */

function initWork(main: HTMLElement) {
  const work = main.querySelector<HTMLElement>("[data-work]");
  if (!work) return;
  let active = "";

  // Desktop pointers get the WebGL thumbnails. Their media is taken out of
  // the shared entrance (the GL planes run their own); if WebGL can't start,
  // the DOM pictures fade back in.
  let gl: WorkGL | null = null;
  let dead = false;
  const canvas = work.querySelector<HTMLCanvasElement>("[data-work-gl]");
  if (canvas && !reduced && matchMedia("(min-width: 48rem) and (hover: hover)").matches) {
    const media = [...work.querySelectorAll<HTMLElement>("[data-work-item] [data-media]")];
    work.dataset.gl = "";
    media.forEach((m) => m.removeAttribute("data-media"));
    import("./work-gl")
      .then(({ mountWorkGL }) => mountWorkGL(work, canvas))
      .then((g) => {
        if (dead) return g.destroy();
        gl = g;
        if (active) gl.hover(active);
      })
      .catch((err) => {
        console.warn("Work WebGL unavailable", err);
        if (dead) return;
        delete work.dataset.gl;
        gsap.fromTo(work.querySelectorAll(".work-img"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.06 });
      });
  }

  work.querySelectorAll<HTMLElement>("[data-work-item]").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      active = item.dataset.workItem!;
      gl?.hover(active);
    });
    item.addEventListener("mouseleave", () => {
      active = "";
      gl?.hover("");
    });
  });
  teardown.push(() => {
    dead = true;
    gl?.destroy();
  });
}

/* ------------------------------------------------- Project media strip */

// Clicking (or tapping) the left or right half of the screen steps one image
// back or forward; the cursor shows which way. The arrow keys step too. The
// strip doesn't scroll by itself: no wheel, trackpad or swipe.
let stripStep: ((dir: number) => boolean) | null = null;
function initStrip(main: HTMLElement) {
  const strip = main.querySelector<HTMLElement>("[data-strip]");
  if (!strip) return;
  const count = strip.children.length;
  let index = 0;
  const go = (n: number) => {
    index = n;
    gsap.to(strip, { scrollLeft: n * strip.clientWidth, duration: reduced ? 0 : 0.9, ease: "power3.out", overwrite: true });
  };

  const dirAt = (x: number) => {
    const dir = x < innerWidth / 2 ? -1 : 1;
    const n = index + dir;
    return n >= 0 && n < count ? dir : 0;
  };
  const onClick = (e: MouseEvent) => {
    if (closeOpenMenu) return;
    const dir = dirAt(e.clientX);
    if (dir) go(index + dir);
    strip.dataset.dir = String(dirAt(e.clientX));
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") strip.dataset.dir = String(dirAt(e.clientX));
  };
  // Keep the current image in place when the window changes size.
  const onResize = () => {
    gsap.killTweensOf(strip);
    strip.scrollLeft = index * strip.clientWidth;
  };

  // The arrow keys step through the media first, then on to the next page.
  stripStep = (dir) => {
    const n = index + dir;
    if (n < 0 || n >= count) return false;
    go(n);
    return true;
  };

  strip.addEventListener("click", onClick);
  strip.addEventListener("pointermove", onMove);
  addEventListener("resize", onResize);
  teardown.push(() => {
    stripStep = null;
    removeEventListener("resize", onResize);
  });
}

/* ------------------------------------------------- Project +Info panel */

// +Info opens the project description over a dark scrim on the imagery. It
// shares the one-open-menu slot with the nav, so either closes the other.
function initInfo(main: HTMLElement) {
  const toggle = main.querySelector<HTMLButtonElement>("[data-info-toggle]");
  if (!toggle) return;
  const panel = main.querySelector<HTMLElement>("[data-info-panel]")!;
  const scrim = main.querySelector<HTMLElement>("[data-info-overlay]")!;
  const label = toggle.querySelector<HTMLElement>("[data-info-label]")!;
  const items = [...panel.querySelectorAll("[data-info-item]")];

  const close = () => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    toggle.setAttribute("aria-expanded", "false");
    swapText(label, toggle.dataset.closed!, false);
    closeList(panel, items);
    gsap.to(scrim, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
    closeOpenMenu = null;
  };
  const open = () => {
    closeOpenMenu?.();
    toggle.setAttribute("aria-expanded", "true");
    swapText(label, toggle.dataset.open!, false);
    openList(panel, items);
    gsap.to(scrim, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
    closeOpenMenu = close;
  };

  toggle.addEventListener("click", () => (toggle.getAttribute("aria-expanded") === "true" ? close() : open()));
  scrim.addEventListener("click", close);
  teardown.push(() => {
    if (closeOpenMenu === close) closeOpenMenu = null;
  });
}

/* ------------------------------------------------------ Mux video */

async function initVideos(main: HTMLElement) {
  const videos = main.querySelectorAll<HTMLVideoElement>("mux-video");
  if (!videos.length || preview) return;
  await import("@mux/mux-video");

  // Play only while on screen.
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      }),
    { threshold: 0.25 },
  );
  videos.forEach((v) => io.observe(v));
  teardown.push(() => io.disconnect());

  // Text controls for the member video.
  main.querySelectorAll<HTMLElement>("[data-player]").forEach((wrap) => {
    const v = wrap.querySelector<HTMLVideoElement>("mux-video")!;
    const play = wrap.querySelector<HTMLButtonElement>("[data-play]")!;
    const mute = wrap.querySelector<HTMLButtonElement>("[data-mute]")!;
    const time = wrap.querySelector<HTMLElement>("[data-time]")!;
    const scrub = wrap.querySelector<HTMLElement>("[data-scrub]")!;
    const bar = wrap.querySelector<HTMLElement>("[data-progress]")!;
    const fmt = (s: number) => {
      s = isFinite(s) ? Math.max(0, s) : 0;
      return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    };
    const sync = () => {
      play.textContent = v.paused ? play.dataset.off! : play.dataset.on!;
      mute.textContent = v.muted ? mute.dataset.off! : mute.dataset.on!;
      time.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`;
      bar.style.transform = `scaleX(${v.duration ? v.currentTime / v.duration : 0})`;
    };
    ["play", "pause", "timeupdate", "volumechange", "loadedmetadata"].forEach((ev) => v.addEventListener(ev, sync));
    play.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
    mute.addEventListener("click", () => (v.muted = !v.muted));
    v.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
    const seek = (e: PointerEvent) => {
      const r = scrub.getBoundingClientRect();
      if (v.duration) v.currentTime = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width) * v.duration;
    };
    scrub.addEventListener("pointerdown", (e) => {
      seek(e);
      const move = (ev: PointerEvent) => seek(ev);
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
    sync();
  });
}

/* --------------------------------------------------- Guideline viewer */

interface GuidePage {
  n: number;
  num: string;
  title: string;
  section: string;
}

function initGuidelines(main: HTMLElement) {
  const guide = main.querySelector<HTMLElement>("[data-guide]");
  if (!guide) return;
  const pages: GuidePage[] = JSON.parse(guide.querySelector("[data-guide-pages]")!.textContent!);
  const grid = guide.querySelector<HTMLElement>("[data-guide-grid]")!;
  const full = guide.querySelector<HTMLElement>("[data-guide-full]")!;
  const stage = guide.querySelector<HTMLElement>("[data-guide-stage]")!;
  const count = guide.querySelector<HTMLElement>("[data-guide-count]")!;
  const subToggle = guide.querySelector<HTMLButtonElement>("[data-guide-sub-toggle]")!;
  const subLabel = guide.querySelector<HTMLElement>("[data-guide-sub-label]")!;
  const sections = guide.querySelector<HTMLElement>("[data-guide-sections]")!;
  const secButtons = [...sections.querySelectorAll<HTMLButtonElement>("[data-guide-sec]")];
  const labels = Object.fromEntries(secButtons.map((b) => [b.dataset.guideSec!, b.textContent!.trim()]));

  let currentN = 0;
  // Pages are HTML; the full view is a copy of the grid's, with the small
  // thumbnail images swapped for full-size ones.
  const fullPage = (n: number) => {
    const page = grid.querySelector<HTMLElement>(`[data-gp="${n}"]`)!.cloneNode(true) as HTMLElement;
    page.className = "gp";
    page.style.cssText += ";position:absolute;inset:0;width:100%;height:100%";
    page.querySelectorAll<HTMLImageElement>("img").forEach((im) => {
      im.loading = "eager";
      if (im.dataset.full) im.src = im.dataset.full;
    });
    page.querySelectorAll<HTMLElement>("[data-full-bg]").forEach((el) => {
      el.style.backgroundImage = el.style.backgroundImage.replace(/url\("?[^")]*"?\)/, `url("${el.dataset.fullBg}")`);
    });
    return page;
  };
  const decoded = (page: HTMLElement) =>
    Promise.all([...page.querySelectorAll("img")].map((im) => im.decode().catch(() => {})));
  const preload = (n: number) => {
    if (n >= 1 && n <= pages.length) decoded(fullPage(n));
  };

  const showPage = (n: number, dir = 1) => {
    n = ((n - 1 + pages.length) % pages.length) + 1;
    const p = pages[n - 1];
    const img = fullPage(n);
    img.setAttribute("role", "img");
    img.setAttribute("aria-label", `${p.num} ${p.title}`);
    stage.appendChild(img);
    const old = [...stage.children].filter((c) => c !== img);
    const reveal = () => {
      if (reduced || !currentN) {
        old.forEach((o) => o.remove());
        return;
      }
      gsap.fromTo(
        img,
        { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "expo.inOut",
          onComplete: () => old.forEach((o) => o.remove()),
        },
      );
      gsap.to(old, { x: dir > 0 ? "-6%" : "6%", duration: 0.9, ease: "expo.inOut" });
    };
    decoded(img).then(reveal);

    currentN = n;
    count.textContent = `${n} / ${pages.length}`;
    swapText(subLabel, labels[p.section], false);
    secButtons.forEach((b) => b.setAttribute("aria-current", String(b.dataset.guideSec === p.section)));
    history.replaceState(history.state, "", `#p${n}`);
    preload(n + 1);
    preload(n - 1);
  };

  const enterFull = (n: number) => {
    root.dataset.viewer = "full";
    grid.classList.add("hidden");
    full.classList.remove("hidden");
    gsap.to(subToggle, { autoAlpha: 1, duration: 0.4 });
    lenis?.scrollTo(0, { immediate: true });
    if (!reduced) gsap.fromTo(full, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE });
    showPage(n);
  };
  const exitFull = () => {
    delete root.dataset.viewer;
    closeSections();
    full.classList.add("hidden");
    grid.classList.remove("hidden");
    gsap.to(subToggle, { autoAlpha: 0, duration: 0.3 });
    stage.replaceChildren();
    currentN = 0;
    history.replaceState(history.state, "", location.pathname);
    if (!reduced)
      gsap.fromTo(grid.querySelectorAll("li"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.01 });
  };

  // Section dropdown under the nav title.
  const sectionItems = [...sections.children];
  const closeSections = () => {
    if (subToggle.getAttribute("aria-expanded") !== "true") return;
    subToggle.setAttribute("aria-expanded", "false");
    closeList(sections, sectionItems);
    showOverlay(false);
    closeOpenMenu = null;
  };
  subToggle.addEventListener("click", () => {
    if (subToggle.getAttribute("aria-expanded") === "true") return closeSections();
    closeOpenMenu?.();
    subToggle.setAttribute("aria-expanded", "true");
    openList(sections, sectionItems);
    showOverlay(true);
    closeOpenMenu = closeSections;
  });

  guide.addEventListener("click", (e) => {
    const t = (e.target as Element).closest<HTMLElement>("[data-guide-goto]");
    if (t) {
      const n = Number(t.dataset.guideGoto);
      if (t.dataset.guideSec) closeSections();
      if (currentN) showPage(n, n >= currentN ? 1 : -1);
      else enterFull(n);
    }
    if ((e.target as Element).closest("[data-guide-close]")) exitFull();
    if ((e.target as Element).closest("[data-guide-next], [data-guide-next-mobile]")) showPage(currentN + 1, 1);
    if ((e.target as Element).closest("[data-guide-prev]")) showPage(currentN - 1, -1);
  });

  const onKey = (e: KeyboardEvent) => {
    if (!currentN) return;
    if (e.key === "ArrowRight") showPage(currentN + 1, 1);
    else if (e.key === "ArrowLeft") showPage(currentN - 1, -1);
    else if (e.key === "Escape" && !closeOpenMenu) exitFull();
  };
  window.addEventListener("keydown", onKey);

  const fromHash = Number(location.hash.match(/^#p(\d+)$/)?.[1]);
  if (fromHash >= 1 && fromHash <= pages.length) enterFull(fromHash);

  teardown.push(() => {
    window.removeEventListener("keydown", onKey);
    delete root.dataset.viewer;
  });
}

/* ------------------------------------------------- Index page preview */

// Hovering a page in the Index shows that page, live and scaled down, in the
// right-hand columns. Each page loads once into its own iframe (?preview
// renders it still) and is wiped in when ready; the last few stay cached.
function initPreview(main: HTMLElement) {
  const pane = main.querySelector<HTMLElement>("[data-preview-frame]");
  const list = main.querySelector<HTMLElement>("[data-preview-list]");
  if (!pane || !list || !matchMedia("(min-width: 48rem) and (hover: hover)").matches) return;

  const W = 1440;
  const H = 900;
  const fit = () => pane.style.setProperty("--s", String(pane.clientWidth / W));
  const ro = new ResizeObserver(fit);
  ro.observe(pane);
  fit();

  const frames = new Map<string, HTMLIFrameElement>();
  const ready = new WeakSet<HTMLIFrameElement>();
  let current: HTMLIFrameElement | null = null;
  let want = "";
  let timer = 0;
  let z = 1;

  const reveal = (url: string) => {
    const f = frames.get(url);
    if (!f || url !== want || f === current || !ready.has(f)) return;
    const prev = current;
    current = f;
    f.style.zIndex = String(++z);
    gsap.killTweensOf(f);
    gsap.fromTo(
      f,
      { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        ease: "expo.out",
        onComplete: () => {
          if (prev && prev !== current) gsap.set(prev, { autoAlpha: 0 });
        },
      },
    );
  };

  const load = (url: string) => {
    if (frames.has(url)) return;
    const f = document.createElement("iframe");
    f.src = `${url}?preview`;
    f.tabIndex = -1;
    f.title = "";
    f.setAttribute("aria-hidden", "true");
    f.style.cssText = `position:absolute;top:0;left:0;width:${W}px;height:${H}px;border:0;transform:scale(var(--s));transform-origin:0 0;visibility:hidden;pointer-events:none`;
    f.addEventListener("load", () => {
      const doc = f.contentDocument;
      const done = () => {
        ready.add(f);
        reveal(url);
      };
      if (doc) doc.fonts.ready.then(() => requestAnimationFrame(done));
      else done();
    });
    pane.appendChild(f);
    frames.set(url, f);
    // Keep the most recent pages only.
    for (const [key, old] of frames) {
      if (frames.size <= 10) break;
      if (old === current || key === url) continue;
      old.remove();
      frames.delete(key);
    }
  };

  const show = (url: string) => {
    want = url;
    clearTimeout(timer);
    if (frames.has(url)) return reveal(url);
    // Brief hover intent, so sweeping down the list doesn't load every page.
    timer = window.setTimeout(() => load(url), 80);
  };
  const hide = () => {
    want = "";
    clearTimeout(timer);
    if (!current) return;
    gsap.to(current, { autoAlpha: 0, duration: 0.35, ease: "power2.out" });
    current = null;
  };

  const onOver = (e: Event) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (a && list.contains(a)) show(a.getAttribute("href")!);
  };
  list.addEventListener("mouseover", onOver);
  list.addEventListener("focusin", onOver);
  list.addEventListener("mouseleave", hide);
  teardown.push(() => {
    ro.disconnect();
    clearTimeout(timer);
  });
}

/* ---------------------------------------------------------- Keyboard */

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return closeOpenMenu?.();
  if (e.metaKey || e.ctrlKey || e.altKey || root.dataset.viewer || closeOpenMenu) return;
  if ((e.target as Element).closest("input, textarea, [contenteditable]")) return;
  const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
  if (dir && stripStep?.(dir)) return;
  const main = document.getElementById("main");
  const to = dir > 0 ? main?.dataset.next : dir < 0 ? main?.dataset.prev : undefined;
  if (to) navigate(to);
});

/* ------------------------------------------------------------ Boot */

let teardown: (() => void)[] = [];
let firstLoad = true;

document.addEventListener("astro:page-load", () => {
  const main = document.getElementById("main");
  if (!main) return;
  initNav();
  updateNav(firstLoad);
  firstLoad = false;

  // The new <main> must never keep a transform: it would trap the fixed
  // elements inside it (team preview, guideline section switcher).
  if (!reduced) gsap.fromTo(main, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });

  initWork(main);
  teardown.push(initEntrances(main));
  initTeam(main);
  initRowLinks(main);
  initPreview(main);
  initStrip(main);
  initInfo(main);
  initGuidelines(main);
  initVideos(main);
});

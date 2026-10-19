import * as THREE from "three";
import gsap from "gsap";

// Selected projects, in WebGL. The DOM thumbnails stay in place for layout,
// links and hit-testing; each one is redrawn here as a plane at the same
// pixel rect. Hovering lifts the plane toward the cursor, bulges the sheet
// under it and floods it with colour from the pointer outward. Moving fast
// splits the channels a little.

const VERT = /* glsl */ `
  uniform vec2 uMouse;
  uniform vec2 uSize;
  uniform float uHover;
  varying vec2 vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec2 d = (uv - uMouse) * uSize / max(uSize.x, uSize.y);
    float lift = exp(-dot(d, d) * 14.0) * uHover;
    p.z += lift * 0.09;
    vLift = lift;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uCover;
  uniform vec2 uMouse;
  uniform vec2 uSize;
  uniform vec2 uVel;
  uniform float uColor;
  uniform float uReveal;
  uniform float uZoom;
  uniform float uTime;
  varying vec2 vUv;
  varying float vLift;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.0), f.x), f.y);
  }

  void main() {
    // Entrance: wiped up from the bottom, like the site's other media.
    if (vUv.y > uReveal) discard;

    // object-fit: cover, zoomed, with a slight lens under the cursor.
    vec2 uv = (vUv - 0.5) * uCover / uZoom + 0.5;
    uv -= (vUv - uMouse) * vLift * 0.06;

    vec2 shift = uVel * 0.6;
    vec3 col = vec3(
      texture2D(uTex, uv + shift).r,
      texture2D(uTex, uv).g,
      texture2D(uTex, uv - shift).b
    );
    // Same weights as CSS grayscale(), so the swap from the DOM is invisible.
    vec3 grey = vec3(dot(col, vec3(0.2126, 0.7152, 0.0722)));

    vec2 aspect = uSize / max(uSize.x, uSize.y);
    float dist = length((vUv - uMouse) * aspect);
    dist += (noise(vUv * aspect * 7.0 + uTime * 0.25) - 0.5) * 0.12;
    float r = uColor * 1.5 - 0.05;
    float fill = smoothstep(r, r - 0.025, dist);

    col = mix(grey, col, fill);
    gl_FragColor = vec4(col, 1.0);
  }
`;

interface Plane {
  key: string;
  el: HTMLElement;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  u: Record<string, THREE.IUniform>;
  /** Pixel rect relative to the section. */
  rect: { x: number; y: number; w: number; h: number };
  img: { w: number; h: number };
  hover: number;
  /** Entrance zoom (tweened) and hover zoom (eased per frame); uZoom is both. */
  zoom: { intro: number; hover: number };
  tilt: { x: number; y: number };
  mouse: THREE.Vector2;
}

export interface WorkGL {
  hover(key: string): void;
  destroy(): void;
}

const loadTexture = (src: string) =>
  new Promise<THREE.Texture>((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, resolve, undefined, reject);
  });

export async function mountWorkGL(section: HTMLElement, canvas: HTMLCanvasElement): Promise<WorkGL> {
  const items = [...section.querySelectorAll<HTMLElement>("[data-work-item]")];
  const textures = await Promise.all(items.map((el) => loadTexture(el.dataset.workSrc!)));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass texels through untouched
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const DIST = 1000;
  const camera = new THREE.PerspectiveCamera(45, 1, 10, 4000);
  camera.position.z = DIST;

  const geometry = new THREE.PlaneGeometry(1, 1, 48, 32);
  const planes: Plane[] = items.map((el, i) => {
    const tex = textures[i];
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const u: Record<string, THREE.IUniform> = {
      uTex: { value: tex },
      uCover: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uSize: { value: new THREE.Vector2(1, 1) },
      uVel: { value: new THREE.Vector2() },
      uHover: { value: 0 },
      uColor: { value: 0 },
      uReveal: { value: 0 },
      uZoom: { value: 1.12 },
      uTime: { value: 0 },
    };
    const mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG }));
    group.add(mesh);
    const image = tex.image as HTMLImageElement;
    return {
      key: el.dataset.workItem!,
      el,
      mesh,
      u,
      rect: { x: 0, y: 0, w: 1, h: 1 },
      img: { w: image.naturalWidth || image.width, h: image.naturalHeight || image.height },
      hover: 0,
      zoom: { intro: 1.12, hover: 1 },
      tilt: { x: 0, y: 0 },
      mouse: new THREE.Vector2(0.5, 0.5),
    };
  });

  // Match the camera so one unit is one CSS pixel at z = 0, then lay every
  // plane over its DOM thumbnail.
  let W = 1;
  let H = 1;
  const layout = () => {
    const box = section.getBoundingClientRect();
    W = Math.max(1, box.width);
    H = Math.max(1, box.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = (2 * Math.atan(H / 2 / DIST) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    for (const p of planes) {
      const media = p.el.querySelector<HTMLElement>(".work-img") ?? p.el;
      const r = media.getBoundingClientRect();
      p.rect = { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
      p.mesh.scale.set(r.width, r.height, r.width);
      p.mesh.position.x = p.rect.x + r.width / 2 - W / 2;
      p.mesh.position.y = H / 2 - (p.rect.y + r.height / 2);
      p.u.uSize.value.set(r.width, r.height);
      const plane = r.width / r.height;
      const img = p.img.w / p.img.h;
      p.u.uCover.value.set(img > plane ? plane / img : 1, img > plane ? 1 : img / plane);
    }
  };
  const ro = new ResizeObserver(layout);
  ro.observe(section);
  layout();

  // Pointer, in section pixels, plus a smoothed velocity for the RGB split.
  const pointer = { x: W / 2, y: H / 2, px: W / 2, py: H / 2, vx: 0, vy: 0, inside: false };
  const onMove = (e: PointerEvent) => {
    const box = section.getBoundingClientRect();
    pointer.x = e.clientX - box.left;
    pointer.y = e.clientY - box.top;
    pointer.inside = true;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let active = "";
  const hover = (key: string) => {
    active = key;
    for (const p of planes) {
      const on = p.key === key;
      gsap.to(p.u.uColor, {
        value: on ? 1 : 0,
        duration: on ? 1.4 : 0.7,
        ease: on ? "expo.out" : "power3.out",
        overwrite: true,
      });
    }
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const tick = (time: number) => {
    pointer.vx = lerp(pointer.vx, pointer.x - pointer.px, 0.12);
    pointer.vy = lerp(pointer.vy, pointer.y - pointer.py, 0.12);
    pointer.px = pointer.x;
    pointer.py = pointer.y;

    // The whole row leans gently after the cursor.
    const nx = pointer.inside ? pointer.x / W - 0.5 : 0;
    const ny = pointer.inside ? pointer.y / H - 0.5 : 0;
    group.rotation.y = lerp(group.rotation.y, nx * 0.12, 0.05);
    group.rotation.x = lerp(group.rotation.x, ny * 0.08, 0.05);

    for (const p of planes) {
      const on = p.key === active;
      p.hover = lerp(p.hover, on ? 1 : 0, 0.08);
      // Hovered plane comes forward, the others fall back.
      p.mesh.position.z = lerp(p.mesh.position.z, on ? 60 : active ? -80 : 0, 0.07);

      const mx = (pointer.x - p.rect.x) / p.rect.w;
      const my = 1 - (pointer.y - p.rect.y) / p.rect.h;
      if (on) p.mouse.set(gsap.utils.clamp(-0.2, 1.2, mx), gsap.utils.clamp(-0.2, 1.2, my));
      p.u.uMouse.value.lerp(p.mouse, 0.15);

      // The edge under the cursor lifts toward the viewer.
      p.tilt.y = lerp(p.tilt.y, on ? -(p.u.uMouse.value.x - 0.5) * 0.35 : 0, 0.08);
      p.tilt.x = lerp(p.tilt.x, on ? (p.u.uMouse.value.y - 0.5) * 0.35 : 0, 0.08);
      p.mesh.rotation.set(p.tilt.x, p.tilt.y, 0);

      p.u.uHover.value = p.hover;
      p.zoom.hover = lerp(p.zoom.hover, on ? 1.06 : 1, 0.06);
      p.u.uZoom.value = p.zoom.intro * p.zoom.hover;
      p.u.uVel.value.set(
        gsap.utils.clamp(-0.02, 0.02, (pointer.vx / p.rect.w) * 0.25) * p.hover,
        gsap.utils.clamp(-0.02, 0.02, (-pointer.vy / p.rect.h) * 0.25) * p.hover,
      );
      p.u.uTime.value = time;
    }
    renderer.render(scene, camera);
  };

  // Entrance: each plane wipes up and settles from a slight zoom, in turn.
  planes.forEach((p, i) => {
    const delay = 0.1 + i * 0.08;
    gsap.to(p.u.uReveal, { value: 1, duration: 1.3, ease: "expo.inOut", delay });
    gsap.to(p.zoom, { intro: 1, duration: 1.8, ease: "expo.out", delay });
  });

  gsap.ticker.add(tick);

  return {
    hover,
    destroy() {
      gsap.ticker.remove(tick);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      planes.forEach((p) => {
        gsap.killTweensOf([p.u.uColor, p.u.uReveal, p.zoom]);
        p.mesh.material.dispose();
      });
      textures.forEach((t) => t.dispose());
      geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

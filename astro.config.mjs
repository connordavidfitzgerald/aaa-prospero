// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // mux-video is imported lazily on pages with video; pre-bundle it so the
    // dev server doesn't discover it late and serve a stale chunk.
    optimizeDeps: { include: ["@mux/mux-video"] },
  },
});

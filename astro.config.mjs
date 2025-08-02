// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://talesign.com/",
  integrations: [react(), sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
      wrap: false,
      defaultColor: 'light-dark()',
    },
  },
  redirects: {
    "/discipline/algorithmic-art": "/",
    "/discipline/book-design": "/",
    "/discipline/campaigns": "/",
    "/discipline/brand-identity": "/",
    "/work/mozone": "/",
    "/work/mandelbrot": "/",
    "/work/wit-it": "/",
    "/discipline/digital-design": "/",
    "/work/shukram": "/",
    "/work/liber-consulting": "/",
    "/work/tia-maria": "/",
    "/work/truth-belief-justification": "/",
  }
});

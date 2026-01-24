// @ts-check
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://2026.andymerskin.com",
  integrations: [mdx(), sitemap(), vue()],

  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {
    "/": "/hello",
    "/work": "/work/public",
  },

  adapter: netlify({
    imageCDN: false,
  }),

  output: "static",
});

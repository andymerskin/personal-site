// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), vue()],

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

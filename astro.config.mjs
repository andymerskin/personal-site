// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), vue()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/work": "/work/public",
  },
});

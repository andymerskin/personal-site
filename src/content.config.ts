import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.string(),
      year: z.string(),
      externalUrl: z.string().url(),
      classes: z.string().optional(),
      logo: image(),
    }),
});

export const collections = { work };


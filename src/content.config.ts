import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { file } from "astro/loaders";
import { SKILL_IDS } from "./content/skills.gen";

// Skill type order for consistent rendering
export const SKILL_TYPE_ORDER = [
  "leadership",
  "design",
  "engineering",
  "frontend",
  "backend",
  "delivery",
  "old",
] as const;

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) => {
    return z.object({
      title: z.string(),
      category: z.enum(["public", "private", "fun"]),
      type: z.string(),
      year: z.string(),
      headline: z.string(),
      externalUrl: z.string().url(),
      classes: z.string().optional(),
      logo: image(),
    });
  },
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      image: image().optional(),
    }),
});

const thoughts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/thoughts" }),
  schema: () =>
    z.object({
      date: z.date(),
      tags: z.array(z.string()).default([]),
    }),
});

const skills = defineCollection({
  loader: file("src/content/skills.yaml"),
  schema: z.object({
    id: z.enum(SKILL_IDS as unknown as [string, ...string[]]),
    name: z.string(),
    icon: z.string(),
    type: z.enum(SKILL_TYPE_ORDER),
  }),
});

const recommendations = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/recommendations" }),
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      job: z.string(),
      photo: image(),
    }),
});

const photos = defineCollection({
  loader: file("src/content/photos.yaml"),
  schema: ({ image }) =>
    z.object({
      src: image(),
      caption: z.string(),
    }),
});

export const collections = {
  work,
  blog,
  thoughts,
  skills,
  recommendations,
  photos,
};

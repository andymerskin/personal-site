import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { file } from "astro/loaders";
import fs from "fs";
import yaml from "js-yaml";

// Skill type order for consistent rendering
export const SKILL_TYPE_ORDER = [
  "leadership",
  "general",
  "design",
  "frontend",
  "backend",
  "delivery",
  "old",
] as const;

const work = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/work" }),
  schema: ({ image }) => {
    // Dynamically read skill IDs from the skills YAML file
    const skillsData = yaml.load(
      fs.readFileSync("./src/content/skills.yaml", "utf8"),
    ) as Array<{ id: string }>;
    const skillIds = skillsData.map((skill) => skill.id);

    return z.object({
      title: z.string(),
      type: z.string(),
      year: z.string(),
      headline: z.string(),
      externalUrl: z.string().url(),
      classes: z.string().optional(),
      logo: image(),
      skills: z
        .array(z.string())
        .refine((skills) => skills.every((skill) => skillIds.includes(skill)), {
          message: `Skills must be valid skill IDs from skills.yaml. Valid IDs: ${skillIds.join(", ")}`,
        })
        .optional(),
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
    name: z.string(),
    type: z.enum(SKILL_TYPE_ORDER),
  }),
});

export const collections = { work, blog, thoughts, skills };

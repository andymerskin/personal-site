export const DEFAULT_DESCRIPTION =
  "Principal Software Engineer leading engineering teams to success creating digital products, backed by thoughtful research, delightful user interactions, unified visual language, energizing motion, and well organized & optimized architecture.";

export const DEFAULT_SITE_URL = "https://2026.andymerskin.com";

export function getSiteUrl(site?: URL | string): string {
  if (typeof site === "string") return site;
  if (site instanceof URL) return site.href;
  return DEFAULT_SITE_URL;
}

export const PAGE_METADATA = {
  hello: {
    title: "Andy Merskin",
    description: DEFAULT_DESCRIPTION,
  },
  blog: {
    title: "Blog",
    description: "Just a few blurbs.",
  },
  "work/public": {
    title: "Work",
    description: "Selected product, UX, and engineering work.",
  },
  "work/private": {
    title: "Work (Private)",
    description: "Private case studies shared on request.",
  },
  "work/fun": {
    title: "Work (Fun)",
    description: "Side projects, experiments, and playful prototypes.",
  },
  thoughts: {
    title: "Thoughts",
    description: "Synapses firing.",
  },
  colleagues: {
    title: "Colleagues",
    description: "Recommendations and reflections from past colleagues.",
  },
  photos: {
    title: "Photos",
    description: "A few shots of life.",
  },
} as const;

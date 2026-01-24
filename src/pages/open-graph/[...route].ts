import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import removeMarkdown from "remove-markdown";
import { DEFAULT_DESCRIPTION, PAGE_METADATA } from "../../config/pageMetadata";

const toSummary = (body: string, maxLength = 160) => {
  const firstLine =
    body
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#")) ?? "";
  const cleaned = removeMarkdown(firstLine).replace(/\s+/g, " ").trim();

  if (!cleaned) return undefined;
  if (cleaned.length <= maxLength) return cleaned;

  return `${cleaned.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

const [blogEntries, workEntries] = await Promise.all([
  getCollection("blog"),
  getCollection("work"),
]);

const blogPages = Object.fromEntries(
  blogEntries.map((entry) => [
    `blog/${entry.id}`,
    {
      title: entry.data.title,
      description: toSummary(entry.body ?? "") ?? "A post by Andy Merskin.",
    },
  ]),
);

const workPages = Object.fromEntries(
  workEntries.map((entry) => [
    `work/${entry.id}`,
    {
      title: entry.data.title,
      description:
        entry.data.headline ??
        `${entry.data.type} work from ${entry.data.year}.`,
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages: {
    ...PAGE_METADATA,
    ...blogPages,
    ...workPages,
  },
  getImageOptions: (_path, page) => ({
    title: page.title ?? "Andy Merskin",
    description: page.description ?? DEFAULT_DESCRIPTION,
    padding: 80,
    bgGradient: [
      [10, 10, 12],
      [38, 30, 18],
    ],
    border: {
      color: [245, 158, 11],
      width: 12,
      side: "inline-start",
    },
    logo: {
      path: "./src/images/andy.jpg",
      size: [96, 96],
    },
    fonts: [
      "https://fonts.gstatic.com/s/worksans/v24/QGYsz_wNahGAdqQ43Rh_fKDptfpA4Q.woff2",
    ],
    font: {
      title: {
        color: [255, 255, 255],
        size: 84,
        weight: "Bold",
        lineHeight: 1.1,
        families: ["Work Sans"],
      },
      description: {
        color: [226, 232, 240],
        size: 36,
        weight: "Normal",
        lineHeight: 1.3,
        families: ["Work Sans"],
      },
    },
  }),
});

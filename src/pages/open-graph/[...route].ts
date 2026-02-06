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

const showTestContent =
  import.meta.env.VITE_SHOW_TEST_CONTENT === "true";

const [blogEntries, workEntries] = await Promise.all([
  getCollection("blog"),
  getCollection("work"),
]);

const blogPages = Object.fromEntries(
  blogEntries
    .filter(
      (entry) => !entry.data.draft && (showTestContent || !entry.data.test),
    )
    .map((entry) => [
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
      path: "./src/images/og-logo.png",
      size: [192, 192],
    },
    fonts: [
      // Known limitation: astro-og-canvas issue #68 - multiple font variations don't work
      // Workaround: Use only bold font, title will be bold, description will also be bold
      // but we can make it appear lighter with smaller size and different color
      "./src/fonts/work-sans-700.woff2",
    ],
    font: {
      title: {
        color: [255, 255, 255],
        size: 84,
        weight: "Normal", // Will use bold font since that's what's loaded
        lineHeight: 1.1,
        families: ["Work Sans"],
      },
      description: {
        color: [254, 243, 199], // #fef3c7 - Lighter color to compensate for bold weight
        size: 36,
        weight: "Normal",
        lineHeight: 1.3,
        families: ["Work Sans"],
      },
    },
  }),
});

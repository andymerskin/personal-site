import { promises as fs } from "node:fs";
import path from "node:path";
import {
  normalizeLinkUrl,
  type LinkPreview,
} from "../src/utils/linkPreviews";

const CONTENT_DIRECTORIES = [
  path.resolve("src/content/blog"),
  path.resolve("src/content/thoughts"),
];
const CACHE_PATH = path.resolve("src/content/link-previews.json");
const REQUEST_TIMEOUT_MS = 10_000;

const linkPreviewTagRegex = /<LinkWithPreview\b[^>]*>/gi;
const hrefAttributeRegex = /\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/i;

const collectMdxFiles = async (directory: string): Promise<string[]> => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files;
};

const extractLinkPreviewUrls = (content: string): string[] => {
  const urls: string[] = [];
  const tags = content.match(linkPreviewTagRegex) ?? [];

  for (const tag of tags) {
    const match = hrefAttributeRegex.exec(tag);
    const href = match?.[1] ?? match?.[2];
    if (href) {
      urls.push(href);
    }
  }

  return urls;
};

const getMetaTags = (html: string): Map<string, string> => {
  const metaTagRegex = /<meta\s+[^>]*>/gi;
  const attrRegex = /([\w:-]+)\s*=\s*["']([^"']*)["']/gi;
  const meta = new Map<string, string>();
  const tags = html.match(metaTagRegex) ?? [];

  for (const tag of tags) {
    const attrs: Record<string, string> = {};
    let match: RegExpExecArray | null;

    while ((match = attrRegex.exec(tag)) !== null) {
      attrs[match[1].toLowerCase()] = match[2];
    }

    const key = attrs.property ?? attrs.name;
    if (key && attrs.content) {
      meta.set(key.toLowerCase(), attrs.content);
    }
  }

  return meta;
};

const extractTitle = (html: string): string | undefined => {
  const match = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  return match?.[1]?.trim();
};

const resolveImageUrl = (imageUrl: string, baseUrl: string): string => {
  try {
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return imageUrl;
  }
};

const fetchPreview = async (targetUrl: string): Promise<LinkPreview | null> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://2026.andymerskin.com)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${targetUrl} (${response.status})`);
    }

    const html = await response.text();
    const meta = getMetaTags(html);
    const title =
      meta.get("og:title") ?? meta.get("twitter:title") ?? extractTitle(html);
    const description =
      meta.get("og:description") ??
      meta.get("twitter:description") ??
      meta.get("description");
    const image =
      meta.get("og:image") ??
      meta.get("twitter:image") ??
      meta.get("twitter:image:src");

    const resolvedImage =
      image && resolveImageUrl(image, response.url ?? targetUrl);

    return {
      url: response.url ?? targetUrl,
      title: title?.trim() || undefined,
      description: description?.trim() || undefined,
      image: resolvedImage?.trim() || undefined,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const loadCache = async (): Promise<Record<string, LinkPreview>> => {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    return JSON.parse(raw) as Record<string, LinkPreview>;
  } catch {
    return {};
  }
};

const writeCache = async (
  entries: Record<string, LinkPreview>,
): Promise<void> => {
  const ordered = Object.fromEntries(
    Object.keys(entries)
      .sort()
      .map((key) => [key, entries[key]]),
  );

  await fs.writeFile(CACHE_PATH, `${JSON.stringify(ordered, null, 2)}\n`);
};

const main = async () => {
  const mdxFiles = (
    await Promise.all(CONTENT_DIRECTORIES.map(collectMdxFiles))
  ).flat();
  const foundUrls = new Set<string>();

  for (const filePath of mdxFiles) {
    const content = await fs.readFile(filePath, "utf8");
    for (const url of extractLinkPreviewUrls(content)) {
      foundUrls.add(normalizeLinkUrl(url));
    }
  }

  const existingCache = await loadCache();
  const nextCache: Record<string, LinkPreview> = {};

  for (const normalizedUrl of foundUrls) {
    const existing = existingCache[normalizedUrl];
    let next = existing;

    try {
      const fetched = await fetchPreview(normalizedUrl);
      if (fetched) {
        next = {
          url: fetched.url || existing?.url || normalizedUrl,
          title: fetched.title || existing?.title,
          description: fetched.description || existing?.description,
          image: fetched.image || existing?.image,
        };
      }
    } catch (error) {
      console.warn(`⚠️  Preview fetch failed for ${normalizedUrl}`);
      console.warn(error instanceof Error ? error.message : error);
    }

    nextCache[normalizedUrl] = next ?? { url: normalizedUrl };
  }

  await writeCache(nextCache);
  console.log(`✅ Updated ${Object.keys(nextCache).length} link previews`);
};

await main();

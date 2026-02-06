export type LinkPreview = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
};

const TRACKING_PARAM_PREFIXES = ["utm_"];
const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
]);

export const normalizeLinkUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();

  try {
    const url = new URL(trimmed);

    url.hash = "";

    // Remove tracking parameters
    for (const key of [...url.searchParams.keys()]) {
      const lowerKey = key.toLowerCase();
      if (
        TRACKING_PARAMS.has(lowerKey) ||
        TRACKING_PARAM_PREFIXES.some((prefix) => lowerKey.startsWith(prefix))
      ) {
        url.searchParams.delete(key);
      }
    }

    // Sort parameters alphabetically
    const sortedParams = [...url.searchParams.entries()].sort((a, b) => {
      if (a[0] === b[0]) return a[1].localeCompare(b[1]);
      return a[0].localeCompare(b[0]);
    });
    url.search = "";
    for (const [key, value] of sortedParams) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  } catch {
    return trimmed;
  }
};

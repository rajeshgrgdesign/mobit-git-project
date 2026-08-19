import { cache } from "react";
import { WPApiError, type WPContent, type WPContentListItem } from "./types";

const API_BASE = process.env.WORDPRESS_API_URL;
const NAMESPACE = "headless/v1";

/** Seconds a page's data stays fresh via ISR before a background revalidation is triggered. */
export const DEFAULT_REVALIDATE_SECONDS = 3600;

export interface ContentTag {
  tags: string[];
}

function assertConfigured(): string {
  if (!API_BASE) {
    throw new Error(
      "WORDPRESS_API_URL is not set. Add it to your .env.local, e.g. https://cms.example.com/wp-json",
    );
  }
  return API_BASE.replace(/\/+$/, "");
}

/**
 * Low-level fetch wrapper around the RB Headless API.
 * Uses Next.js's fetch cache with content-scoped tags so a single
 * `revalidateTag()` call from the WordPress webhook invalidates just
 * the affected page instead of the whole cache.
 */
async function wpFetch<T>(
  path: string,
  options: { tags?: string[]; revalidate?: number | false } = {},
): Promise<T | null> {
  const base = assertConfigured();
  const url = `${base}/${NAMESPACE}${path}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: {
      tags: options.tags,
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
    },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new WPApiError(
      `RB Headless API request failed: ${res.status} ${res.statusText} (${url})`,
      res.status,
    );
  }

  return (await res.json()) as T;
}

/**
 * Resolve a page/post by its full hierarchical path, e.g. "parent/child/grandchild".
 * Wrapped in React `cache()` so multiple calls within the same render pass
 * (layout + page + generateMetadata) collapse into a single request.
 */
export const getContentByPath = cache(async (path: string): Promise<WPContent | null> => {
  const slug = path.replace(/^\/+|\/+$/g, "") || "home";
  return wpFetch<WPContent>(`/contents/${encodeURIComponent(slug)}`, {
    tags: [`content:${slug}`],
  });
});

/** Resolve a page/post by its numeric WordPress ID (used for previews / admin links). */
export const getContentById = cache(async (id: number | string): Promise<WPContent | null> => {
  return wpFetch<WPContent>(`/contents/${id}`, {
    tags: [`content:id:${id}`],
  });
});

/**
 * Full list of published slugs/paths, used by `generateStaticParams` to
 * pre-render every page at build time. Falls back to an empty array (pure
 * on-demand ISR) if the plugin doesn't expose a list endpoint yet.
 */
export const getAllContentPaths = cache(async (): Promise<WPContentListItem[]> => {
  try {
    const list = await wpFetch<WPContentListItem[]>(`/contents`, {
      tags: ["content:list"],
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    });
    return list ?? [];
  } catch {
    // List endpoint missing or unreachable at build time — degrade to
    // fully on-demand ISR instead of failing the build.
    return [];
  }
});

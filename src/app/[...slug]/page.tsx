import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllContentPaths, getContentByPath } from "@/lib/wp/client";
import { buildMetadata } from "@/lib/wp/seo";
import ContentPage from "@/components/ContentPage";

interface PageParams {
  slug: string[];
}

// ISR: pages are served statically from cache and only re-rendered in the
// background at most once per hour, or immediately on-demand when the
// `/api/revalidate` webhook fires from a WordPress save.
export const revalidate = 3600;

// Any path not returned by generateStaticParams is still served — it's
// rendered on first request and cached for subsequent ones, so new pages
// don't need a redeploy to go live.
export const dynamicParams = true;

/**
 * Pre-renders every known page (including nested parent/child/grandchild
 * paths) at build time so first requests are served from the CDN/static
 * cache instead of paying render cost on the critical path.
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  const items = await getAllContentPaths();
  return items
    .filter((item) => item.path && item.path !== "home")
    .map((item) => ({ slug: item.path.split("/").filter(Boolean) }));
}

async function resolveContent(params: Promise<PageParams>) {
  const { slug } = await params;
  const path = slug.join("/");
  return getContentByPath(path);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const content = await resolveContent(params);
  if (!content) return {};
  return buildMetadata(content);
}

export default async function CatchAllPage({ params }: { params: Promise<PageParams> }) {
  const content = await resolveContent(params);
  if (!content) notFound();

  return <ContentPage content={content} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentByPath } from "@/lib/wp/client";
import { buildMetadata } from "@/lib/wp/seo";
import ContentPage from "@/components/ContentPage";

// Static by default; content updates arrive via on-demand revalidation
// from the WordPress webhook (see /api/revalidate), with this interval
// as a safety-net fallback.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentByPath("home");
  if (!content) return {};
  return buildMetadata(content);
}

export default async function Home() {
  const content = await getContentByPath("home");
  if (!content) notFound();

  return <ContentPage content={content} />;
}

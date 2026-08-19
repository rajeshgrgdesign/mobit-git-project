import type { Metadata } from "next";
import type { WPContent } from "./types";

/** Builds Next.js `Metadata` from the RB Headless API's `seo` block and content fields. */
export function buildMetadata(content: WPContent): Metadata {
  const title = content.seo?.title || content.title;
  const description = content.seo?.description || content.excerpt;
  const images = content.seo?.ogImage
    ? [content.seo.ogImage]
    : content.featuredImage
      ? [content.featuredImage.url]
      : undefined;

  return {
    title,
    description,
    alternates: content.seo?.canonical ? { canonical: content.seo.canonical } : undefined,
    robots: content.seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images,
      type: content.type === "post" ? "article" : "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

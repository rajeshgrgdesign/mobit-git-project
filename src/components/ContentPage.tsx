import type { WPContent } from "@/lib/wp/types";
import Breadcrumbs from "@/components/Breadcrumbs";
import FlexibleContent from "@/components/flexible-content/FlexibleContent";

interface ContentPageProps {
  content: WPContent;
}

/**
 * Shared renderer for any resolved WP content node (home page, a
 * top-level page, or a nested child/grandchild page) — used by both
 * `app/page.tsx` and the `app/[...slug]/page.tsx` catch-all so the
 * hierarchy is rendered identically regardless of depth.
 */
export default function ContentPage({ content }: ContentPageProps) {
  const hasFlexibleContent = (content.flexibleContent?.length ?? 0) > 0;

  return (
    <main className="flex-1">
      <Breadcrumbs ancestors={content.ancestors ?? []} currentTitle={content.title} />
      {hasFlexibleContent ? (
        <FlexibleContent layouts={content.flexibleContent} />
      ) : (
        content.content && (
          <article className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="text-3xl font-bold text-neutral-900">{content.title}</h1>
            <div
              className="prose prose-neutral mt-6 max-w-none"
              // Content is sanitized server-side by the RB Headless API (wp_kses_post).
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </article>
        )
      )}
    </main>
  );
}

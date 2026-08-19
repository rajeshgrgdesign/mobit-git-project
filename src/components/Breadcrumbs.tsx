import Link from "next/link";
import type { WPAncestor } from "@/lib/wp/types";

interface BreadcrumbsProps {
  ancestors: WPAncestor[];
  currentTitle: string;
}

/**
 * Renders the parent → child → grandchild trail using the `ancestors`
 * chain returned by the RB Headless API, and emits BreadcrumbList
 * structured data for SEO.
 */
export default function Breadcrumbs({ ancestors, currentTitle }: BreadcrumbsProps) {
  if (!ancestors || ancestors.length === 0) return null;

  const items = [...ancestors, { id: 0, slug: "", title: currentTitle, path: "" }];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      ...(item.path ? { item: `/${item.path}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-6 py-4 text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.id || item.title} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="text-neutral-900">
                  {item.title}
                </span>
              ) : (
                <>
                  <Link href={`/${item.path}`} className="hover:text-neutral-900">
                    {item.title}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  );
}

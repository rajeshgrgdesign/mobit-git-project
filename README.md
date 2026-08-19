# Mobit — Headless WordPress Frontend

Next.js (App Router) + Tailwind CSS frontend for a headless WordPress site.
Pages are authored in WordPress with **ACF Flexible Content**, and served
to this app by the **RB Headless API** plugin.

## Requirements

- Node.js 20+
- A WordPress install with ACF Pro (Flexible Content) and the RB Headless
  API plugin active, exposing `/wp-json/headless/v1/contents/[slug|id]`

## Getting started

```bash
cp .env.example .env.local   # set WORDPRESS_API_URL and REVALIDATE_SECRET
npm install
npm run dev
```

## Content model & routing

- The WP API returns each page/post with its `ancestors` chain (root
  first) and `flexibleContent` layout rows, so a single response fully
  describes a node in the parent → child → grandchild hierarchy.
- `src/app/page.tsx` renders the WordPress front page (`contents/home`).
- `src/app/[...slug]/page.tsx` is a catch-all route: a URL like
  `/about/team/jane-doe` is joined into the path `about/team/jane-doe`
  and resolved in a single request to
  `/headless/v1/contents/about/team/jane-doe` — any nesting depth works
  without extra routes.
- `src/lib/wp/client.ts` is the only place that talks to WordPress. Every
  read goes through `getContentByPath` / `getContentById`, both wrapped in
  React's `cache()` so a layout + page + `generateMetadata` calling for the
  same content in one render dedupe into a single fetch.

## Flexible Content blocks

Each ACF flexible content layout maps to a React component via
`src/components/flexible-content/registry.tsx`:

```
acf_fc_layout: "hero"      → HeroBlock
acf_fc_layout: "rich_text" → RichTextBlock
acf_fc_layout: "image"     → ImageBlock
acf_fc_layout: "gallery"   → GalleryBlock (code-split, lazy-loaded)
acf_fc_layout: "cta"       → CtaBlock
```

To add a new ACF layout: create a block component under
`src/components/flexible-content/blocks/`, register it in `registry.tsx`,
done. Unknown layouts are skipped safely instead of crashing a page.

## Performance strategy

Performance was the top priority, so the app defaults to **static
rendering with on-demand ISR** rather than server-rendering every request:

1. **Build-time static generation.** `generateStaticParams` in the
   catch-all route pre-renders every known page path (via a `contents`
   list endpoint, when the plugin exposes one) so first byte comes from
   the static/CDN cache.
2. **On-demand revalidation, not polling.** `POST /api/revalidate`
   (`src/app/api/revalidate/route.ts`) lets WordPress push a cache-bust
   the instant a page is saved (wire it to `save_post` /
   `acf/save_post`), using tag-scoped `revalidateTag` so only the changed
   page is invalidated. A 1-hour `revalidate` window is kept as a
   fallback, not the primary freshness mechanism.
3. **New pages work without a redeploy.** `dynamicParams = true` means a
   path missing from the build-time list is rendered on first request and
   cached from then on.
4. **Request dedup.** `getContentByPath`/`getContentById` are wrapped in
   React `cache()`, so metadata + layout + page never issue duplicate
   fetches for the same content in one render pass.
5. **Image optimization.** All CMS images render through `next/image`
   (AVIF/WebP, responsive `sizes`), with `remotePatterns` scoped to the
   WordPress media host derived from `WORDPRESS_API_URL`. The first hero
   image on a page is marked `priority`/`fetchPriority="high"` to protect
   LCP.
6. **Code-splitting heavier blocks.** Blocks that aren't needed on every
   page (e.g. `GalleryBlock`) are loaded via `next/dynamic` from the
   registry, so pages that don't use them don't pay for their JS.
7. **Connection warm-up.** The root layout emits `preconnect`/
   `dns-prefetch` hints for the WordPress origin so the first API/image
   request skips DNS+TLS setup latency.
8. **Fonts** are loaded via `next/font` (self-hosted, zero layout shift,
   `display: swap`).
9. **Immutable caching** for fingerprinted `/_next/static` assets via
   response headers in `next.config.ts`.

## Environment variables

| Variable             | Description                                                                 |
| --------------------- | ---------------------------------------------------------------------------- |
| `WORDPRESS_API_URL`   | Base REST URL of WordPress, e.g. `https://cms.example.com/wp-json`          |
| `REVALIDATE_SECRET`   | Shared secret required by `/api/revalidate`, matched by the WP webhook      |

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build (static generation + type check)
npm run start   # run the production build
npm run lint    # eslint
```

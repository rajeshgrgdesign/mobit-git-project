import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand ISR revalidation endpoint.
 *
 * Hook this up to a WordPress `save_post` / `acf/save_post` action (via
 * the RB Headless API plugin, or a small mu-plugin) so that publishing or
 * updating a page invalidates just that page's cache entry instead of
 * waiting for the next scheduled ISR window. This is what lets pages be
 * served fully static/cached for performance while still staying fresh.
 *
 * Expected webhook payload:
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>
 *   { "slug": "parent/child", "id": 123 }
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  let body: { slug?: string; id?: number | string; path?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const slug = (body.slug ?? body.path)?.replace(/^\/+|\/+$/g, "");

  if (!slug && !body.id) {
    return NextResponse.json(
      { revalidated: false, message: "Provide a slug/path or id" },
      { status: 400 },
    );
  }

  // { expire: 0 } forces immediate expiration (vs. the stale-while-revalidate
  // default) — appropriate here since an external webhook is explicitly
  // telling us this content just changed.
  if (slug) {
    revalidateTag(`content:${slug}`, { expire: 0 });
    revalidatePath(slug === "home" ? "/" : `/${slug}`);
  }

  if (body.id) {
    revalidateTag(`content:id:${body.id}`, { expire: 0 });
  }

  // The list endpoint backs generateStaticParams — bust it too so newly
  // created pages get picked up without waiting for the next full rebuild.
  revalidateTag("content:list", { expire: 0 });

  return NextResponse.json({ revalidated: true, slug: slug ?? null, id: body.id ?? null });
}

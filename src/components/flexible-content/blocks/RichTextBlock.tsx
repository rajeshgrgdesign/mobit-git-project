interface RichTextBlockProps {
  content?: string;
}

/**
 * Renders pre-sanitized HTML coming from WordPress's `the_content` /
 * ACF WYSIWYG fields. The RB Headless API is responsible for running
 * this through `wp_kses_post` server-side before it ever reaches here.
 */
export default function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}

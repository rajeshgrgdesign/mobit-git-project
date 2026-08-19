import Link from "next/link";

interface CtaBlockProps {
  heading?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export default function CtaBlock({ heading, buttonText, buttonUrl }: CtaBlockProps) {
  if (!heading && !buttonUrl) return null;

  return (
    <section className="bg-neutral-100 px-6 py-16 text-center">
      {heading && <h2 className="text-2xl font-semibold text-neutral-900">{heading}</h2>}
      {buttonUrl && buttonText && (
        <Link
          href={buttonUrl}
          className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          {buttonText}
        </Link>
      )}
    </section>
  );
}

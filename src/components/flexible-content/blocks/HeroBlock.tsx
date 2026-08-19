import Image from "next/image";

interface HeroBlockProps {
  heading?: string;
  subheading?: string;
  image?: { url: string; alt: string; width: number; height: number };
  /** First hero on the page should be treated as the LCP element. */
  priority?: boolean;
}

export default function HeroBlock({ heading, subheading, image, priority = true }: HeroBlockProps) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-neutral-900 text-white">
      {image?.url && (
        <Image
          src={image.url}
          alt={image.alt ?? ""}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          className="object-cover opacity-70"
        />
      )}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {heading && <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h1>}
        {subheading && <p className="mt-4 text-lg text-neutral-200">{subheading}</p>}
      </div>
    </section>
  );
}

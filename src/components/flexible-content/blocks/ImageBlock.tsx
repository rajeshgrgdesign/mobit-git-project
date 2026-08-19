import Image from "next/image";

interface ImageBlockProps {
  image?: { url: string; alt: string; width: number; height: number };
  caption?: string;
}

export default function ImageBlock({ image, caption }: ImageBlockProps) {
  if (!image?.url) return null;

  return (
    <figure className="mx-auto max-w-4xl px-6 py-8">
      <Image
        src={image.url}
        alt={image.alt ?? ""}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 768px, 100vw"
        className="h-auto w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-neutral-500">{caption}</figcaption>
      )}
    </figure>
  );
}

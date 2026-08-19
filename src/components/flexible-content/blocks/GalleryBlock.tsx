import Image from "next/image";

interface GalleryImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface GalleryBlockProps {
  images?: GalleryImage[];
}

/**
 * Loaded via `next/dynamic` from the block registry so its (larger)
 * grid/lightbox markup only ships to pages that actually use a gallery.
 */
export default function GalleryBlock({ images }: GalleryBlockProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 py-8 sm:grid-cols-3">
      {images.map((image, index) => (
        <Image
          key={image.url}
          src={image.url}
          alt={image.alt ?? ""}
          width={image.width}
          height={image.height}
          sizes="(min-width: 640px) 33vw, 50vw"
          loading={index < 6 ? "eager" : "lazy"}
          className="h-auto w-full rounded-md object-cover"
        />
      ))}
    </section>
  );
}

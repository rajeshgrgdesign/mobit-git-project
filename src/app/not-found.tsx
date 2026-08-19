import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-neutral-900">Page not found</h1>
      <p className="mt-4 text-neutral-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 text-sm font-medium text-neutral-900 underline">
        Back to home
      </Link>
    </main>
  );
}

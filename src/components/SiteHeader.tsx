import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
          Mobit
        </Link>
      </div>
    </header>
  );
}

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-neutral-500">
        © {new Date().getFullYear()} Mobit. Powered by WordPress.
      </div>
    </footer>
  );
}

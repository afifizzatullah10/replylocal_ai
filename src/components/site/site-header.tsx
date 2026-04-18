import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground hover:text-foreground/90"
        >
          ReplyLocal
        </Link>

        <nav className="flex items-center justify-end gap-6 text-sm font-medium">
          <Link
            href="/demo"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/#waitlist"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Waitlist
          </Link>
        </nav>
      </div>
    </header>
  );
}

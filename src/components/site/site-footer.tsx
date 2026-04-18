import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3 max-w-md">
            <p className="font-semibold text-foreground">ReplyLocal</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Independent student project at Carnegie Mellon University in
              Pittsburgh. Piloting with local restaurant owners — not a
              CMU-administered service.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href="https://www.cmu.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
              aria-label="Carnegie Mellon University"
            >
              <Image
                src="/cmu-logo-mono.svg"
                alt="Carnegie Mellon University"
                width={220}
                height={44}
                className="h-10 w-auto dark:invert"
              />
            </a>
            <p className="text-xs text-muted-foreground text-left sm:text-right max-w-xs">
              Use of CMU name reflects affiliation as a student; this site is
              not endorsed by the university.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-8 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/demo" className="hover:text-foreground transition-colors">
            Demo
          </Link>
          <Link href="/#waitlist" className="hover:text-foreground transition-colors">
            Waitlist
          </Link>
        </div>
      </div>
    </footer>
  );
}

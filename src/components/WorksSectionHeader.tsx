import Link from "next/link";

import { cn } from "@/lib/utils";

type WorksSectionHeaderProps = {
  title: string;
  blurb: string;
  headingId: string;
  href: string;
  compact?: boolean;
};

export function WorksSectionHeader({
  title,
  blurb,
  headingId,
  href,
  compact = false,
}: WorksSectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        compact ? "pb-10 sm:pb-12" : "pb-12 sm:pb-14 lg:pb-16",
      )}
    >
      <div className="min-w-0">
        <h3
          id={headingId}
          className={cn(
            "font-display font-bold tracking-tight text-zinc-900",
            compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-[2.5rem]",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-xl leading-relaxed text-zinc-400",
            compact ? "text-sm" : "text-sm sm:text-base",
          )}
        >
          {blurb}
        </p>
      </div>

      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm text-zinc-400 transition-colors hover:text-zinc-900"
      >
        view all
      </Link>
    </header>
  );
}

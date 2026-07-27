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
        "flex flex-col gap-4 border-b border-zinc-200 sm:flex-row sm:items-end sm:justify-between",
        compact ? "pb-5" : "gap-6 pb-8",
      )}
    >
      <div className="min-w-0">
        <h3
          id={headingId}
          className={cn(
            "tracking-tight text-zinc-900",
            compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-1.5 max-w-2xl leading-relaxed text-zinc-500",
            compact ? "text-xs sm:text-sm" : "mt-2 text-sm",
          )}
        >
          {blurb}
        </p>
      </div>

      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
      >
        View all
      </Link>
    </header>
  );
}

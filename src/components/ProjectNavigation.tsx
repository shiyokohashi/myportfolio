import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

type ProjectNavigationProps = {
  prev?: PortfolioWork;
  next?: PortfolioWork;
  basePath?: string;
  className?: string;
};

export function ProjectNavigation({
  prev,
  next,
  basePath = "/projects",
  className,
}: ProjectNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Project navigation"
      className={cn(
        "mt-12 grid gap-6 pt-4 sm:grid-cols-2",
        className,
      )}
    >
      {prev ? (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="group block text-left transition-opacity hover:opacity-70"
        >
          <p className="text-sm text-zinc-400">Previous project</p>
          <p className="mt-1 text-lg text-zinc-900">← {prev.title}</p>
        </Link>
      ) : (
        <div aria-hidden />
      )}
      {next ? (
        <Link
          href={`${basePath}/${next.slug}`}
          className="group block text-left transition-opacity hover:opacity-70 sm:text-right"
        >
          <p className="text-sm text-zinc-400">Next project</p>
          <p className="mt-1 text-lg text-zinc-900">{next.title} →</p>
        </Link>
      ) : null}
    </nav>
  );
}

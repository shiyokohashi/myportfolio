import type { ReactNode } from "react";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CONTENT_MAX, PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

type PortfolioCategoryPageProps = {
  title: string;
  editHint: string;
  items: PortfolioWork[];
  basePath: string;
  intro?: ReactNode;
};

/** Shared layout for portfolio archive listing pages. */
export function PortfolioCategoryPage({
  title,
  editHint,
  items,
  basePath,
  intro,
}: PortfolioCategoryPageProps) {
  return (
    <main className={cn("relative z-10 pt-24 pb-40 sm:pt-28 sm:pb-44", PAGE_GUTTER)}>
      <div className={cn("mx-auto", CONTENT_MAX)}>
        <h1 className="text-4xl tracking-tight text-zinc-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 text-sm text-zinc-500">{editHint}</p>
        {intro && (
          <div className="mt-6 text-lg leading-relaxed text-zinc-700">{intro}</div>
        )}
        <PortfolioGrid items={items} basePath={basePath} />
      </div>
      <div className="min-h-[80vh]" aria-hidden />
    </main>
  );
}

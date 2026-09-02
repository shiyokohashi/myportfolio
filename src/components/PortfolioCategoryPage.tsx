import type { ReactNode } from "react";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CONTENT_MAX, PAGE_GUTTER, SITE_SURFACE } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

type PortfolioCategoryPageProps = {
  title: string;
  items: PortfolioWork[];
  basePath: string;
  intro?: ReactNode;
};

/** Shared layout for portfolio archive listing pages. */
export function PortfolioCategoryPage({
  title,
  items,
  basePath,
  intro,
}: PortfolioCategoryPageProps) {
  return (
    <main className={cn("relative z-10 pt-28 pb-48 sm:pt-32 sm:pb-52 lg:pb-56", SITE_SURFACE, PAGE_GUTTER)}>
      <div className={cn("mx-auto", CONTENT_MAX)}>
        <h1 className="text-4xl tracking-tight text-zinc-900 sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <div className="mt-6 text-lg leading-relaxed text-zinc-700">{intro}</div>
        )}
        <PortfolioGrid items={items} basePath={basePath} />
      </div>
      <div className="min-h-[80vh]" aria-hidden />
    </main>
  );
}

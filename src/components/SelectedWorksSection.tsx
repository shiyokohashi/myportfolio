"use client";

import type { ReactNode } from "react";

import { PortfolioCard } from "@/components/PortfolioCard";
import { WorksSectionHeader } from "@/components/WorksSectionHeader";
import {
  getSelectedWorksGroups,
  type SelectedWorksGroup,
} from "@/data/selected-works";
import { PAGE_GUTTER, SECTION_PY } from "@/lib/layout";
import { cn } from "@/lib/utils";

function WorksContainer({ children }: { children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl", PAGE_GUTTER)}>{children}</div>
  );
}

function gridClassName(count: number, gridColumns: 2 | 3): string {
  if (count === 1) return "grid-cols-1";

  if (gridColumns === 3) {
    return "sm:grid-cols-2 lg:grid-cols-3";
  }

  return "sm:grid-cols-2";
}

function CategorySection({
  title,
  blurb,
  href,
  items,
  gridColumns,
  compact,
}: SelectedWorksGroup) {
  const headingId = `works-${href.replace(/\//g, "")}`;
  const featured = items.filter((item) => item.layout === "featured");
  const rest = items.filter((item) => item.layout === "default");

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col", compact ? "py-12 sm:py-16" : SECTION_PY)}
    >
      <WorksContainer>
        <WorksSectionHeader
          title={title}
          blurb={blurb}
          headingId={headingId}
          href={href}
          compact={compact}
        />
      </WorksContainer>

      {featured.length > 0 ? (
        <div className="mt-10 flex flex-col gap-16 sm:mt-12 sm:gap-20">
          {featured.map((item) => (
            <PortfolioCard
              key={item.slug}
              item={item}
              basePath={href}
              size="featured"
            />
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <WorksContainer>
          <ul
            className={cn(
              "grid list-none",
              compact ? "gap-x-5 gap-y-8" : "gap-x-8 gap-y-12",
              featured.length > 0 ? "mt-12 sm:mt-16" : compact ? "mt-8 sm:mt-10" : "mt-10 sm:mt-12",
              gridClassName(rest.length, gridColumns),
            )}
          >
            {rest.map((item) => (
              <li key={item.slug}>
                <PortfolioCard
                  item={item}
                  basePath={href}
                  size={compact ? "compact" : "default"}
                  showSummary={!compact}
                />
              </li>
            ))}
          </ul>
        </WorksContainer>
      ) : null}
    </section>
  );
}

/** Selected works on the home page — projects, graphic design, paintings, journalism. */
export function SelectedWorksSection() {
  const groups = getSelectedWorksGroups();

  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="relative z-40 scroll-mt-24 border-t border-zinc-200 bg-white"
    >
      <WorksContainer>
        <header className="pb-4 pt-20 sm:pt-24 lg:pt-28">
          <h2
            id="works-heading"
            className="text-3xl tracking-tight text-zinc-900 sm:text-4xl"
          >
            Selected work
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
            Projects, design, painting, and journalism.
          </p>
        </header>
      </WorksContainer>

      <div className="divide-y divide-zinc-200">
        {groups.map((group) => (
          <CategorySection key={group.href} {...group} />
        ))}
      </div>
    </section>
  );
}

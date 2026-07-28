
import type { ReactNode } from "react";

import { PortfolioCard } from "@/components/PortfolioCard";
import { WorksSectionHeader } from "@/components/WorksSectionHeader";
import {
  getSelectedWorksGroups,
  type SelectedWorksGroup,
} from "@/data/selected-works";
import { PAGE_GUTTER, SECTION_PY, SECTION_PY_COMPACT, WORKS_MAX, PAGE_END_PB } from "@/lib/layout";
import { cn } from "@/lib/utils";

function WorksContainer({ children }: { children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full", WORKS_MAX, PAGE_GUTTER)}>{children}</div>
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
  featuredAfter = false,
  footerLink,
  isLast = false,
  sectionIndex = 0,
}: SelectedWorksGroup & { isLast?: boolean; sectionIndex?: number }) {
  const headingId = `works-${href.replace(/\//g, "")}`;
  const featured = items.filter((item) => item.layout === "featured");
  const rest = items.filter((item) => item.layout === "default");

  const featuredBlock =
    featured.length > 0 ? (
      <div
        className={cn(
          "flex flex-col",
          featuredAfter ? "mt-14 sm:mt-16 lg:mt-20" : "mt-14 sm:mt-16 lg:mt-20",
        )}
      >
        {featured.map((item) => (
          <PortfolioCard
            key={item.slug}
            item={item}
            basePath={href}
            size="featured"
          />
        ))}
      </div>
    ) : null;

  const gridBlock =
    rest.length > 0 ? (
      <WorksContainer>
        <ul
          className={cn(
            "grid list-none",
            compact ? "gap-x-8 gap-y-12 sm:gap-y-14" : "gap-x-10 gap-y-16 lg:gap-x-12 lg:gap-y-20",
            !featuredAfter && featured.length > 0
              ? "mt-16 sm:mt-20 lg:mt-24"
              : compact
                ? "mt-12 sm:mt-14"
                : "mt-14 sm:mt-16 lg:mt-20",
            gridClassName(rest.length, gridColumns),
          )}
        >
          {rest.map((item, index) => (
            <li key={item.slug}>
              <PortfolioCard
                item={item}
                basePath={href}
                size={compact ? "compact" : "default"}
                showSummary={!compact}
                priority={sectionIndex === 0 && index < 3}
              />
            </li>
          ))}
        </ul>
      </WorksContainer>
    ) : null;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col",
        compact ? SECTION_PY_COMPACT : SECTION_PY,
        isLast && PAGE_END_PB,
      )}
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

      {featuredAfter ? (
        <>
          {gridBlock}
          {featuredBlock}
        </>
      ) : (
        <>
          {featuredBlock}
          {gridBlock}
        </>
      )}

      {footerLink ? (
        <WorksContainer>
          <a
            href={footerLink.href}
            className="mt-14 block text-sm text-zinc-400 transition-colors hover:text-zinc-900 sm:mt-16"
          >
            {footerLink.label}
          </a>
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
      className="relative z-40 scroll-mt-24 bg-white [content-visibility:auto] [contain-intrinsic-size:auto_1200px]"
    >
      <WorksContainer>
        <header className="pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pb-12 lg:pt-40">
          <h2
            id="works-heading"
            className="font-display text-4xl tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]"
          >
            Selected work
          </h2>
        </header>
      </WorksContainer>

      <div>
        {groups.map((group, index) => (
          <CategorySection
            key={group.href}
            {...group}
            sectionIndex={index}
            isLast={index === groups.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

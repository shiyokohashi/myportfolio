import Image from "next/image";
import Link from "next/link";

import { PAGE_GUTTER } from "@/lib/layout";
import {
  buildPaintingRows,
  getPaintingDimensions,
  paintingFlexWeight,
  soloPaintingWidth,
} from "@/lib/paintingDimensions";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

function groupItems(items: PortfolioWork[]) {
  if (!items.some((item) => item.group)) {
    return [{ label: null as string | null, items }];
  }

  const sections = new Map<string, PortfolioWork[]>();

  for (const item of items) {
    const key = item.group ?? "Work";
    const list = sections.get(key) ?? [];
    list.push(item);
    sections.set(key, list);
  }

  return [...sections.entries()].map(([label, sectionItems]) => ({
    label,
    items: sectionItems,
  }));
}

function PaintingTile({
  work,
  basePath,
  solo = false,
}: {
  work: PortfolioWork;
  basePath: string;
  solo?: boolean;
}) {
  const imageCount = work.images?.length ?? 1;
  const isRemote = work.thumbnail?.startsWith("http");
  const dims = getPaintingDimensions(work);
  const flexWeight = paintingFlexWeight(work);

  return (
    <article
      className={cn("min-w-0", solo && "mx-auto w-full")}
      style={
        solo
          ? { maxWidth: soloPaintingWidth(work) }
          : { flex: `${flexWeight} 1 0%` }
      }
    >
      <div className="mb-3 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.14em] text-zinc-900">
        <h2 className="min-w-0 truncate font-sans font-normal">{work.title}</h2>
        <span className="shrink-0 tabular-nums text-zinc-500">
          ({imageCount})
        </span>
      </div>

      <Link
        href={`${basePath}/${work.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {work.thumbnail ? (
          <Image
            src={work.thumbnail}
            alt=""
            width={Math.round(dims.widthIn * 80)}
            height={Math.round(dims.heightIn * 80)}
            className="h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
            sizes={
              solo
                ? `(max-width: 640px) 100vw, ${soloPaintingWidth(work)}`
                : `(max-width: 640px) 100vw, ${Math.round((flexWeight / 40) * 100)}vw`
            }
            unoptimized={isRemote}
          />
        ) : (
          <div
            className="aspect-[4/3] w-full"
            style={{
              background: work.color
                ? `linear-gradient(135deg, ${work.color}44 0%, ${work.color}18 100%)`
                : "linear-gradient(135deg, #e4e4e7 0%, #f4f4f5 100%)",
            }}
          />
        )}
      </Link>
    </article>
  );
}

type PaintingsIndexPageProps = {
  title: string;
  items: PortfolioWork[];
  basePath: string;
};

/** Editorial paintings archive — size follows physical canvas dimensions. */
export function PaintingsIndexPage({
  title,
  items,
  basePath,
}: PaintingsIndexPageProps) {
  const sections = groupItems(items);

  return (
    <main className={cn("relative z-10 pb-32 pt-24 sm:pb-40 sm:pt-28", PAGE_GUTTER)}>
      <div className="mx-auto w-full max-w-[min(1680px,100%)]">
        <header className="border-b border-zinc-200 pb-8">
          <h1 className="font-sans text-3xl font-medium uppercase tracking-[0.06em] text-zinc-900 sm:text-4xl">
            {title}
          </h1>
        </header>

        {items.length === 0 ? (
          <p className="mt-12 text-sm text-zinc-500">No paintings yet.</p>
        ) : (
          <div className="mt-12 space-y-20 sm:mt-16 sm:space-y-24">
            {sections.map(({ label, items: sectionItems }) => (
              <section key={label ?? "all"}>
                {label ? (
                  <p className="mb-10 text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    {label}
                  </p>
                ) : null}

                <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
                  {buildPaintingRows(sectionItems).map((row, rowIndex) => (
                    <div
                      key={`${label ?? "all"}-${rowIndex}`}
                      className={cn(
                        "flex flex-col gap-14 sm:items-start sm:gap-8 lg:gap-12",
                        row.length > 1 && "sm:flex-row",
                      )}
                    >
                      {row.map((work) => (
                        <PaintingTile
                          key={work.slug}
                          work={work}
                          basePath={basePath}
                          solo={row.length === 1}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

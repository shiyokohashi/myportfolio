"use client";

import { MediaCover } from "@/components/MediaCover";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";
import type { PortfolioEditorialHero } from "@/types/portfolio";

type EditorialHeroProps = PortfolioEditorialHero;

/** Full-viewport case study opener — product render, headline, sprint metadata. */
export function EditorialHero({
  video,
  width,
  height,
  headline,
  tagline,
  metadata,
}: EditorialHeroProps) {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col bg-zinc-50">
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-8 sm:pt-28">
        <div
          className="relative w-full max-w-5xl overflow-hidden"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <MediaCover
            src={video}
            alt=""
            objectFit="contain"
            priority
            lazy={false}
            className="h-full w-full"
          />
        </div>
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-2xl pb-16 pt-2 text-center sm:pb-20",
          PAGE_GUTTER,
        )}
      >
        <h1 className="text-4xl tracking-[0.2em] text-zinc-900 sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
          {tagline}
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-zinc-500 sm:text-sm">
          {metadata.map((item, index) => (
            <li key={item} className="flex items-center gap-3">
              {index > 0 && (
                <span className="hidden text-zinc-300 sm:inline" aria-hidden>
                  ·
                </span>
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

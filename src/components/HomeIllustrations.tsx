import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";
import { HOME_ILLUSTRATIONS } from "@/data/home";
import {
  HOME_TYPE,
  HOME_CARD_MEDIA,
  HOME_CARD_MEDIA_IMG,
  HOME_GRID_GAP_COMPACT,
  PAGE_GUTTER,
  SECTION_PY,
  WORKS_MAX,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Illustrations / sketches */
export function HomeIllustrations() {
  return (
    <section
      id="illustrations"
      aria-labelledby="illustrations-heading"
      className={cn("relative scroll-mt-24", SECTION_PY, PAGE_GUTTER)}
    >
      <div className={cn("mx-auto w-full", WORKS_MAX)}>
        <ScrollReveal>
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
            <h2
              id="illustrations-heading"
              className={cn(HOME_TYPE.section, "max-w-2xl text-zinc-900")}
            >
              {HOME_ILLUSTRATIONS.title}
            </h2>
            <Link
              href={HOME_ILLUSTRATIONS.viewAll.href}
              className={cn(
                HOME_TYPE.meta,
                "shrink-0 text-zinc-500 transition-opacity hover:opacity-60 sm:pb-1",
              )}
            >
              {HOME_ILLUSTRATIONS.viewAll.label}
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </header>
        </ScrollReveal>

        <ul className={cn(HOME_GRID_GAP_COMPACT, "items-start sm:grid-cols-2 lg:grid-cols-3")}>
          {HOME_ILLUSTRATIONS.items.map((item, index) => (
            <li key={item.href} className="min-w-0">
              <ScrollReveal delayMs={index * 50} offsetY={20}>
                <Link href={item.href} className="group block text-left">
                  <div className={cn("relative aspect-[4/5]", HOME_CARD_MEDIA)}>
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      priority={index < 3}
                      className={HOME_CARD_MEDIA_IMG}
                    />
                  </div>
                  <div className="mt-6 space-y-2">
                    <h3
                      className={cn(
                        HOME_TYPE.item,
                        "text-zinc-900 transition-opacity duration-500 group-hover:opacity-70",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className={cn(HOME_TYPE.meta, "text-zinc-400")}>
                      {item.summary}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

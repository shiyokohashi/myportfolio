import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";
import { HOME_PAINTINGS } from "@/data/home";
import {
  HOME_TYPE,
  HOME_CARD_MEDIA,
  HOME_CARD_MEDIA_IMG,
  HOME_GRID_GAP,
  PAGE_GUTTER,
  SECTION_PY,
  WORKS_MAX,
} from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Paintings */
export function HomePaintings() {
  return (
    <section
      id="paintings"
      aria-labelledby="paintings-heading"
      className={cn("relative scroll-mt-24", SECTION_PY, PAGE_GUTTER)}
    >
      <div className={cn("mx-auto w-full", WORKS_MAX)}>
        <ScrollReveal>
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
            <h2
              id="paintings-heading"
              className={cn(HOME_TYPE.section, "max-w-2xl text-zinc-900")}
            >
              {HOME_PAINTINGS.title}
            </h2>
            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end sm:pb-1">
              <Link
                href={HOME_PAINTINGS.viewAll.href}
                className={cn(
                  HOME_TYPE.meta,
                  "text-zinc-500 transition-opacity hover:opacity-60",
                )}
              >
                {HOME_PAINTINGS.viewAll.label}
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
              <a
                href={HOME_PAINTINGS.commission.href}
                className={cn(
                  HOME_TYPE.meta,
                  "text-zinc-500 transition-opacity hover:opacity-60",
                )}
              >
                {HOME_PAINTINGS.commission.label}
              </a>
            </div>
          </header>
        </ScrollReveal>

        <ul className={cn(HOME_GRID_GAP, "items-start sm:grid-cols-2")}>
          {HOME_PAINTINGS.items.map((item, index) => (
            <li key={item.href} className="min-w-0">
              <ScrollReveal delayMs={index * 50} offsetY={24}>
                <Link href={item.href} className="group block text-left">
                  <div className={cn("relative aspect-[5/4]", HOME_CARD_MEDIA)}>
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      priority={index < 2}
                      className={HOME_CARD_MEDIA_IMG}
                    />
                  </div>
                  <h3
                    className={cn(
                      HOME_TYPE.item,
                      "mt-7 text-zinc-900 transition-opacity duration-500 group-hover:opacity-70 sm:mt-8",
                    )}
                  >
                    {item.title}
                  </h3>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

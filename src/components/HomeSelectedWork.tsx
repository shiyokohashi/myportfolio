import Image from "next/image";
import Link from "next/link";

import { MediaCover } from "@/components/MediaCover";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HOME_SELECTED_WORK } from "@/data/home";
import { PROJECTS } from "@/data/projects";
import {
  HOME_TYPE,
  HOME_CARD_MEDIA,
  HOME_CARD_MEDIA_IMG,
  HOME_CARD_MEDIA_IMG_CONTAIN,
  HOME_GRID_GAP,
  PAGE_GUTTER,
  SECTION_PY,
  WORKS_MAX,
} from "@/lib/layout";
import {
  getVideoPoster,
  isVideoSrc,
  shouldUseUnoptimized,
} from "@/lib/media";
import { getWorkBySlug } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

/** Selected Work — large media, consistent titles and body. */
export function HomeSelectedWork() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className={cn("relative z-40 scroll-mt-24 bg-white", SECTION_PY, PAGE_GUTTER)}
    >
      <div className={cn("mx-auto w-full", WORKS_MAX)}>
        <ScrollReveal>
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <h2
              id="work-heading"
              className={cn(HOME_TYPE.section, "max-w-2xl text-zinc-900")}
            >
              {HOME_SELECTED_WORK.title}
            </h2>
            <Link
              href={HOME_SELECTED_WORK.viewAll.href}
              className={cn(
                HOME_TYPE.meta,
                "shrink-0 text-zinc-500 transition-opacity hover:opacity-60 sm:pb-1",
              )}
            >
              {HOME_SELECTED_WORK.viewAll.label}
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </header>
        </ScrollReveal>

        <ul className={cn(HOME_GRID_GAP, "sm:grid-cols-2")}>
          {HOME_SELECTED_WORK.items.map((item, index) => {
            const slug = item.href.split("/").filter(Boolean).pop() ?? "";
            const work = getWorkBySlug(PROJECTS, slug);
            const thumbnail = work?.thumbnail ?? item.thumbnail;
            const thumbnailFit =
              work?.thumbnailFit ?? item.thumbnailFit ?? "cover";
            const poster = getVideoPoster(slug);
            const isVideo = isVideoSrc(thumbnail);
            const mediaClass =
              thumbnailFit === "contain"
                ? HOME_CARD_MEDIA_IMG_CONTAIN
                : HOME_CARD_MEDIA_IMG;
            const cropVideo = Boolean(work?.thumbnailCrop);

            return (
              <li key={item.href}>
                <ScrollReveal delayMs={index * 60} offsetY={24}>
                  <Link href={item.href} className="group block">
                    <div
                      className={cn(
                        "relative aspect-[16/11] sm:aspect-[5/4]",
                        HOME_CARD_MEDIA,
                      )}
                    >
                      {isVideo && thumbnail ? (
                        <MediaCover
                          src={thumbnail}
                          poster={poster}
                          sizes="(max-width: 640px) 100vw, 50vw"
                          priority={index < 2}
                          lazy={index >= 2}
                          objectFit={thumbnailFit}
                          cropVideoEdges={cropVideo}
                          cropScale={work?.videoCropScale ?? 1.03}
                          imageClassName={mediaClass}
                        />
                      ) : thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          priority={index < 2}
                          unoptimized={shouldUseUnoptimized(thumbnail)}
                          className={mediaClass}
                        />
                      ) : null}
                    </div>

                    <div className="mt-7 sm:mt-8">
                      <h3
                        className={cn(
                          HOME_TYPE.item,
                          "text-zinc-900 transition-opacity duration-500 group-hover:opacity-70",
                        )}
                      >
                        {item.title}
                      </h3>
                      <p className={cn(HOME_TYPE.body, "mt-3 text-zinc-500")}>
                        {item.blurb}
                      </p>
                      <p className={cn(HOME_TYPE.meta, "mt-3 text-zinc-400")}>
                        {item.roles}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

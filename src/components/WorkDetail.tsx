import Image from "next/image";
import Link from "next/link";

import { MediaCover } from "@/components/MediaCover";
import { cn } from "@/lib/utils";
import { isVideoSrc } from "@/lib/media";
import { CONTENT_MAX, PAGE_GUTTER } from "@/lib/layout";
import type {
  PortfolioSection,
  PortfolioSectionItem,
  PortfolioWork,
  SectionLayout,
} from "@/types/portfolio";

type WorkDetailProps = {
  work: PortfolioWork;
  categoryTitle: string;
  categoryHref: string;
  /** Show images at natural aspect ratio without cropping. */
  naturalImages?: boolean;
};

const SECTION_WIDTH: Record<SectionLayout, string> = {
  contained: "max-w-3xl",
  narrow: "max-w-xl",
  wide: "max-w-6xl",
  full: "max-w-[min(1600px,100vw)]",
};

function WorkMedia({
  item,
  alt,
  className,
  aspectClass = "aspect-[4/3]",
  natural,
}: {
  item: PortfolioSectionItem;
  alt: string;
  className?: string;
  aspectClass?: string;
  natural?: boolean;
}) {
  const src = item.video ?? item.image;
  if (!src) return null;

  const isVideo = isVideoSrc(src);
  const isRemote = src.startsWith("http");

  if (isVideo && item.width && item.height) {
    return (
      <div
        className={cn("overflow-hidden rounded-xl bg-zinc-50", className)}
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <MediaCover
            src={src}
            sizes="100vw"
            unoptimized
            objectFit="contain"
            cropVideoEdges
          />
        </div>
      </div>
    );
  }

  if (natural && item.width && item.height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={item.width}
        height={item.height}
        className={cn("h-auto w-full", className)}
        sizes="100vw"
        unoptimized={isRemote}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-zinc-100",
        aspectClass,
        className,
      )}
    >
      <MediaCover
        src={src}
        sizes="(max-width: 768px) 100vw, 768px"
        unoptimized={isRemote}
        objectFit="contain"
      />
    </div>
  );
}

function WorkImage({
  src,
  alt,
  className,
  aspectClass = "aspect-[4/3]",
  natural,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
  natural?: boolean;
  width?: number;
  height?: number;
}) {
  const isRemote = src.startsWith("http");

  if (natural && width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("h-auto w-full", className)}
        sizes="100vw"
        unoptimized={isRemote}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-zinc-100",
        aspectClass,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 768px"
        unoptimized={isRemote}
      />
    </div>
  );
}

function EditorialFigure({
  item,
  workTitle,
}: {
  item: PortfolioSectionItem;
  workTitle: string;
}) {
  const mediaSrc = item.video ?? item.image;

  return (
    <figure className="space-y-3">
      <WorkMedia item={item} alt={item.title ?? workTitle} natural />
      {(item.title || item.description) && mediaSrc && (
        <figcaption className={cn("space-y-1 text-sm text-zinc-600 sm:px-0", PAGE_GUTTER)}>
          {item.title && (
            <p className="font-medium text-zinc-900">{item.title}</p>
          )}
          {item.description && <p>{item.description}</p>}
        </figcaption>
      )}
    </figure>
  );
}

function EditorialSection({
  section,
  workTitle,
}: {
  section: PortfolioSection;
  workTitle: string;
}) {
  const layout = section.layout ?? "contained";
  const widthClass = SECTION_WIDTH[layout];
  const isFull = layout === "full";

  return (
    <section className={cn("mt-16 md:mt-24", isFull && "mt-20 md:mt-28")}>
      <div className={cn("mx-auto", PAGE_GUTTER, SECTION_WIDTH.contained)}>
        <h2 className="text-2xl tracking-tight text-zinc-900 md:text-3xl">
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
            {section.description}
          </p>
        )}
      </div>

      <div
        className={cn(
          "mt-8 md:mt-10",
          isFull ? "px-0" : cn("mx-auto", PAGE_GUTTER, widthClass),
        )}
      >
        {section.items.map((item) => (
          <EditorialFigure
            key={item.video ?? item.image ?? section.title}
            item={item}
            workTitle={workTitle}
          />
        ))}
      </div>
    </section>
  );
}

function StandardSection({
  section,
  workTitle,
}: {
  section: PortfolioSection;
  workTitle: string;
}) {
  return (
    <section className="mt-14 pt-10">
      <h2 className="text-2xl tracking-tight text-zinc-900">{section.title}</h2>
      {section.description && (
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          {section.description}
        </p>
      )}

      <div
        className={
          section.variant === "banner"
            ? "mt-6"
            : "mt-6 grid gap-8 sm:grid-cols-2"
        }
      >
        {section.items.map((item) => (
          <figure
            key={item.video ?? item.image ?? item.title}
            className={section.variant === "banner" ? "" : "space-y-3"}
          >
            <WorkMedia
              item={item}
              alt={item.title ?? workTitle}
              aspectClass={
                section.variant === "banner" ? "aspect-[3/4]" : "aspect-[4/3]"
              }
            />
            {(item.title || item.description) && (
              <figcaption className="space-y-1 text-sm text-zinc-600">
                {item.title && (
                  <p className="font-medium text-zinc-900">{item.title}</p>
                )}
                {item.description && <p>{item.description}</p>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Detail page layout for a single portfolio entry. */
export function WorkDetail({
  work,
  categoryTitle,
  categoryHref,
  naturalImages = false,
}: WorkDetailProps) {
  const meta = [work.year, work.role ?? work.medium, work.group].filter(Boolean);
  const hasSections = work.sections && work.sections.length > 0;
  const isEditorial = work.detailLayout === "editorial";

  return (
    <main className="relative z-10 pt-24 pb-40 sm:pt-28 sm:pb-44">
      <article className={cn("mx-auto", CONTENT_MAX, PAGE_GUTTER)}>
        <Link
          href={categoryHref}
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          ← Back to {categoryTitle}
        </Link>

        <header className="mt-8 pb-10 sm:mt-10 sm:pb-12">
          <h1 className="text-4xl tracking-tight text-zinc-900 sm:text-5xl">{work.title}</h1>
          {meta.length > 0 && (
            <p className="mt-4 text-sm text-zinc-500">{meta.join(" · ")}</p>
          )}
          {work.tags && work.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {!hasSections && work.images && work.images.length > 0 && (
          <div className="mt-12 space-y-8 sm:mt-14">
            {work.images.map((src) => (
              <WorkImage
                key={src}
                src={src}
                alt={work.title}
                natural={naturalImages}
                width={naturalImages ? 2400 : undefined}
                height={naturalImages ? 1800 : undefined}
              />
            ))}
          </div>
        )}

        <div className="mt-12 space-y-6 text-lg leading-relaxed text-zinc-700 sm:mt-14">
          {work.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {work.pdfUrl && (
          <p className="mt-8">
            <a
              href={work.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              View case study PDF →
            </a>
          </p>
        )}

        {!isEditorial &&
          hasSections &&
          work.sections!.map((section) => (
            <StandardSection
              key={section.title}
              section={section}
              workTitle={work.title}
            />
          ))}

        {work.externalUrl && (
          <p className="mt-8">
            <a
              href={work.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              View live project →
            </a>
          </p>
        )}
      </article>

      {isEditorial &&
        hasSections &&
        work.sections!.map((section) => (
          <EditorialSection
            key={section.title}
            section={section}
            workTitle={work.title}
          />
        ))}

      <div className="min-h-[40vh]" aria-hidden />
    </main>
  );
}

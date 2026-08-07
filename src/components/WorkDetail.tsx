import Image from "next/image";

import { EditorialHero } from "@/components/EditorialHero";
import { MediaCover } from "@/components/MediaCover";
import { StoryboardExecutionVideo } from "@/components/StoryboardExecutionVideo";
import { WorkflowSteps } from "@/components/WorkflowSteps";
import { cn } from "@/lib/utils";
import { isVideoSrc, shouldUseUnoptimized } from "@/lib/media";
import { CONTENT_MAX, PAGE_GUTTER } from "@/lib/layout";
import type {
  PortfolioSection,
  PortfolioSectionItem,
  PortfolioWork,
  SectionLayout,
} from "@/types/portfolio";

type WorkDetailProps = {
  work: PortfolioWork;
  /** Show images at natural aspect ratio without cropping. */
  naturalImages?: boolean;
};

const SUBSECTION_HEADING = "text-xl tracking-tight text-zinc-900 md:text-2xl";

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
  const nativeWidth = item.width;
  const nativeHeight = item.height;
  const renderWidth =
    item.displayWidth != null && nativeWidth != null
      ? Math.min(item.displayWidth, nativeWidth)
      : nativeWidth;
  const sizeHint =
    renderWidth != null
      ? `(max-width: ${renderWidth}px) 100vw, ${renderWidth}px`
      : "(max-width: 1200px) 100vw, 1200px";
  const frameStyle =
    renderWidth && nativeHeight && nativeWidth
      ? ({
          maxWidth: renderWidth,
          aspectRatio: `${nativeWidth} / ${nativeHeight}`,
        } as const)
      : undefined;

  if (isVideo && nativeWidth && nativeHeight) {
    return (
      <div
        className={cn("mx-auto w-full overflow-hidden bg-zinc-50", className)}
        style={frameStyle}
      >
        <div className="relative h-full w-full overflow-hidden">
          <MediaCover
            src={src}
            sizes={sizeHint}
            objectFit={item.cropVideo ? "cover" : "contain"}
            cropVideoEdges={item.cropVideo}
            cropScale={1.12}
          />
        </div>
      </div>
    );
  }

  if (natural && nativeWidth && nativeHeight) {
    return (
      <div className={cn("mx-auto w-full", className)} style={{ maxWidth: renderWidth }}>
        <Image
          src={src}
          alt={alt}
          width={nativeWidth}
          height={nativeHeight}
          className="h-auto w-full"
          sizes={sizeHint}
          quality={92}
          unoptimized={shouldUseUnoptimized(src) || src.startsWith("/images/projects/")}
        />
      </div>
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
        unoptimized={shouldUseUnoptimized(src)}
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
  if (natural && width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("h-auto w-full", className)}
        sizes="100vw"
        unoptimized={shouldUseUnoptimized(src)}
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
        unoptimized={shouldUseUnoptimized(src)}
      />
    </div>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-zinc-200 bg-zinc-50 px-6 text-center text-sm text-zinc-400"
      aria-hidden
    >
      {label}
    </div>
  );
}

const STORYBOARD_THUMB_WIDTH = 280;

function StoryboardRow({
  item,
  workTitle,
}: {
  item: PortfolioSectionItem;
  workTitle: string;
}) {
  const mediaSrc = item.image ?? item.video;
  const placeholderLabel = item.title
    ? `${item.title} — media coming soon`
    : "Media coming soon";
  const thumbItem = { ...item, displayWidth: STORYBOARD_THUMB_WIDTH, video: item.image ? undefined : item.video };
  const executionItem =
    item.executionVideo && item.executionVideoWidth && item.executionVideoHeight
      ? {
          src: item.executionVideo,
          width: item.executionVideoWidth,
          height: item.executionVideoHeight,
          startTime: item.executionVideoStart ?? 0,
        }
      : null;

  return (
    <div className="flex flex-col gap-5 border-b border-zinc-100 pb-10 last:border-0 md:flex-row md:items-start md:gap-10">
      <figure className="w-full shrink-0 md:w-[280px]">
        {mediaSrc ? (
          <WorkMedia
            item={thumbItem}
            alt={item.title ?? workTitle}
            natural
            className="mx-0"
          />
        ) : (
          <MediaPlaceholder label={placeholderLabel} />
        )}
      </figure>
      {(item.title || item.shot || executionItem) && (
        <div className="min-w-0 flex-1">
          {item.title && (
            <p className="text-base font-medium text-zinc-900 md:text-lg">
              {item.title}
            </p>
          )}
          {item.shot && (
            <dl className="mt-4 grid gap-6 sm:grid-cols-3 sm:gap-8">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Visual
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600 md:text-base">
                  {item.shot.visual}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Audio
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600 md:text-base">
                  {item.shot.audio}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {executionItem ? "Execution" : "Purpose"}
                </dt>
                <dd className="mt-1.5">
                  {executionItem ? (
                    <StoryboardExecutionVideo
                      src={executionItem.src}
                      width={executionItem.width}
                      height={executionItem.height}
                      startTime={executionItem.startTime}
                      alt={`${item.title ?? workTitle} execution`}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-zinc-600 md:text-base">
                      {item.shot.purpose}
                    </p>
                  )}
                </dd>
              </div>
            </dl>
          )}
          {!item.shot && executionItem && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Execution
              </p>
              <StoryboardExecutionVideo
                src={executionItem.src}
                width={executionItem.width}
                height={executionItem.height}
                startTime={executionItem.startTime}
                alt={`${item.title ?? workTitle} execution`}
                className="mt-1.5"
              />
            </div>
          )}
        </div>
      )}
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
  const captionWidth =
    item.displayWidth != null && item.width != null
      ? Math.min(item.displayWidth, item.width)
      : item.width;
  const placeholderLabel = item.title
    ? `${item.title} — media coming soon`
    : "Media coming soon";

  return (
    <figure className="space-y-3">
      {mediaSrc ? (
        <WorkMedia item={item} alt={item.title ?? workTitle} natural />
      ) : (
        <MediaPlaceholder label={placeholderLabel} />
      )}
      {(item.description || item.shot) && (
        <figcaption
          className={cn("space-y-2 text-sm text-zinc-600 sm:px-0")}
          style={captionWidth != null ? { maxWidth: captionWidth } : undefined}
        >
          {item.shot ? (
            <dl className="space-y-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Visual
                </dt>
                <dd className="mt-0.5 leading-relaxed">{item.shot.visual}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Audio
                </dt>
                <dd className="mt-0.5 leading-relaxed">{item.shot.audio}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Purpose
                </dt>
                <dd className="mt-0.5 leading-relaxed">{item.shot.purpose}</dd>
              </div>
            </dl>
          ) : (
            item.description && <p>{item.description}</p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function FeatureEntry({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="font-medium text-zinc-900">{title}</p>
      <p className="mt-1 text-base leading-relaxed text-zinc-600 md:text-lg">{description}</p>
    </div>
  );
}

function FeatureWrapSection({
  section,
  workTitle,
}: {
  section: PortfolioSection;
  workTitle: string;
}) {
  const wrap = section.featureWrap!;
  const imageWidth = wrap.image.displayWidth ?? 240;

  return (
    <section className="mt-16 md:mt-24">
      <div className={cn("mx-auto", PAGE_GUTTER, SECTION_WIDTH.wide)}>
        <h2 className="text-2xl tracking-tight text-zinc-900 md:text-3xl">{section.title}</h2>

        <div className="mt-8 w-full">
          {wrap.heading && (
            <h3 className={SUBSECTION_HEADING}>{wrap.heading}</h3>
          )}
          <div
            className={cn(
              "grid items-start gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-10 lg:gap-x-14",
              wrap.heading ? "mt-4" : "mt-0",
            )}
          >
            <div className="order-2 space-y-5 md:order-1 md:pt-2">
              {wrap.left.map((entry) => (
                <FeatureEntry key={entry.title} {...entry} />
              ))}
            </div>

            <figure className="order-1 mx-auto w-full shrink-0 md:order-2" style={{ maxWidth: imageWidth }}>
              <Image
                src={wrap.image.image}
                alt={`${workTitle} interaction`}
                width={wrap.image.width}
                height={wrap.image.height}
                className="h-auto w-full"
                sizes={`${imageWidth}px`}
                quality={92}
                unoptimized={
                  shouldUseUnoptimized(wrap.image.image) ||
                  wrap.image.image.startsWith("/images/projects/")
                }
              />
            </figure>

            <div className="order-3 space-y-5 md:pt-2">
              {wrap.right.map((entry) => (
                <FeatureEntry key={entry.title} {...entry} />
              ))}
            </div>
          </div>
        </div>

        {section.descriptionGroups && section.descriptionGroups.length > 0 && (
          <div className="mt-10 w-full space-y-10">
            <DescriptionGroups
              groups={section.descriptionGroups}
              headingClassName={SUBSECTION_HEADING}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function DescriptionGroups({
  groups,
  headingClassName,
  listClassName,
  entriesClassName,
}: {
  groups: NonNullable<PortfolioSection["descriptionGroups"]>;
  headingClassName?: string;
  listClassName?: string;
  entriesClassName?: string;
}) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading || group.points?.[0] || group.entries?.[0]?.title}>
          {group.heading && (
            <h3 className={cn(headingClassName ?? "text-sm font-medium uppercase tracking-wide text-zinc-900")}>
              {group.heading}
            </h3>
          )}
          {group.entries && group.entries.length > 0 ? (
            <dl
              className={cn(
                group.heading ? "mt-4" : "mt-0",
                entriesClassName,
                group.entriesLayout === "horizontal"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                  : "space-y-4",
              )}
            >
              {group.entries.map(({ title, description }) => (
                <div key={title}>
                  <dt className="font-medium text-zinc-900">{title}</dt>
                  <dd className="mt-1 leading-relaxed text-zinc-600">{description}</dd>
                </div>
              ))}
            </dl>
          ) : (
            group.points &&
            group.points.length > 0 && (
              <ul
                className={cn(
                  "space-y-1.5 leading-relaxed text-zinc-600",
                  group.heading ? "mt-2" : "mt-0",
                  listClassName ?? "text-base md:text-lg",
                )}
              >
                {group.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )
          )}
        </div>
      ))}
    </>
  );
}

function EditorialSection({
  section,
  workTitle,
}: {
  section: PortfolioSection;
  workTitle: string;
}) {
  if (section.featureWrap) {
    return <FeatureWrapSection section={section} workTitle={workTitle} />;
  }

  const layout = section.layout ?? "contained";
  const widthClass = SECTION_WIDTH[layout];
  const isFull = layout === "full";
  const hasColumns = section.columns && section.columns.length > 0;
  const itemsFirst = section.itemsPlacement === "before";

  const itemsBlock =
    section.items.length > 0 ? (
      <div
        className={cn(
          itemsFirst ? "mt-6 md:mt-8" : "mt-8 md:mt-10",
          "mx-auto",
          PAGE_GUTTER,
          widthClass,
          section.itemsLayout === "storyboard"
            ? "flex flex-col gap-10"
            : section.itemsLayout === "grid-4" && section.items.length > 1
              ? "grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
              : section.itemsLayout === "grid-3" && section.items.length > 1
                ? "grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                : section.itemsLayout === "grid" && section.items.length > 1
                  ? "grid items-start gap-8 sm:grid-cols-2 sm:gap-10"
                  : "flex flex-col gap-10",
        )}
      >
        {section.items.map((item) =>
          section.itemsLayout === "storyboard" ? (
            <StoryboardRow
              key={item.video ?? item.image ?? item.title ?? section.title}
              item={item}
              workTitle={workTitle}
            />
          ) : (
            <EditorialFigure
              key={item.video ?? item.image ?? item.title ?? section.title}
              item={item}
              workTitle={workTitle}
            />
          ),
        )}
      </div>
    ) : null;

  return (
    <section className={cn("mt-16 md:mt-24", isFull && "mt-20 md:mt-28")}>
      {!hasColumns && (
      <div
        className={cn(
          "mx-auto",
          PAGE_GUTTER,
          layout === "wide" || layout === "full"
            ? SECTION_WIDTH.wide
            : SECTION_WIDTH.contained,
        )}
      >
        <h2 className="text-2xl tracking-tight text-zinc-900 md:text-3xl">
          {section.title}
        </h2>
        {section.description && (
          <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-zinc-600 md:text-lg">
            {section.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {!itemsFirst && section.descriptionGroups && section.descriptionGroups.length > 0 && (
          <div
            className={cn(
              "mt-8 space-y-10",
              layout === "wide" || layout === "full" ? "max-w-4xl" : "max-w-2xl",
            )}
          >
            <DescriptionGroups groups={section.descriptionGroups} />
          </div>
        )}
      </div>
      )}

      {itemsFirst && itemsBlock}

      {!hasColumns && itemsFirst && section.descriptionGroups && section.descriptionGroups.length > 0 && (
        <div
          className={cn(
            "mx-auto mt-8 space-y-10 md:mt-10",
            PAGE_GUTTER,
            layout === "wide" || layout === "full" ? SECTION_WIDTH.wide : SECTION_WIDTH.contained,
            layout === "wide" || layout === "full" ? "max-w-4xl" : "max-w-2xl",
          )}
        >
          <DescriptionGroups groups={section.descriptionGroups} />
        </div>
      )}

      {hasColumns && (
        <div className={cn("mx-auto", PAGE_GUTTER, SECTION_WIDTH.wide)}>
          {section.descriptionGroups && section.descriptionGroups.length > 0 && (
            <h2 className="text-2xl tracking-tight text-zinc-900 md:text-3xl">{section.title}</h2>
          )}
          <div
            className={cn(
              "grid gap-10",
              section.descriptionGroups && section.descriptionGroups.length > 0
                ? "mt-8"
                : "",
              section.columns!.length === 3
                ? "md:grid-cols-3 md:gap-10 lg:gap-12"
                : section.columns!.length >= 4
                  ? "md:grid-cols-2 xl:grid-cols-4 xl:gap-8"
                  : "md:grid-cols-2 md:gap-12 lg:gap-16",
            )}
          >
            {section.columns!.map((column) => (
              <div key={column.title}>
                <h2
                  className={cn(
                    "tracking-tight text-zinc-900",
                    section.columns!.length === 3
                      ? "text-xl md:text-2xl"
                      : section.columns!.length >= 4
                        ? "text-lg md:text-xl"
                        : "text-2xl md:text-3xl",
                  )}
                >
                  {column.title}
                </h2>
                {column.description && (
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-zinc-600 md:text-lg">
                    {column.description.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {column.descriptionGroups && column.descriptionGroups.length > 0 && (
                  <div className="mt-4 space-y-4">
                    <DescriptionGroups
                      groups={column.descriptionGroups}
                      headingClassName="text-xs font-medium uppercase tracking-wide text-zinc-900"
                      listClassName="text-sm md:text-base"
                      entriesClassName="text-sm md:text-base"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {section.descriptionGroups && section.descriptionGroups.length > 0 && (
            <div className="mt-12 w-full">
              <DescriptionGroups
                groups={section.descriptionGroups}
                headingClassName={SUBSECTION_HEADING}
              />
            </div>
          )}
        </div>
      )}

      {!itemsFirst && itemsBlock}
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
  naturalImages = false,
}: WorkDetailProps) {
  const meta = [work.year, work.role ?? work.medium, work.group].filter(Boolean);
  const hasSections = work.sections && work.sections.length > 0;
  const isEditorial = work.detailLayout === "editorial";
  const hasEditorialHero = Boolean(work.editorialHero);
  const showIntro = !hasEditorialHero;

  return (
    <main
      className={cn(
        "relative z-10 pb-40 sm:pb-44",
        hasEditorialHero ? "pt-0" : "pt-24 sm:pt-28",
      )}
    >
      {work.editorialHero && <EditorialHero {...work.editorialHero} />}

      {showIntro && (
      <article className={cn("mx-auto", CONTENT_MAX, PAGE_GUTTER)}>
        <header className="pb-10 sm:pb-12">
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

        {work.overview && (
          <section className="border-t border-zinc-200 pt-10 sm:pt-12">
            <h2 className="text-2xl tracking-tight text-zinc-900 sm:text-3xl">
              {work.overview.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-700">
              {work.overview.text}
            </p>
          </section>
        )}

        {work.challenge && (
          <section className="mt-10 border-t border-zinc-200 pt-10 sm:mt-12 sm:pt-12">
            <h2 className="text-2xl tracking-tight text-zinc-900 sm:text-3xl">
              {work.challenge.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-700">
              {work.challenge.text}
            </p>
          </section>
        )}

        {work.snapshot && (
          <section className="mt-10 border-t border-zinc-200 pt-8 sm:mt-12 sm:pt-10">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              {work.snapshot.title}
            </h2>
            <dl className="mt-4 max-w-2xl space-y-3 text-sm">
              {work.snapshot.items.map((item) => (
                <div key={item.label} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                  <dt className="font-medium text-zinc-900">{item.label}</dt>
                  <dd className="text-zinc-600">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

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
      )}

      {work.workflow && <WorkflowSteps {...work.workflow} />}

      {!showIntro && work.externalUrl && (
        <p className={cn("mx-auto mt-8", CONTENT_MAX, PAGE_GUTTER)}>
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

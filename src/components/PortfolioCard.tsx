import Link from "next/link";

import { FeaturedVideoCover } from "@/components/FeaturedVideoCover";
import { MediaCover } from "@/components/MediaCover";
import { PortfolioImage } from "@/components/PortfolioImage";
import { PAGE_GUTTER, WORKS_MAX } from "@/lib/layout";
import { getVideoPoster, isVideoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { PortfolioWork } from "@/types/portfolio";

const captionLineClass = "m-0 block w-full text-left font-sans leading-snug";

/** Spacing below the media frame — shared between featured video and its caption. */
const FEATURED_CAPTION_GAP = "mt-5";
const FEATURED_CAPTION_INNER = "space-y-1.5";

type PortfolioCardProps = {
  item: PortfolioWork;
  basePath: string;
  showGroup?: boolean;
  size?: "default" | "large" | "featured" | "compact";
  className?: string;
  showSummary?: boolean;
  priority?: boolean;
};

function FeaturedCaption({
  item,
  showGroup,
  showSummary,
}: {
  item: PortfolioWork;
  showGroup: boolean;
  showSummary: boolean;
}) {
  return (
    <div className={cn(FEATURED_CAPTION_GAP, FEATURED_CAPTION_INNER)}>
      {showGroup && item.group && (
        <p className={cn(captionLineClass, "text-xs text-zinc-400")}>{item.group}</p>
      )}
      <p
        className={cn(
          captionLineClass,
          "text-base font-medium tracking-tight text-zinc-900 sm:text-lg",
        )}
      >
        {item.title}
      </p>
      {showSummary && item.summary ? (
        <p className={cn(captionLineClass, "max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base")}>
          {item.summary}
        </p>
      ) : null}
    </div>
  );
}

export function PortfolioCard({
  item,
  basePath,
  showGroup = false,
  size = "default",
  className,
  showSummary = true,
  priority = false,
}: PortfolioCardProps) {
  const isFeatured = size === "featured";
  const isLarge = size === "large";
  const isCompact = size === "compact";
  const isVideo = isVideoSrc(item.thumbnail);
  const exactMediaFrame = isFeatured && isVideo && item.mediaAspect;
  const videoPoster = getVideoPoster(item.slug);
  const imagePriority = priority || isFeatured;
  const imageSizes = isFeatured
    ? "(max-width: 1280px) 90vw, 1200px"
    : "(max-width: 640px) 100vw, 50vw";

  function renderCover({
    sizes,
    objectFit,
    cropVideoEdges,
    imageClassName,
  }: {
    sizes: string;
    objectFit?: "cover" | "contain";
    cropVideoEdges?: boolean;
    imageClassName?: string;
  }) {
    if (!item.thumbnail) return null;

    if (isVideo && isFeatured) {
      return (
        <FeaturedVideoCover
          src={item.thumbnail}
          poster={videoPoster}
          sizes={sizes}
          priority={imagePriority}
          objectFit={objectFit}
          cropVideoEdges={cropVideoEdges}
        />
      );
    }

    if (isVideo) {
      return (
        <MediaCover
          src={item.thumbnail}
          sizes={sizes}
          poster={videoPoster}
          priority={imagePriority}
          lazy={!imagePriority}
          objectFit={objectFit}
          cropVideoEdges={cropVideoEdges}
          imageClassName={imageClassName}
        />
      );
    }

    return (
      <PortfolioImage
        src={item.thumbnail}
        sizes={sizes}
        priority={imagePriority}
        objectFit={objectFit}
        imageClassName={imageClassName}
      />
    );
  }

  if (exactMediaFrame && item.mediaAspect) {
    const { width, height } = item.mediaAspect;

    return (
      <Link
        href={`${basePath}/${item.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("group flex flex-col", className)}
      >
        <div className={cn("mx-auto w-full", WORKS_MAX, PAGE_GUTTER)}>
          <div className="overflow-hidden rounded-xl">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: `${width} / ${height}` }}
            >
              {renderCover({
                sizes: "(max-width: 1280px) 90vw, 1200px",
                objectFit: "contain",
                cropVideoEdges: true,
              })}
            </div>
          </div>

          <FeaturedCaption item={item} showGroup={showGroup} showSummary={showSummary} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`${basePath}/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group flex flex-col", className)}
    >
      <div
        className={cn(isFeatured && cn("mx-auto w-full", WORKS_MAX, PAGE_GUTTER))}
      >
        <div
          className={cn(
            "overflow-hidden bg-zinc-50/80 ring-1 ring-zinc-200/50",
            "transition-[ring-color,opacity,transform] duration-500 ease-out",
            "group-hover:ring-zinc-300/80 group-hover:opacity-[0.98]",
            isFeatured ? "rounded-xl ring-zinc-200/60" : "rounded-lg",
          )}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden",
              isFeatured
                ? isVideo
                  ? "aspect-video"
                  : "aspect-[16/10]"
                : isCompact
                  ? "aspect-[4/3]"
                  : isLarge
                    ? "aspect-[4/3] sm:aspect-[16/10]"
                    : "aspect-[4/3]",
            )}
          >
            {item.thumbnail ? (
              renderCover({
                sizes: imageSizes,
                objectFit: isVideo && isFeatured ? "contain" : undefined,
                cropVideoEdges: isVideo && isFeatured,
                imageClassName:
                  isVideo && isFeatured
                    ? undefined
                    : "transition-transform duration-700 ease-out group-hover:scale-[1.015]",
              })
            ) : (
              <div
                className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                style={{
                  background: item.color
                    ? `linear-gradient(135deg, ${item.color}44 0%, ${item.color}18 100%)`
                    : "linear-gradient(135deg, #e4e4e7 0%, #f4f4f5 100%)",
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "w-full",
          isFeatured
            ? cn("mx-auto", WORKS_MAX, PAGE_GUTTER, FEATURED_CAPTION_GAP, FEATURED_CAPTION_INNER)
            : isCompact
              ? "mt-4"
              : isLarge
                ? "mt-5 sm:mt-6"
                : "mt-4 sm:mt-5",
        )}
      >
        {showGroup && item.group && (
          <p className={cn(captionLineClass, "text-xs text-zinc-400")}>{item.group}</p>
        )}
        <p
          className={cn(
            captionLineClass,
            isFeatured
              ? "text-base font-medium tracking-tight text-zinc-900 sm:text-lg"
              : isCompact
                ? "text-sm font-medium tracking-tight text-zinc-900"
                : "text-sm font-medium tracking-tight text-zinc-900 sm:text-base",
          )}
        >
          {item.title}
        </p>
        {showSummary && item.summary ? (
          <p
            className={cn(
              captionLineClass,
              "text-sm leading-relaxed text-zinc-400",
              isFeatured ? "max-w-2xl sm:text-base" : "mt-1.5",
            )}
          >
            {item.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

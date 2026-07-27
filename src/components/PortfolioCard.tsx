import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PAGE_GUTTER } from "@/lib/layout";
import type { PortfolioWork } from "@/types/portfolio";

const captionLineClass = "m-0 block w-full text-left font-sans leading-snug";

type PortfolioCardProps = {
  item: PortfolioWork;
  basePath: string;
  showGroup?: boolean;
  size?: "default" | "large" | "featured" | "compact";
  className?: string;
  showSummary?: boolean;
};

export function PortfolioCard({
  item,
  basePath,
  showGroup = false,
  size = "default",
  className,
  showSummary = true,
}: PortfolioCardProps) {
  const isRemote = item.thumbnail?.startsWith("http");
  const isFeatured = size === "featured";
  const isLarge = size === "large";
  const isCompact = size === "compact";

  return (
    <Link
      href={`${basePath}/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group flex flex-col", className)}
    >
      <div
        className={cn(
          "overflow-hidden border border-zinc-200/90 bg-zinc-100",
          "transition-[border-color,opacity] duration-300 ease-out",
          "group-hover:border-zinc-300 group-hover:opacity-95",
          isFeatured && "border-x-0 border-t-0 sm:border-x-0",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden",
            isFeatured
              ? "aspect-[4/3] min-h-[42vh] sm:aspect-[16/10] sm:min-h-[48vh] lg:aspect-[2/1] lg:min-h-[58vh]"
              : isCompact
                ? "aspect-[4/3]"
                : isLarge
                  ? "aspect-[4/3] sm:aspect-[16/10]"
                  : "aspect-[4/3]",
          )}
        >
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes={
                isFeatured
                  ? "100vw"
                  : isLarge
                    ? "(max-width: 640px) 100vw, 50vw"
                    : "(max-width: 640px) 100vw, 50vw"
              }
              unoptimized={isRemote}
            />
          ) : (
            <div
              className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              style={{
                background: item.color
                  ? `linear-gradient(135deg, ${item.color}44 0%, ${item.color}18 100%)`
                  : "linear-gradient(135deg, #e4e4e7 0%, #f4f4f5 100%)",
              }}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "w-full",
          isFeatured ? cn("mx-auto max-w-6xl", PAGE_GUTTER, "mt-5 sm:mt-6") : isCompact ? "mt-2.5" : isLarge ? "mt-4 sm:mt-5" : "mt-3 sm:mt-4",
        )}
      >
        {showGroup && item.group && (
          <p className={cn(captionLineClass, "text-xs text-zinc-400")}>
            {item.group}
          </p>
        )}
        <p
          className={cn(
            captionLineClass,
            isFeatured
              ? "text-base font-medium text-zinc-900 sm:text-lg"
              : isCompact
                ? "text-xs font-medium text-zinc-900 sm:text-sm"
                : "text-sm font-medium text-zinc-900",
          )}
        >
          {item.title}
        </p>
        {showSummary && item.summary ? (
          <p
            className={cn(
              captionLineClass,
              "mt-1 text-sm text-zinc-500",
              isFeatured && "max-w-2xl sm:text-base",
            )}
          >
            {item.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

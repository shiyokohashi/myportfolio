"use client";

import Image from "next/image";

import { isVideoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaCoverProps = {
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  unoptimized?: boolean;
  objectFit?: "cover" | "contain";
  /** Slight zoom on video cover to hide edge artifacts. */
  cropVideoEdges?: boolean;
  containPadding?: boolean;
};

/** Image or autoplaying looped video for card thumbnails and previews. */
export function MediaCover({
  src,
  alt = "",
  className,
  imageClassName,
  sizes,
  unoptimized = false,
  objectFit = "cover",
  cropVideoEdges = false,
  containPadding = false,
}: MediaCoverProps) {
  if (!src) {
    return null;
  }

  if (isVideoSrc(src)) {
    const fit =
      cropVideoEdges || objectFit === "contain" ? "object-contain" : "object-cover";

    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden={!alt}
        className={cn(
          "h-full w-full",
          fit,
          cropVideoEdges && "origin-center scale-x-[1.14] scale-y-[1.035]",
          containPadding && "p-1",
          className,
          imageClassName,
        )}
        src={src}
      />
    );
  }

  const isRemote = src.startsWith("http");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn(
        objectFit === "contain" ? "object-contain" : "object-cover",
        containPadding && "p-1",
        imageClassName,
        className,
      )}
      sizes={sizes}
      unoptimized={unoptimized || isRemote}
    />
  );
}

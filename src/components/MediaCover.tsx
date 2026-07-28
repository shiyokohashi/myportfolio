"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useInView } from "@/hooks/useInView";
import { isVideoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaCoverProps = {
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  unoptimized?: boolean;
  priority?: boolean;
  /** Defer fetching until near the viewport. */
  lazy?: boolean;
  poster?: string;
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
  priority = false,
  lazy = true,
  poster,
  objectFit = "cover",
  cropVideoEdges = false,
  containPadding = false,
}: MediaCoverProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "480px 0px",
    once: true,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoad = priority || !lazy || inView;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !isVideoSrc(src)) return;

    if (inView) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, shouldLoad, src]);

  if (!src) {
    return null;
  }

  if (isVideoSrc(src)) {
    const fit =
      cropVideoEdges || objectFit === "contain" ? "object-contain" : "object-cover";

    return (
      <div ref={ref} className={cn("relative h-full w-full", className)}>
        {shouldLoad ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload={priority ? "metadata" : "none"}
            poster={poster}
            aria-hidden={!alt}
            className={cn(
              "h-full w-full",
              fit,
              cropVideoEdges && "origin-center scale-x-[1.14] scale-y-[1.035]",
              containPadding && "p-1",
              imageClassName,
            )}
            src={src}
          />
        ) : (
          poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              aria-hidden
              className={cn("h-full w-full object-cover", imageClassName)}
            />
          ) : (
            <div className="h-full w-full bg-zinc-100" aria-hidden />
          )
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      {shouldLoad ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn(
            objectFit === "contain" ? "object-contain" : "object-cover",
            containPadding && "p-1",
            imageClassName,
          )}
          sizes={sizes}
          unoptimized={unoptimized}
        />
      ) : (
        <div className="h-full w-full bg-zinc-100" aria-hidden />
      )}
    </div>
  );
}

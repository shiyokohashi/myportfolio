"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { useInView } from "@/hooks/useInView";
import { isVideoSrc, shouldUseUnoptimized } from "@/lib/media";
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
  /** Scale factor when cropVideoEdges is true. */
  cropScale?: number;
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
  cropScale = 1.2,
  containPadding = false,
}: MediaCoverProps) {
  const needsObserver = lazy && !priority;
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "640px 0px",
    once: true,
    disabled: !needsObserver,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldLoad = priority || !lazy || inView;
  const useUnoptimized = shouldUseUnoptimized(src ?? "", unoptimized);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !isVideoSrc(src)) return;

    if (inView || priority || !lazy) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, lazy, priority, shouldLoad, src]);

  if (!src) {
    return null;
  }

  if (isVideoSrc(src)) {
    const fit = objectFit === "contain" ? "object-contain" : "object-cover";
    const cropStyle = cropVideoEdges
      ? { transform: `scale(${cropScale})` }
      : undefined;

    return (
      <div ref={needsObserver ? ref : undefined} className={cn("relative h-full w-full overflow-hidden", className)}>
        {!shouldLoad && poster ? (
          <Image
            src={poster}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            unoptimized={shouldUseUnoptimized(poster, unoptimized)}
            aria-hidden
            className={cn(
              fit,
              cropVideoEdges && "origin-center",
              containPadding && "p-1",
              imageClassName,
            )}
            style={cropStyle}
          />
        ) : shouldLoad ? (
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
              cropVideoEdges && "origin-center",
              containPadding && "p-1",
              imageClassName,
            )}
            style={cropStyle}
            src={src}
          />
        ) : (
          <div className="h-full w-full bg-zinc-100" aria-hidden />
        )}
      </div>
    );
  }

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      loading={priority ? undefined : lazy ? "lazy" : "eager"}
      className={cn(
        objectFit === "contain" ? "object-contain" : "object-cover",
        containPadding && "p-1",
        imageClassName,
      )}
      sizes={sizes}
      unoptimized={useUnoptimized}
    />
  );

  if (!needsObserver) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        {image}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      {shouldLoad ? image : <div className="h-full w-full bg-zinc-100" aria-hidden />}
    </div>
  );
}

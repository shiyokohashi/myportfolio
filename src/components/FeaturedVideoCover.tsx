"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/useInView";
import { shouldUseUnoptimized } from "@/lib/media";
import { cn } from "@/lib/utils";

type FeaturedVideoCoverProps = {
  src: string;
  poster?: string;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  cropVideoEdges?: boolean;
};

/** Poster loads immediately; video mounts only when near the viewport. */
export function FeaturedVideoCover({
  src,
  poster,
  sizes,
  priority = false,
  objectFit = "cover",
  cropVideoEdges = false,
}: FeaturedVideoCoverProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "480px 0px",
    once: true,
    disabled: priority,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const shouldLoadVideo = priority || inView;
  const fit =
    cropVideoEdges || objectFit === "contain" ? "object-contain" : "object-cover";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;
    void video.play().catch(() => undefined);
  }, [shouldLoadVideo]);

  return (
    <div ref={ref} className="relative h-full w-full">
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={shouldUseUnoptimized(poster)}
          aria-hidden
          className={cn(
            fit,
            cropVideoEdges && "origin-center scale-x-[1.14] scale-y-[1.035]",
            videoReady && "opacity-0 transition-opacity duration-300",
          )}
        />
      ) : null}

      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={priority ? "metadata" : "none"}
          poster={poster}
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full",
            fit,
            cropVideoEdges && "origin-center scale-x-[1.14] scale-y-[1.035]",
            !videoReady && poster && "opacity-0",
            videoReady && "opacity-100 transition-opacity duration-300",
          )}
          src={src}
        />
      ) : null}
    </div>
  );
}

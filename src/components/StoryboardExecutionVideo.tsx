"use client";

import { useEffect, useRef } from "react";

import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type StoryboardExecutionVideoProps = {
  src: string;
  width: number;
  height: number;
  displayWidth?: number;
  startTime?: number;
  alt: string;
  className?: string;
};

/** Storyboard execution clip — seeks to startTime, loops when scrolled into view. */
export function StoryboardExecutionVideo({
  src,
  width,
  height,
  displayWidth = 360,
  startTime = 0,
  alt,
  className,
}: StoryboardExecutionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.35,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playFromStart = () => {
      video.currentTime = startTime;
      if (inView) {
        void video.play().catch(() => undefined);
      }
    };

    const handleEnded = () => {
      video.currentTime = startTime;
      void video.play().catch(() => undefined);
    };

    if (inView) {
      if (video.readyState >= 1) {
        playFromStart();
      } else {
        video.addEventListener("loadedmetadata", playFromStart, { once: true });
      }
    } else {
      video.pause();
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadedmetadata", playFromStart);
    };
  }, [inView, startTime]);

  return (
    <div
      ref={ref}
      className={cn("w-full overflow-hidden bg-zinc-50", className)}
      style={{
        maxWidth: displayWidth,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        className="h-full w-full object-contain"
        src={src}
      />
    </div>
  );
}

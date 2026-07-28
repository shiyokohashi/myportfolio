"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

import { BACKGROUND_VIDEO } from "@/config/background";
import { useHorseSpeed } from "@/contexts/HorseSpeedContext";
import { useSmoothBackgroundSaturation } from "@/hooks/useSmoothBackgroundSaturation";

/**
 * Fixed full-viewport background video (Firefly grass breeze).
 * Saturation peaks at ~0.1× and ~1.7×; fully greyscale at 0.2×.
 */
export function VideoBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { speedRef } = useHorseSpeed();
  const videoRef = useRef<HTMLVideoElement>(null);

  useSmoothBackgroundSaturation(speedRef, videoRef);

  if (!isHome) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden bg-zinc-900"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full scale-[1.03] object-cover"
        style={{
          filter: `blur(${BACKGROUND_VIDEO.blurPx}px) saturate(0) brightness(${BACKGROUND_VIDEO.brightness})`,
        }}
        src={BACKGROUND_VIDEO.src}
      />
    </div>
  );
}

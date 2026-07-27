"use client";

import {
  BACKGROUND_VIDEO,
} from "@/config/background";
import { useHorseSpeed } from "@/contexts/HorseSpeedContext";
import { useSmoothBackgroundSaturation } from "@/hooks/useSmoothBackgroundSaturation";

/**
 * Fixed full-viewport background video (Firefly grass breeze).
 * Saturation peaks at ~0.1× and ~1.7×; fully greyscale at 0.2×.
 */
export function VideoBackground() {
  const { speed } = useHorseSpeed();
  const saturation = useSmoothBackgroundSaturation(speed);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-900"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full scale-[1.03] object-cover"
        style={{
          filter: `blur(${BACKGROUND_VIDEO.blurPx}px) saturate(${saturation}) brightness(${BACKGROUND_VIDEO.brightness})`,
        }}
        src={BACKGROUND_VIDEO.src}
      />
    </div>
  );
}

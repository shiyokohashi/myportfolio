"use client";

import { usePathname } from "next/navigation";

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
  const { speed } = useHorseSpeed();
  const saturation = useSmoothBackgroundSaturation(speed);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden bg-zinc-900"
      style={{ opacity: isHome ? 1 : 0 }}
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

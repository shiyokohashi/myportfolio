"use client";

import { useEffect, useRef, type RefObject } from "react";

import { BACKGROUND_VIDEO, getBackgroundVideoSaturation } from "@/config/background";

const SATURATION_LERP = 0.14;

/** Eases video saturation via direct DOM updates — no React re-renders. */
export function useSmoothBackgroundSaturation(
  speed: number,
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const saturationRef = useRef(getBackgroundVideoSaturation(speed));

  useEffect(() => {
    let rafId = 0;

    const applyFilter = (saturation: number) => {
      const node = videoRef.current;
      if (!node) return;
      node.style.filter = `blur(${BACKGROUND_VIDEO.blurPx}px) saturate(${saturation}) brightness(${BACKGROUND_VIDEO.brightness})`;
    };

    const tick = () => {
      const target = getBackgroundVideoSaturation(speedRef.current);
      const current = saturationRef.current;
      const next = current + (target - current) * SATURATION_LERP;

      if (Math.abs(next - target) < 0.001) {
        saturationRef.current = target;
        applyFilter(target);
      } else {
        saturationRef.current = next;
        applyFilter(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    applyFilter(saturationRef.current);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [videoRef]);
}

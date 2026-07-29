"use client";

import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";

import { BACKGROUND_VIDEO, getBackgroundVideoSaturation } from "@/config/background";

const SATURATION_LERP = 0.14;
const FILTER_EPSILON = 0.008;

/** Eases video saturation via direct DOM updates — reads live speed from ref, no React re-renders. */
export function useSmoothBackgroundSaturation(
  speedRef: MutableRefObject<number>,
  videoRef: RefObject<HTMLVideoElement | null>,
) {
  const saturationRef = useRef<number | null>(null);
  const appliedSaturationRef = useRef(-1);

  useEffect(() => {
    let rafId = 0;
    saturationRef.current = getBackgroundVideoSaturation(speedRef.current);

    const applyFilter = (saturation: number) => {
      if (Math.abs(saturation - appliedSaturationRef.current) < FILTER_EPSILON) {
        return;
      }

      appliedSaturationRef.current = saturation;
      const node = videoRef.current;
      if (!node) return;
      node.style.filter = `blur(${BACKGROUND_VIDEO.blurPx}px) saturate(${saturation}) brightness(${BACKGROUND_VIDEO.brightness})`;
    };

    const tick = () => {
      const target = getBackgroundVideoSaturation(speedRef.current);
      const current = saturationRef.current ?? target;
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
  }, [speedRef, videoRef]);
}

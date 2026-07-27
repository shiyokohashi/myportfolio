"use client";

import { useEffect, useRef, useState } from "react";

import { getBackgroundVideoSaturation } from "@/config/background";

const SATURATION_LERP = 0.14;

/** Smoothly eases displayed saturation toward the speed-driven target. */
export function useSmoothBackgroundSaturation(speed: number): number {
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const [saturation, setSaturation] = useState(() =>
    getBackgroundVideoSaturation(speed),
  );
  const saturationRef = useRef(saturation);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const target = getBackgroundVideoSaturation(speedRef.current);
      const current = saturationRef.current;
      const next = current + (target - current) * SATURATION_LERP;

      if (Math.abs(next - target) < 0.001) {
        saturationRef.current = target;
        setSaturation(target);
      } else {
        saturationRef.current = next;
        setSaturation(next);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return saturation;
}

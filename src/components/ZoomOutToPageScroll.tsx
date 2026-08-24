"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type ZoomOutToPageScrollProps = {
  maxDistance: number;
};

/**
 * At max orbit zoom, further wheel-out / trackpad zoom-out scrolls the page
 * toward the Shiyo Ohashi intro instead of fighting the camera clamp.
 */
export function ZoomOutToPageScroll({ maxDistance }: ZoomOutToPageScrollProps) {
  const gl = useThree((state) => state.gl);
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | null,
  );
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  useEffect(() => {
    const el = gl.domElement;

    const onWheel = (event: WheelEvent) => {
      const orbit = controlsRef.current;
      if (!orbit) return;

      const distance = orbit.getDistance();
      const atMaxZoomOut = distance >= maxDistance - 0.08;
      const zoomingOut = event.deltaY > 0;

      if (!atMaxZoomOut || !zoomingOut) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      el.removeEventListener("wheel", onWheel, true);
    };
  }, [gl, maxDistance]);

  return null;
}

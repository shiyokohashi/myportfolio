"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { useDomeGallery } from "@/app/lab/home/next/DomeGalleryProvider";

/** Only count orbit turns while the user is actively dragging. */
export function DomeOrbitDrag() {
  const controls = useThree((state) => state.controls);
  const { isDraggingRef } = useDomeGallery();

  useEffect(() => {
    const orbit = controls as OrbitControlsImpl | null;
    if (!orbit) return;

    const onStart = () => {
      isDraggingRef.current = true;
    };
    const onEnd = () => {
      isDraggingRef.current = false;
    };

    orbit.addEventListener("start", onStart);
    orbit.addEventListener("end", onEnd);

    return () => {
      orbit.removeEventListener("start", onStart);
      orbit.removeEventListener("end", onEnd);
    };
  }, [controls, isDraggingRef]);

  return null;
}
